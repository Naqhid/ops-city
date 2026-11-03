import React, { useEffect, useMemo, useState } from 'react'
import { Download, RefreshCw } from 'lucide-react'
import { PageHeader, TableWrap, TableHead, Th, Field } from '../shared'
import { apiGet } from '../api/client'

type AnyRow = Record<string, any>
const val = (row: AnyRow, ...keys: string[]) => {
  const key = keys.find(k => row?.[k] !== undefined && row?.[k] !== null)
  return key ? String(row[key]) : ''
}
const money = (value: unknown) => {
  const n = Number(value)
  return Number.isFinite(n) ? n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : String(value ?? '')
}
function csvDownload(rows: string[][], filename: string) {
  const csv = rows.map(row => row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')).join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}
export function BuildingCostPage() {
  const [buildings, setBuildings] = useState<AnyRow[]>([])
  const [costs, setCosts] = useState<AnyRow[]>([])
  const [category, setCategory] = useState('')
  const [buildingId, setBuildingId] = useState('')
  const [generated, setGenerated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  async function load() {
    setLoading(true); setError('')
    try {
      const [b, c] = await Promise.all([
        apiGet<{data: AnyRow[]}>('/buildings?limit=100'),
        apiGet<{data: AnyRow[]}>('/costs?limit=100')
      ])
      setBuildings(b.data || []); setCosts(c.data || [])
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to load building cost data.') }
    finally { setLoading(false) }
  }
  useEffect(() => { void load() }, [])
  const categories = useMemo(() => Array.from(new Set(costs.map(r => val(r, 'Type', 'type')).filter(Boolean))).sort(), [costs])
  const rows = useMemo(() => {
    if (!generated) return []
    return buildings.filter(b => !buildingId || val(b, 'BuildingID', 'id') === buildingId)
      .filter(b => !category || costs.some(c => val(c, 'BuildingID', 'buildingId') === val(b, 'BuildingID', 'id') && val(c, 'Type', 'type') === category))
      .map(b => {
        const id = val(b, 'BuildingID', 'id')
        const relevant = costs.filter(c => val(c, 'BuildingID', 'buildingId') === id && (!category || val(c, 'Type', 'type') === category))
        const costTotal = relevant.reduce((sum, c) => sum + (Number(val(c, 'Amount', 'amount')) || 0), 0)
        return [val(b, 'BuildingName', 'Name', 'name') || `Building ${id}`,
          money(val(b, 'Advance', 'LeaseAmount', 'leaseAmount')),
          money(val(b, 'Rent', 'RentAmount', 'rentAmount') || costTotal),
          val(b, 'OwnerName', 'ownerName', 'OwnerCode')]
      })
  }, [buildings, costs, category, buildingId, generated])
  const exportRows = () => csvDownload([['Name','Lease Amount','Rent Amount','Owner Name'], ...rows], 'building-total-cost.csv')
  return <div className="page-stack">
    <PageHeader title="Building Total Cost" subtitle="Generate cost summaries by category and building." />
    <div className="panel">
      <div className="report-filters">
        <label className="field"><span>Category</span><select value={category} onChange={e => setCategory(e.target.value)}><option value="">— Please Select —</option>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></label>
        <label className="field"><span>Building</span><select value={buildingId} onChange={e => setBuildingId(e.target.value)}><option value="">— Please Select —</option>{buildings.map(b => <option key={val(b,'BuildingID','id')} value={val(b,'BuildingID','id')}>{val(b,'BuildingName','Name','name') || val(b,'BlCode','BuildingID')}</option>)}</select></label>
        <button className="primary-btn" onClick={() => setGenerated(true)} disabled={loading}><RefreshCw size={16} /> Generate</button>
      </div>
      <div className="report-divider" />
      <div className="report-actions"><button className="secondary-btn" onClick={exportRows} disabled={!rows.length}><Download size={16} /> Export</button><button className="secondary-btn" onClick={() => void load()} disabled={loading}><RefreshCw size={16}/> Refresh</button></div>
      {error && <div role="alert" className="error-message">{error}</div>}
      {loading ? <p className="empty-row">Loading building and cost data…</p> : <TableWrap>
        <TableHead><Th>Name</Th><Th>Lease Amount</Th><Th>Rent Amount</Th><Th>Owner Name</Th></TableHead>
        <tbody>{!generated ? <tr><td colSpan={4} className="empty-row">Select filters and generate the report.</td></tr> : rows.length ? rows.map((r,i)=><tr key={`${r[0]}-${i}`}>{r.map((v,j)=><td key={j}>{j===0?<b>{v}</b>:v}</td>)}</tr>) : <tr><td colSpan={4} className="empty-row">No matching buildings found.</td></tr>}</tbody>
      </TableWrap>}
    </div>
  </div>
}
export default BuildingCostPage
