import React, { useMemo, useState } from 'react'

type ExpenseRow = {
  id: number
  year: string
  month: string
  date: string
  type: string
  electricityReading?: string
  waterReading?: string
  currency: string
  totalAmount: string
  payingAmount: string
  balance: string
}

type MaintenanceRow = {
  id: number
  year: string
  month: string
  date: string
  type: string
  currency: string
  totalAmount: string
  payingAmount: string
  balance: string
}

const demoExpenses: ExpenseRow[] = []
const demoMaintenance: MaintenanceRow[] = []

const styles = `
.be-page{color:#17243b;font-family:inherit;min-width:0}.be-tabs{display:flex;gap:8px;margin:0 0 0 0;padding:0 0 0 0}.be-tab{border:0;background:transparent;color:#64748b;padding:18px 26px;cursor:pointer;font-size:14px;border-radius:0}.be-tab.active{background:#2c4055;color:#fff}.be-card{background:#fff;border:1px solid #e3e8f0;border-radius:5px;box-shadow:0 4px 15px rgba(22,40,65,.08);padding:24px;margin-bottom:22px}.be-info{display:grid;grid-template-columns:repeat(4,minmax(130px,1fr));gap:22px;margin-bottom:26px;font-size:14px;align-items:center}.be-info strong{font-weight:650}.be-warning{color:#f04444;text-align:center}.be-filterrow{display:grid;grid-template-columns:1fr 1fr 1fr;gap:22px;align-items:center;margin-bottom:24px}.be-field{display:flex;gap:10px;align-items:center;min-width:0;font-size:14px}.be-field label{white-space:nowrap}.be-field select,.be-field input{height:42px;box-sizing:border-box;border:1px solid #dce3ee;border-radius:2px;padding:0 12px;color:#60708a;background:#fff;min-width:0;width:100%;font:inherit}.be-toolbar{display:flex;align-items:center;justify-content:space-between;gap:16px;margin:0 0 14px;font-size:14px;color:#6b7b95}.be-toolbar select{border:1px solid #dce3ee;padding:7px 10px;color:#64748b;background:white;border-radius:3px;margin:0 6px}.be-toolbar input{border:1px solid #dce3ee;border-radius:3px;padding:9px 12px;width:180px;max-width:45vw;color:#334155}.be-tablewrap{width:100%;overflow:auto;border:1px solid #e3e8f0}.be-table{width:100%;border-collapse:collapse;min-width:940px;font-size:14px}.be-table th{background:#aeb6bf;color:#101820;text-align:left;padding:15px 12px;font-weight:600;border-right:1px solid #fff;white-space:normal}.be-table td{padding:14px 12px;border:1px solid #e3e8f0;white-space:nowrap}.be-table tbody tr:nth-child(even){background:#faf9fc}.be-table .empty{text-align:center;color:#64748b;padding:20px}.be-footer{display:flex;justify-content:space-between;align-items:center;gap:12px;color:#718096;font-size:14px;padding-top:12px}.be-pages{display:flex;gap:0}.be-pages button{border:1px solid #dce3ee;background:#fff;color:#7c8aa0;padding:8px 13px}.be-pages button.current{background:#2c4055;color:white}.be-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:22px}.be-btn{border:0;border-radius:3px;padding:11px 18px;background:#08b8d8;color:#fff;cursor:pointer;font:inherit}.be-btn.green{background:#00d78a}.be-btn.orange{background:#ff8a19}.be-btn.dark{background:#2e3e50}.be-muted{color:#718096}.be-unit-alert{font-size:14px;color:#f04444;text-align:center}.be-mobilelabel{display:none}
@media(max-width:900px){.be-info{grid-template-columns:repeat(2,minmax(120px,1fr))}.be-filterrow{grid-template-columns:1fr}.be-card{padding:16px}.be-tabs .be-tab{padding:14px 16px}.be-info{gap:14px}.be-toolbar{align-items:flex-start;flex-direction:column}.be-toolbar input{max-width:100%;width:100%}.be-footer{align-items:flex-start;flex-direction:column}.be-unit-alert{text-align:left}}
`

