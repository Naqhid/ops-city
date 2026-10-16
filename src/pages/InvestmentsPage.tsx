import { FilterReport } from './FilterReport'

export function InvestmentsPage() {
  return <FilterReport
    title="Investment Buildings"
    filter="Investor"
    headers={['Building Name', 'Date', 'Investment Amount', 'Settlement', 'Investor Name']}
    rows={[['South End', '11/12/2023', '535', '—', 'Suleman'], ['South End', '11/12/2023', '7,878', '—', 'Suleman']]}
  />
}

export default InvestmentsPage
