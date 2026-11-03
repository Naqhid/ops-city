import React from 'react'
import { Eye, MoreHorizontal, Pencil, Plus } from 'lucide-react'
import { Investor } from '../types'
import { PageHeader, DataTable, Status } from '../shared'

export function InvestorsPage({query,setQuery,rows,onCreate,onEdit}:{query:string;setQuery:(v:string)=>void;rows:Investor[];onCreate:()=>void;onEdit:(id:string)=>void}) {
  return <div className="page-stack">
    <PageHeader title="Investors & Owners" subtitle="Manage property owners, investors and their portfolio relationships." action={<button className="primary-btn" onClick={onCreate}><Plus size={17}/> Create new</button>}/>
    <div className="panel">
      <DataTable data={rows} columns={[{key:'id',label:'Investor',render:(val,row)=>(<><b className="link">{val}</b><small className="cell-sub">{row.name}</small></>)},{key:'type',label:'Type'},{key:'address1',label:'Address Line 1',render:(val)=>val||'—'},{key:'address2',label:'Address Line 2',render:(val)=>val||'—'},{key:'city',label:'City',render:(val)=>val||'—'},{key:'phone',label:'Phone',render:(val)=>val||'—'},{key:'buildings',label:'Buildings',render:(val)=>(<span className="pill">{val} {val === 1 ? 'property' : 'properties'}</span>)},{key:'status',label:'Status',render:(val)=>(<Status>{val}</Status>)},{key:'actions',label:'Actions',sortable:false,render:(_,row)=>(<RowActions onEdit={()=>onEdit(row.id)}/>)}]} pageSize={25} emptyMessage="No investors found" onRowClick={(row)=>onEdit(row.id)}/>
    </div>
  </div>
}

export function RowActions({onEdit}:{onEdit:()=>void}){return <div className="row-actions"><button title="View"><Eye size={15}/></button><button title="Edit" onClick={onEdit}><Pencil size={15}/></button><button title="More"><MoreHorizontal size={15}/></button></div>}
