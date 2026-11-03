import { useEffect, useMemo, useState } from 'react'
import { Download, RefreshCw } from 'lucide-react'
import { PageHeader, TableWrap, TableHead, Th, Field } from '../shared'
import { getResource } from '../api/client'

type Row = Record<string, unknown>
type Props = { title: string; filter: string; headers: string[]; rows?: string[][]; resource?: string; filterField?: string; columns?: string[] }

const normalize = (value: unknown) => value == null || value === '' ? '—' : String(value)
function exportCsv(headers: string[], rows: string[][], filename: string) {
  const csv = [headers, ...rows].map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\r\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url)
}
export function FilterReport({ title, filter, headers, rows = [], resource, filterField = 'InvesterID', columns = [] }: Props) {
  const [records, setRecords] = useState<Row[]>([])
  const [selected, setSelected] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [refresh, setRefresh] = useState(0)
  useEffect(() => {
    if (!resource) return
    let active = true
    setLoading(true); setError('')
    getResource<Row>(resource, '?limit=100').then(data => { if (active) setRecords(data) })
      .catch(e => { if (active) setError(e instanceof Error ? e.message : 'Unable to load report data') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [resource, refresh])
  const options = useMemo(() => Array.from(new Set(records.map(r => normalize(r[filterField])).filter(v => v !== '—'))), [records, filterField])
  const liveRows = resource ? records.filter(r => !selected || normalize(r[filterField]) === selected).map(r => {
    const keys = columns.length ? columns : Object.keys(r)
    return headers.map((_, i) => normalize(r[keys[i] ?? Object.keys(r)[i]]))
  }) : rows
  return <div className="page-stack">
    <PageHeader title={title} subtitle="Filter and export portfolio ownership and investment information." />
    <div className="panel">
      <div className="single-filter">
        {resource ? <label className="field-wrap"><span>{filter}</span><select value={selected} onChange={e => setSelected(e.target.value)}><option value="">All</option>{options.map(o => <option key={o} value={o}>{o}</option>)}</select></label> : <Field label={filter} type="select" placeholder="Select" />}
        {resource && <button className="secondary-btn" onClick={() => setRefresh(v => v + 1)} disabled={loading}><RefreshCw size={16}/> Refresh</button>}
        <button className="secondary-btn" onClick={() => exportCsv(headers, liveRows, `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.csv`)}><Download size={16}/> Export</button>
      </div>
      {error && <p role="alert" className="error-text">{error}</p>}
      {loading && <p className="muted">Loading report data…</p>}
      <TableWrap><TableHead>{headers.map(h => <Th key={h}>{h}</Th>)}</TableHead>
        <tbody>{liveRows.map((r, i) => <tr key={i}>{r.map((x, j) => <td key={j}>{j === 0 ? <b>{x}</b> : x}</td>)}</tr>)}
        {!loading && !liveRows.length && <tr><td colSpan={headers.length} className="empty-state">{error ? 'Could not load data.' : 'No records found.'}</td></tr>}</tbody>
      </TableWrap>
    </div>
  </div>
}
export default FilterReport
