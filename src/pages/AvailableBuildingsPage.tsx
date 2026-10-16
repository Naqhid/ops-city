import { Download } from 'lucide-react'
import { PageHeader, TableWrap, TableHead, Th } from '../shared'

function ReportTable({ title, subtitle, headers, rows }: { title: string; subtitle: string; headers: string[]; rows: string[][] }) {
  return <div className="page-stack">
    <PageHeader title={title} subtitle={subtitle} action={<button className="secondary-btn"><Download size={16} /> Export</button>} />
    <div className="panel">
      <TableWrap>
        <TableHead>{headers.map(h => <Th key={h}>{h}</Th>)}</TableHead>
        <tbody>{rows.map((r, i) => <tr key={i}>{r.map((x, j) => <td key={j}>{j === 0 ? <b>{x}</b> : x}</td>)}</tr>)}</tbody>
      </TableWrap>
    </div>
  </div>
}

export function AvailablePage() {
  return <ReportTable
    title="Available Buildings"
    subtitle="A live view of units available across the portfolio."
    headers={['Name', 'Building Code', 'Total Floors', 'Total Units', 'Available Units', 'Unit Numbers']}
    rows={[['South End', 'BLD000001', '2', '4', '1', 'G1'], ['West End', 'BLD000002', '0', '0', '0', '—']]}
  />
}

export const AvailableBuildingsPage = AvailablePage
export default AvailablePage
