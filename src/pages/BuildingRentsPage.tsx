import React from 'react'
import { SimpleBuildingTable } from './OperationsPages'
export function BuildingRentsPage(props: { query:string; setQuery:(v:string)=>void }) { return <SimpleBuildingTable title="Building Rents" rows={[]} query={props.query} setQuery={props.setQuery} compact /> }
export default BuildingRentsPage
