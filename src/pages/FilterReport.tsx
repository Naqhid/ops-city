import { Download } from 'lucide-react'
import { PageHeader, TableWrap, TableHead, Th, Field } from '../shared'

export function FilterReport({ title, filter, headers, rows }: { title: string; filter: string; headers: string[]; rows: string[][] }) {
  return <div className="page-stack">
    <PageHeader title={title} subtitle="Filter and export portfolio ownership and investment information." />
    <div className="panel">
      <div className="single-filter">
        <Field label={filter} type="select" placeholder="Select" />
        <button className="secondary-btn"><Download size={16} /> Export</button>
      </div>
      <TableWrap>
        <TableHead>{headers.map(h => <Th key={h}>{h}</Th>)}</TableHead>
        <tbody>{rows.map((r, i) => <tr key={i}>{r.map((x, j) => <td key={j}>{j === 0 ? <b>{x}</b> : x}</td>)}</tr>)}</tbody>
      </TableWrap>
    </div>
  </div>
}

export default FilterReport
