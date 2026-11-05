import React, { useEffect, useState } from 'react'
import { Eye, MoreHorizontal, Pencil, Plus } from 'lucide-react'
import { Investor } from '../types'
import { PageHeader, DataTable, Status } from '../shared'
import { listResource } from '../lib/api'

export function InvestorsPage({query,setQuery,onCreate,onEdit}:{query:string;setQuery:(v:string)=>void;onCreate:()=>void;onEdit:(id:string)=>void}) {
  const [rows,setRows]=useState<Investor[]>([])
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState('')

  useEffect(()=>{
    let alive=true
    ;(async()=>{
      try{
        const data=await listResource('investors')
        if(alive)setRows(data.map((i:any)=>({id:i.InvesterID||i.id||'',name:i.Name||i.InvesterName||'',type:i.Type||'Investor',address1:i.Address1||'',address2:i.Address2||'',city:i.City||'',phone:i.Phone||'',buildings:0,status:i.Status||'Active'})))
      }catch(e){
        if(alive)setError(e instanceof Error?e.message:'Failed to load investors')
      }finally{
        if(alive)setLoading(false)
      }
    })()
    return()=>{alive=false}
  },[])

  return <div className="page-stack">
    <PageHeader title="Investors & Owners" subtitle="Manage property owners, investors and their portfolio relationships." action={<button className="primary-btn" onClick={onCreate}><Plus size={17}/> Create new</button>}/>
    <div className="panel">
      {error&&<div role="alert" className="m-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {loading?<div className="p-8 text-center text-slate-500">Loading investors…</div>:
      <DataTable data={rows} columns={[{key:'id',label:'Investor',render:(val,row)=>(<><b className="link">{val}</b><small className="cell-sub">{row.name}</small></>)},{key:'type',label:'Type'},{key:'address1',label:'Address Line 1',render:(val)=>val||'—'},{key:'address2',label:'Address Line 2',render:(val)=>val||'—'},{key:'city',label:'City',render:(val)=>val||'—'},{key:'phone',label:'Phone',render:(val)=>val||'—'},{key:'buildings',label:'Buildings',render:(val)=>(<span className="pill">{val} {val === 1 ? 'property' : 'properties'}</span>)},{key:'status',label:'Status',render:(val)=>(<Status>{val}</Status>)},{key:'actions',label:'Actions',sortable:false,render:(_,row)=>(<RowActions onEdit={()=>onEdit(row.id)}/>)}]} pageSize={25} emptyMessage="No investors found" onRowClick={(row)=>onEdit(row.id)}/>}
    </div>
  </div>
}

export function RowActions({onEdit}:{onEdit:()=>void}){return <div className="row-actions"><button title="View"><Eye size={15}/></button><button title="Edit" onClick={onEdit}><Pencil size={15}/></button><button title="More"><MoreHorizontal size={15}/></button></div>}
