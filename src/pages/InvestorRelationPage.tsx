import React from 'react'
import { SimpleBuildingTable } from './OperationsPages'
export function InvestorRelationPage(props: { query:string; setQuery:(v:string)=>void }) { return <SimpleBuildingTable title="Investor Relation" rows={[]} query={props.query} setQuery={props.setQuery} /> }
export default InvestorRelationPage
