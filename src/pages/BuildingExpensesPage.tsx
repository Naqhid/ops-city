import React, { useEffect, useMemo, useState } from 'react'
import { apiGet } from '../api/client'

type AnyRow = Record<string, any>
type ExpenseRow = { id:number; year:string; month:string; date:string; type:string; electricityReading?:string; waterReading?:string; currency:string; totalAmount:string; payingAmount:string; balance:string; buildingId:string }
const val = (row: AnyRow, ...keys:string[]) => { const k=keys.find(key=>row?.[key]!==undefined&&row?.[key]!==null); return k ? row[k] : '' }
const styles = `
.be-page{color:#17243b;font-family:inherit;min-width:0}.be-tabs{display:flex;gap:8px}.be-tab{border:0;background:transparent;color:#64748b;padding:18px 26px;cursor:pointer;font-size:14px}.be-tab.active{background:#2c4055;color:#fff}.be-card{background:#fff;border:1px solid #e3e8f0;border-radius:5px;box-shadow:0 4px 15px rgba(22,40,65,.08);padding:24px;margin-bottom:22px}.be-info{display:grid;grid-template-columns:repeat(4,minmax(130px,1fr));gap:22px;margin-bottom:26px;font-size:14px}.be-warning{color:#f04444;text-align:center}.be-filterrow{display:grid;grid-template-columns:1fr 1fr 1fr;gap:22px;align-items:center;margin-bottom:24px}.be-field{display:flex;gap:10px;align-items:center;min-width:0;font-size:14px}.be-field label{white-space:nowrap}.be-field select,.be-field input{height:42px;box-sizing:border-box;border:1px solid #dce3ee;border-radius:2px;padding:0 12px;color:#60708a;background:#fff;min-width:0;width:100%;font:inherit}.be-toolbar{display:flex;align-items:center;justify-content:space-between;gap:16px;margin:0 0 14px;font-size:14px;color:#6b7b95}.be-toolbar select,.be-toolbar input{border:1px solid #dce3ee;padding:8px 10px;color:#64748b;background:white;border-radius:3px;margin:0 6px}.be-toolbar input{width:180px;max-width:45vw;color:#334155}.be-tablewrap{width:100%;overflow:auto;border:1px solid #e3e8f0}.be-table{width:100%;border-collapse:collapse;min-width:940px;font-size:14px}.be-table th{background:#aeb6bf;color:#101820;text-align:left;padding:15px 12px;font-weight:600;border-right:1px solid #fff}.be-table td{padding:14px 12px;border:1px solid #e3e8f0;white-space:nowrap}.be-table tbody tr:nth-child(even){background:#faf9fc}.be-table .empty{text-align:center;color:#64748b;padding:20px}.be-footer{display:flex;justify-content:space-between;align-items:center;gap:12px;color:#718096;font-size:14px;padding-top:12px}.be-pages{display:flex}.be-pages button{border:1px solid #dce3ee;background:#fff;color:#7c8aa0;padding:8px 13px}.be-pages button.current{background:#2c4055;color:white}.be-error{background:#fff1f2;color:#9f1239;border:1px solid #fecdd3;padding:12px;margin-bottom:12px}.be-mobilelabel{display:none}
@media(max-width:900px){.be-info{grid-template-columns:repeat(2,minmax(120px,1fr))}.be-filterrow{grid-template-columns:1fr}.be-card{padding:16px}.be-tabs .be-tab{padding:14px 16px}.be-toolbar{align-items:flex-start;flex-direction:column}.be-toolbar input{max-width:100%;width:100%}.be-footer{align-items:flex-start;flex-direction:column}}
`
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
        apiGet<{data:AnyRow[]}>('/costs?limit=100'),
        apiGet<{data:AnyRow[]}>('/buildings?limit=100'),
        apiGet<{data:AnyRow[]}>('/units?limit=100')
      ])
      setRecords(costResponse.data||[]);setBuildings(buildingResponse.data||[]);setUnits(unitResponse.data||[])
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
    return {id:Number(val(r,'CostID','id')||i+1),year:d&&!Number.isNaN(d.getTime())?String(d.getFullYear()):'',month:d&&!Number.isNaN(d.getTime())?d.toLocaleString(undefined,{month:'long'}):'',date,date,type:String(val(r,'Type','type')),currency:String(val(r,'Currency','currency')||''),totalAmount:amount,payingAmount:String(val(r,'PayingAmount','payingAmount')||''),balance:String(val(r,'Balance','balance')||''),buildingId:String(val(r,'BuildingID','buildingId')||'')}
  }),[records,tab,buildingId,unit])
  const filtered=useMemo(()=>activeRows.filter(row=>Object.values(row).join(' ').toLowerCase().includes(search.toLowerCase())),[activeRows,search])
  const visible=filtered.slice((page-1)*Number(pageSize),page*Number(pageSize))
  const updateSearch=(v:string)=>{setSearch(v);setPage(1);props.setQuery?.(v)}
  const selectedUnit=availableUnits.find(u=>String(val(u,'UnitID','UnitCode','UnitName'))===unit)
  return <div className="be-page"><style>{styles}</style>
    <div className="be-tabs" role="tablist" aria-label="Building expense sections">
      <button type="button" role="tab" aria-selected={tab==='expenses'} className={`be-tab ${tab==='expenses'?'active':''}`} onClick={()=>{setTab('expenses');setPage(1)}}>W/E Expenses</button>
      <button type="button" role="tab" aria-selected={tab==='maintenance'} className={`be-tab ${tab==='maintenance'?'active':''}`} onClick={()=>{setTab('maintenance');setPage(1)}}>Maintenance</button>
    </div>
    <section className="be-card">
      <div className="be-info"><div>Organization: <strong>{val(selectedBuilding||{},'OrganizationName')||'—'}</strong></div><div>Building: <strong>{val(selectedBuilding||{},'BuildingName','Name')||'—'}</strong></div><div>Owner ID: <strong>{val(selectedBuilding||{},'OwnerCode')||'—'}</strong></div><div className="be-warning">{unit?'':'Please Select Unit!'}</div></div>
      <div className="be-filterrow">
        <div className="be-field"><label htmlFor="be-electricity">Electricity Number:</label><input id="be-electricity" value={electricity} readOnly /></div>
        <div className="be-field"><label htmlFor="be-water">Water Number:</label><input id="be-water" value={water} readOnly /></div>
        <div className="be-field"><label htmlFor="be-building">Building:</label><select id="be-building" value={buildingId} onChange={e=>{setBuildingId(e.target.value);setUnit('');setPage(1)}}><option value="">Please Select</option>{buildings.map(b=><option key={val(b,'BuildingID','id')} value={val(b,'BuildingID','id')}>{val(b,'BuildingName','Name','BlCode')}</option>)}</select></div>
      </div>
      <div className="be-filterrow"><div className="be-field"><label htmlFor="be-unit">Unit:</label><select id="be-unit" value={unit} onChange={e=>{setUnit(e.target.value);setPage(1)}}><option value="">Please Select</option>{availableUnits.map(u=><option key={val(u,'UnitID','UnitCode')} value={val(u,'UnitID','UnitCode','UnitName')}>{val(u,'UnitCode','UnitName')}</option>)}</select></div><div></div><div></div></div>
      <div className="be-toolbar"><label>Show <select value={pageSize} onChange={e=>{setPageSize(e.target.value);setPage(1)}}><option>10</option><option>25</option><option>50</option><option>100</option></select> entries</label><label>Search: <input value={search} onChange={e=>updateSearch(e.target.value)} placeholder="Search expenses" /></label></div>
      {error&&<div className="be-error" role="alert">{error} <button type="button" onClick={()=>void load()}>Retry</button></div>}
      <div className="be-tablewrap"><table className="be-table"><thead><tr><th>#</th><th>Year</th><th>Month</th><th>Date</th><th>Expense Type</th>{tab==='expenses'&&<><th>Electricity Reading</th><th>Water Reading</th></>}<th>Currency</th><th>Total Amount</th><th>Paying Amount</th><th>Balance</th></tr></thead><tbody>
        {loading?<tr><td className="empty" colSpan={tab==='expenses'?11:9}>Loading expense records…</td></tr>:visible.length===0?<tr><td className="empty" colSpan={tab==='expenses'?11:9}>No data available in table</td></tr>:visible.map(row=><tr key={row.id}><td>{row.id}</td><td>{row.year||'—'}</td><td>{row.month||'—'}</td><td>{row.date||'—'}</td><td>{row.type||'—'}</td>{tab==='expenses'&&<><td>{val(records.find(r=>Number(val(r,'CostID','id'))===row.id)||{},'ElectricityReading')||'—'}</td><td>{val(records.find(r=>Number(val(r,'CostID','id'))===row.id)||{},'WaterReading')||'—'}</td></>}<td>{row.currency||'—'}</td><td>{row.totalAmount||'—'}</td><td>{row.payingAmount||'—'}</td><td>{row.balance||'—'}</td></tr>)}
      </tbody></table></div>
      <div className="be-footer"><span>Showing {filtered.length?`${(page-1)*Number(pageSize)+1} to ${Math.min(page*Number(pageSize),filtered.length)} of ${filtered.length}`:'0 to 0 of 0'} entries</span><div className="be-pages"><button type="button" disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Previous</button><button type="button" className="current">{page}</button><button type="button" disabled={page*Number(pageSize)>=filtered.length} onClick={()=>setPage(p=>p+1)}>Next</button></div></div>
    </section>
  </div>
}
export default BuildingExpensesPage
