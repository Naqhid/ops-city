import React, { useEffect, useMemo, useState } from 'react'
import { apiGet } from '../api/client'
import { Search } from 'lucide-react'
import { PageHeader, TableWrap, TableHead, Th } from '../shared'

type AnyRow = Record<string, any>
type ExpenseRow = { id:number; year:string; month:string; date:string; type:string; electricityReading?:string; waterReading?:string; currency:string; totalAmount:string; payingAmount:string; balance:string; buildingId:string }
const val = (row: AnyRow, ...keys:string[]) => { const k=keys.find(key=>row?.[key]!==undefined&&row?.[key]!==null); return k ? row[k] : '' }
export function BuildingExpensesPage(props:{query?:string;setQuery?:(v:string)=>void}) {
  const [tab,setTab]=useState<'expenses'|'maintenance'>('expenses')
  const [unit,setUnit]=useState('')
  const [buildingId,setBuildingId]=useState('')
  const [search,setSearch]=useState(props.query||'')
  const [pageSize,setPageSize]=useState('25')
  const [page,setPage]=useState(1)
  const [records,setRecords]=useState<AnyRow[]>([])
  const [buildings,setBuildings]=useState<AnyRow[]>([])
  const [units,setUnits]=useState<AnyRow[]>([])
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState('')
  async function load() {
    setLoading(true);setError('')
    try {
      const [costResponse,buildingResponse,unitResponse]=await Promise.all([
        apiGet<AnyRow[]>('/costs?limit=100'),
        apiGet<AnyRow[]>('/buildings?limit=100'),
        apiGet<AnyRow[]>('/units?limit=100')
      ])
      setRecords(costResponse||[]);setBuildings(buildingResponse||[]);setUnits(unitResponse||[])
    } catch(e) {setError(e instanceof Error?e.message:'Unable to load expense records.')}
    finally {setLoading(false)}
  }
  useEffect(()=>{void load()},[])
  const selectedBuilding=buildings.find(b=>String(val(b,'BuildingID','id'))===buildingId)
  const availableUnits=units.filter(u=>!buildingId||String(val(u,'BuildingCode'))===String(val(selectedBuilding||{},'BlCode','BuildingCode'))||String(val(u,'BuildingName'))===String(val(selectedBuilding||{},'BuildingName','Name')))
  const electricity=val(selectedBuilding||{},'ElectricityNumber')||''
  const water=val(selectedBuilding||{},'WaterNumber')||''
  const activeRows:ExpenseRow[]=useMemo(()=>records.filter(r=>{
    const type=String(val(r,'Type','type')).toLowerCase()
    return tab==='maintenance' ? type.includes('maint') : !type.includes('maint')
  }).filter(r=>{
    if(buildingId&&String(val(r,'BuildingID','buildingId'))!==buildingId)return false
    if(unit&&String(val(r,'UnitID','UnitCode','unitId','unitCode'))!==unit)return false
    return true
  }).map((r,i)=>{
    const date=String(val(r,'Date','date')||'')
    const d=date?new Date(date):null
    const amount=String(val(r,'Amount','amount')??'')
    return {id:Number(val(r,'CostID','id')||i+1),year:d&&!Number.isNaN(d.getTime())?String(d.getFullYear()):'',month:d&&!Number.isNaN(d.getTime())?d.toLocaleString(undefined,{month:'long'}):'',date,type:String(val(r,'Type','type')),currency:String(val(r,'Currency','currency')||''),totalAmount:amount,payingAmount:String(val(r,'PayingAmount','payingAmount')||''),balance:String(val(r,'Balance','balance')||''),buildingId:String(val(r,'BuildingID','buildingId')||'')}
  }),[records,tab,buildingId,unit])
  const filtered=useMemo(()=>activeRows.filter(row=>Object.values(row).join(' ').toLowerCase().includes(search.toLowerCase())),[activeRows,search])
  const visible=filtered.slice((page-1)*Number(pageSize),page*Number(pageSize))
  const updateSearch=(v:string)=>{setSearch(v);setPage(1);props.setQuery?.(v)}
  const headers=['#','Year','Month','Date','Expense Type',...(tab==='expenses'?['Electricity Reading','Water Reading']:[]),'Currency','Total Amount','Paying Amount','Balance']
  const colCount=headers.length
  const pageCount=Math.max(1,Math.ceil(filtered.length/Number(pageSize)))
  return <div className="page-stack">
    {error&&<div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error} <button type="button" className="ml-3 underline" onClick={()=>void load()}>Retry</button></div>}
    <PageHeader title="Building Expenses" subtitle="Review W/E and maintenance expenses by building and unit."/>
    <div className="tabs" role="tablist" aria-label="Building expense sections">
      <button type="button" role="tab" aria-selected={tab==='expenses'} className={tab==='expenses'?'active':''} onClick={()=>{setTab('expenses');setPage(1)}}>W/E Expenses</button>
      <button type="button" role="tab" aria-selected={tab==='maintenance'} className={tab==='maintenance'?'active':''} onClick={()=>{setTab('maintenance');setPage(1)}}>Maintenance</button>
    </div>
    <section className="panel">
      <div className="panel-head"><div><h2>Expense records</h2><p>Utilities and maintenance costs for the selected property.</p></div></div>
      <div className="form-grid three" style={{marginTop:18}}>
        <label className="field-wrap"><span>Organization</span><input readOnly value={val(selectedBuilding||{},'OrganizationName')||'—'}/></label>
        <label className="field-wrap"><span>Building</span><input readOnly value={val(selectedBuilding||{},'BuildingName','Name')||'—'}/></label>
        <label className="field-wrap"><span>Owner ID</span><input readOnly value={val(selectedBuilding||{},'OwnerCode')||'—'}/></label>
      </div>
      <div className="form-grid four" style={{marginTop:16}}>
        <label className="field-wrap"><span>Electricity Number</span><input readOnly value={electricity}/></label>
        <label className="field-wrap"><span>Water Number</span><input readOnly value={water}/></label>
        <label className="field-wrap"><span>Building</span><select value={buildingId} onChange={e=>{setBuildingId(e.target.value);setUnit('');setPage(1)}}><option value="">Please Select</option>{buildings.map(b=><option key={val(b,'BuildingID','id')} value={val(b,'BuildingID','id')}>{val(b,'BuildingName','Name','BlCode')}</option>)}</select></label>
        <label className="field-wrap"><span>Unit</span><select value={unit} onChange={e=>{setUnit(e.target.value);setPage(1)}}><option value="">Please Select</option>{availableUnits.map(u=><option key={val(u,'UnitID','UnitCode')} value={val(u,'UnitID','UnitCode','UnitName')}>{val(u,'UnitCode','UnitName')}</option>)}</select></label>
      </div>
      {!unit&&<p role="alert" style={{margin:'6px 0 0',color:'#dc2626',fontSize:12,fontWeight:600}}>Please Select Unit!</p>}
      <div className="toolbar" style={{paddingBottom:0,marginTop:16}}>
        <label>Show <select value={pageSize} onChange={e=>{setPageSize(e.target.value);setPage(1)}}><option>10</option><option>25</option><option>50</option><option>100</option></select> entries</label>
        <label className="search"><Search size={15}/><input value={search} onChange={e=>updateSearch(e.target.value)} placeholder="Search expenses"/></label>
      </div>
      <div style={{marginTop:14}}>
        <TableWrap><TableHead>{headers.map(h=><Th key={h}>{h}</Th>)}</TableHead><tbody>
          {loading?<tr><td className="empty-row" colSpan={colCount}>Loading expense records…</td></tr>:visible.length===0?<tr><td className="empty-row" colSpan={colCount}>No data available in table</td></tr>:visible.map(row=><tr key={row.id}><td>{row.id}</td><td>{row.year||'—'}</td><td>{row.month||'—'}</td><td>{row.date||'—'}</td><td>{row.type||'—'}</td>{tab==='expenses'&&<><td>{val(records.find(r=>Number(val(r,'CostID','id'))===row.id)||{},'ElectricityReading')||'—'}</td><td>{val(records.find(r=>Number(val(r,'CostID','id'))===row.id)||{},'WaterReading')||'—'}</td></>}<td>{row.currency||'—'}</td><td>{row.totalAmount||'—'}</td><td>{row.payingAmount||'—'}</td><td>{row.balance||'—'}</td></tr>)}
        </tbody></TableWrap>
      </div>
      <div className="pagination" style={{paddingTop:15}}>
        <span>Showing {filtered.length?`${(page-1)*Number(pageSize)+1} to ${Math.min(page*Number(pageSize),filtered.length)} of ${filtered.length}`:'0 to 0 of 0'} entries</span>
        <div><button type="button" disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Previous</button><button type="button" className="current">{page}</button><button type="button" disabled={page>=pageCount} onClick={()=>setPage(p=>Math.min(pageCount,p+1))}>Next</button></div>
      </div>
    </section>
  </div>
}
export default BuildingExpensesPage
