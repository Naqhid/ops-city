import React from 'react'
import { BuildingsPage } from './BuildingsPage'

// BuildingsPage is self-contained: it manages the list as well as the
// create/edit form via its own internal state. The dedicated "building-form"
// route simply renders BuildingsPage so the user can create or edit a building.
export function BuildingForm({onBack}:{onBack:()=>void}){
 return <BuildingsPage query="" setQuery={()=>{}} onCreate={onBack} onEdit={onBack}/>
}

export default BuildingForm
