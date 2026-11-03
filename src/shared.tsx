import React, { useState, useMemo } from 'react'
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, Loader2 } from 'lucide-react'

export function PageHeader({ title, subtitle, action }: { title:string; subtitle?:string; action?:React.ReactNode }) { return <div className="page-header"><div><div className="eyebrow">CITYOPS · MANAGEMENT</div><h1>{title}</h1>{subtitle&&<p>{subtitle}</p>}</div>{action}</div> }
export function Toolbar({ query, setQuery, count=25 }: { query:string; setQuery:(v:string)=>void; count?:number }) { return <div className="toolbar"><label>Show <select defaultValue={String(count)}><option>10</option><option>25</option><option>50</option><option>100</option></select> entries</label><div className="search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search records..."/></div></div> }
export function TableWrap({children}:{children:React.ReactNode}){return <div className="table-scroll"><table>{children}</table></div>}
export function TableHead({children}:{children:React.ReactNode}){return <thead><tr>{children}</tr></thead>}
export function Th({children}:{children:React.ReactNode}){return <th>{children}<span>↕</span></th>}
export function Pagination({total=2}:{total?:number}){return <div className="pagination"><span>Showing 1 to {total} of {total} entries</span><div><button>Previous</button><button className="current">1</button><button>Next</button></div></div>}
export function Status({children='Active'}:{children?:React.ReactNode}){return <span className="status"><i/>{children}</span>}

export function PageLoader() {
  return (
    <div className="page-loader">
      <Loader2 size={32} className="animate-spin" />
      <p>Loading...</p>
    </div>
  );
}

export function Field({label,value,type='text',required,textarea,placeholder,options}:{label:string;value?:string;type?:string;required?:boolean;textarea?:boolean;placeholder?:string;options?:string[]}){
 return <label className="field"><span>{required&&<i>*</i>}{label}</span>{
  textarea
   ? <textarea defaultValue={value} placeholder={placeholder}/>
   : type==='select'
    ? <select defaultValue={value}>{placeholder&&<option value="">{placeholder}</option>}{(options||(value?[value]:[])).map(o=><option key={o}>{o}</option>)}</select>
    : <input type={type} defaultValue={value} placeholder={placeholder}/>
 }</label>
}

export function FormCard({title,icon,children}:{title:string;icon?:React.ReactNode;children:React.ReactNode}){
 return <section className="form-card"><header>{icon&&<span className="form-card-icon">{icon}</span>}<h3>{title}</h3></header><div className="form-card-body">{children}</div></section>
}

type Column<T> = {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  pageSize?: number;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchable = true,
  pageSize = 25,
  onRowClick,
  emptyMessage = 'No records found'
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(row =>
        columns.some(col => {
          const value = row[col.key as keyof T];
          return String(value).toLowerCase().includes(query);
        })
      );
    }

    if (sortColumn) {
      result.sort((a, b) => {
        const aVal = a[sortColumn as keyof T];
        const bVal = b[sortColumn as keyof T];
        
        if (aVal === bVal) return 0;
        
        const comparison = aVal < bVal ? -1 : 1;
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [data, searchQuery, sortColumn, sortDirection, columns]);

  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredAndSortedData.slice(startIndex, startIndex + pageSize);

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (columnKey: string) => {
    if (sortColumn !== columnKey) {
      return <ChevronsUpDown size={14} className="ml-1 text-slate-400" />;
    }
    return sortDirection === 'asc' 
      ? <ChevronUp size={14} className="ml-1 text-slate-600" />
      : <ChevronDown size={14} className="ml-1 text-slate-600" />;
  };

  return (
    <div className="data-table-container">
      {searchable && (
        <div className="data-table-toolbar">
          <div className="search-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="search-input"
            />
          </div>
          <div className="entries-info">
            Showing {filteredAndSortedData.length > 0 ? startIndex + 1 : 0} to{' '}
            {Math.min(startIndex + pageSize, filteredAndSortedData.length)} of{' '}
            {filteredAndSortedData.length} entries
          </div>
        </div>
      )}

      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th
                  key={String(col.key)}
                  onClick={() => col.sortable !== false && handleSort(String(col.key))}
                  className={col.sortable !== false ? 'sortable' : ''}
                >
                  <div className="th-content">
                    {col.label}
                    {col.sortable !== false && getSortIcon(String(col.key))}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="empty-state">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr
                  key={idx}
                  onClick={() => onRowClick?.(row)}
                  className={onRowClick ? 'clickable' : ''}
                >
                  {columns.map(col => (
                    <td key={String(col.key)}>
                      {col.render ? col.render(row[col.key as keyof T], row) : String(row[col.key as keyof T] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="data-table-pagination">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          <div className="page-numbers">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
