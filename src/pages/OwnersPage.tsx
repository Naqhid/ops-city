import { FilterReport } from './FilterReport'

export function OwnersPage() {
  return <FilterReport
    title="Owner's Buildings"
    filter="Owner"
    headers={['Name', 'Building Code', 'Total Floors', 'Total Units', 'Available Units', 'Unit Numbers']}
    rows={[['South End', 'BLD000001', '2', '4', '0', '—'], ['West End', 'BLD000002', '0', '0', '0', '—']]}
  />
}

export default OwnersPage
