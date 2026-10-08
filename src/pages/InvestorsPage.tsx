import React from 'react'
import { Eye, MoreHorizontal, Pencil, Plus } from 'lucide-react'
import { Investor } from '../types'
import { PageHeader, Toolbar, TableWrap, TableHead, Th, Pagination, Status } from '../shared'

export function InvestorsPage({query,setQuery,rows,onCreate,onEdit}:{query:string;setQuery:(v:string)=>void;rows:Investor[];onCreate:()=>void;onEdit:(id:string)=>void}) {
  const filtered = rows.filter(r => `${r.id} ${r.name} ${r.type} ${r.address1} ${r.address2} ${r.city} ${r.phone}`.toLowerCase().includes(query.toLowerCase()))
  return <div className="page-stack">
    <PageHeader title="Investors & Owners" subtitle="Manage property owners, investors and their portfolio relationships." action={<button className="primary-btn" onClick={onCreate}><Plus size={17}/> Create new</button>}/>
    <div className="panel">
      <Toolbar query={query} setQuery={setQuery}/>
      <TableWrap><TableHead><Th>Investor</Th><Th>Type</Th><Th>Address Line 1</Th><Th>Address Line 2</Th><Th>City</Th><Th>Phone</Th><Th>Buildings</Th><Th>Status</Th><Th>Actions</Th></TableHead>
        <tbody>{filtered.map(r=><tr key={r.id}>
          <td><b className="link">{r.id}</b><small className="cell-sub">{r.name}</small></td>
          <td>{r.type}</td><td>{r.address1 || '—'}</td><td>{r.address2 || '—'}</td><td>{r.city || '—'}</td><td>{r.phone || '—'}</td>
          <td><span className="pill">{r.buildings} {r.buildings === 1 ? 'property' : 'properties'}</span></td><td><Status>{r.status}</Status></td>
          <td><RowActions onEdit={()=>onEdit(r.id)}/></td>
        </tr>)}</tbody>
      </TableWrap>
      <Pagination total={filtered.length}/>
    </div>
  </div>
}

export function RowActions({onEdit}:{onEdit:()=>void}){return <div className="row-actions"><button title="View"><Eye size={15}/></button><button title="Edit" onClick={onEdit}><Pencil size={15}/></button><button title="More"><MoreHorizontal size={15}/></button></div>}