export function BuildingExpensesPage(props: { query?: string; setQuery?: (v: string) => void }) {
  const [tab, setTab] = useState<'expenses' | 'maintenance'>('expenses')
  const [unit, setUnit] = useState('')
  const [search, setSearch] = useState(props.query || '')
  const [pageSize, setPageSize] = useState('25')
  const [expenses] = useState<ExpenseRow[]>(demoExpenses)
  const [maintenance] = useState<MaintenanceRow[]>(demoMaintenance)

  const activeRows = tab === 'expenses' ? expenses : maintenance
  const filtered = useMemo(() => activeRows.filter(row => Object.values(row).join(' ').toLowerCase().includes(search.toLowerCase())), [activeRows, search])

  const updateSearch = (value: string) => {
    setSearch(value)
    props.setQuery?.(value)
  }

  return <div className="be-page">
    <style>{styles}</style>
    <div className="be-tabs" role="tablist" aria-label="Building expense sections">
      <button type="button" role="tab" aria-selected={tab === 'expenses'} className={`be-tab ${tab === 'expenses' ? 'active' : ''}`} onClick={() => setTab('expenses')}>W/E Expenses</button>
      <button type="button" role="tab" aria-selected={tab === 'maintenance'} className={`be-tab ${tab === 'maintenance' ? 'active' : ''}`} onClick={() => setTab('maintenance')}>Maintainance</button>
    </div>

    <section className="be-card">
      <div className="be-info">
        <div>Organization: <strong>Axiom</strong></div>
        <div>Building: <strong>South End</strong></div>
        <div>Owner Id: <strong>PER00000001</strong></div>
        <div className="be-unit-alert">{unit ? '' : 'Please Select Unit!'}</div>
      </div>

      <div className="be-filterrow">
        <div className="be-field"><label htmlFor="be-electricity">Electricity Number:</label><input id="be-electricity" aria-label="Electricity Number" value="" readOnly /></div>
        <div className="be-field"><label htmlFor="be-water">Water Number:</label><input id="be-water" aria-label="Water Number" value="" readOnly /></div>
        <div className="be-field"><label htmlFor="be-unit">Unit:</label><select id="be-unit" value={unit} onChange={e => setUnit(e.target.value)}><option value="">Please Select</option><option value="UNIT000001">UNIT000001</option><option value="UNIT000002">UNIT000002</option></select></div>
      </div>

      <div className="be-toolbar">
        <label>Show <select value={pageSize} onChange={e => setPageSize(e.target.value)}><option>10</option><option>25</option><option>50</option><option>100</option></select> entries</label>
        <label>Search: <input value={search} onChange={e => updateSearch(e.target.value)} placeholder="Please Select" /></label>
      </div>

      <div className="be-tablewrap">
        <table className="be-table">
          <thead><tr>
            <th aria-label="Row number">↕</th><th>Year ↕</th><th>Month ↕</th><th>Date ↕</th><th>Expense Type ↕</th>
            {tab === 'expenses' && <><th>Electricity Reading ↕</th><th>Water Reading ↕</th></>}
            <th>Currency ↕</th><th>Total Amount ↕</th><th>Paying Amount ↕</th><th>Balance ↕</th><th aria-label="Actions">↕</th>
          </tr></thead>
          <tbody>
            {filtered.length === 0 ? <tr><td className="empty" colSpan={tab === 'expenses' ? 12 : 10}>No data available in table</td></tr> : filtered.slice(0, Number(pageSize)).map((row: any) => <tr key={row.id}>
              <td>{row.id}</td><td>{row.year}</td><td>{row.month}</td><td>{row.date}</td><td>{row.type}</td>
              {tab === 'expenses' && <><td>{row.electricityReading || '—'}</td><td>{row.waterReading || '—'}</td></>}
              <td>{row.currency}</td><td>{row.totalAmount}</td><td>{row.payingAmount}</td><td>{row.balance}</td><td><button className="be-btn" type="button" title="Edit row" onClick={() => window.alert('No expense record selected.')}>✎</button></td>
            </tr>)}
          </tbody>
        </table>
      </div>
      <div className="be-footer"><span>Showing {filtered.length ? `1 to ${Math.min(filtered.length, Number(pageSize))} of ${filtered.length}` : '0 to 0 of 0'} entries</span><div className="be-pages"><button type="button" disabled>Previous</button><button type="button" className="current">1</button><button type="button" disabled>Next</button></div></div>
    </section>
  </div>
}

export default BuildingExpensesPage
