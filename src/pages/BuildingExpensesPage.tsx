import React from 'react'
import { SimpleBuildingTable } from './OperationsPages'
export function BuildingExpensesPage(props: { query:string; setQuery:(v:string)=>void }) { return <SimpleBuildingTable title="Building Expense" rows={[]} query={props.query} setQuery={props.setQuery} compact /> }
export default BuildingExpensesPage
