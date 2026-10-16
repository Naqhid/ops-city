import { Download, RefreshCw } from 'lucide-react'
import { PageHeader, TableWrap, TableHead, Th, Field } from '../shared'

export function BuildingCostPage() {
  return <div className="page-stack">
    <PageHeader title="Building Total Cost" subtitle="Generate cost summaries by category and building." />
    <div className="panel">
      <div className="report-filters">
        <Field label="Category" type="select" placeholder="— Please Select —" />
        <Field label="Building" type="select" placeholder="— Please Select —" />
        <button className="primary-btn"><RefreshCw size={16} /> Generate</button>
      </div>
      <div className="report-divider" />
      <div className="report-actions">
        <button className="secondary-btn"><Download size={16} /> Export</button>
      </div>
      <TableWrap>
        <TableHead><Th>Name</Th><Th>Lease Amount</Th><Th>Rent Amount</Th><Th>Owner Name</Th></TableHead>
        <tbody><tr><td colSpan={4} className="empty-row">Select filters and generate the report.</td></tr></tbody>
      </TableWrap>
    </div>
  </div>
}

export default BuildingCostPage
