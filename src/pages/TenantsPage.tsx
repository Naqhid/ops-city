import React from 'react'
import { SimpleBuildingTable } from './OperationsPages'
export function TenantsPage(props: { query:string; setQuery:(v:string)=>void }) { return <SimpleBuildingTable title="Tenants and Rentals" rows={[]} query={props.query} setQuery={props.setQuery} /> }
export default TenantsPage
