import { FilterReport } from './FilterReport'

export function InvestmentsPage() {
  return <FilterReport
    title="Investment Buildings"
    filter="Investor ID"
    resource="investments"
    filterField="InvesterID"
    columns={['BuildingID', 'Date', 'InvestmentAmount', 'Sattlement', 'InvesterID']}
    headers={['Building ID', 'Date', 'Investment Amount', 'Settlement', 'Investor ID']}
  />
}
export default InvestmentsPage
