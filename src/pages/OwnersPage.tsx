import React, { useEffect, useState } from 'react'
import { FilterReport } from './FilterReport'
import { listResource } from '../lib/api'

export function OwnersPage() {
  const [rows,setRows] = useState<string[][]>([])
  const [error,setError] = useState('')
  useEffect(()=>{let live=true;(async()=>{try{const [owners,buildings,floors,units]=await Promise.all([listResource('owners'),listResource('buildings'),listResource('floors'),listResource('units')]);if(!live)return;const ownerName=(id:any)=>owners.find((o:any)=>String(o.OwnerID)===String(id))?.OwnerName ?? owners.find((o:any)=>String(o.OwnerID)===String(id))?.Name ?? '—';setRows(buildings.map((b:any)=>{const bid=b.BuildingID??b.BuildingCode;const relatedUnits=units.filter((u:any)=>String(u.BuildingID)===String(bid));const relatedFloors=floors.filter((f:any)=>String(f.BuildingID)===String(bid));return [String(ownerName(b.OwnerID)),String(b.BuildingCode??bid??''),String(relatedFloors.length),String(relatedUnits.length),String(relatedUnits.filter((u:any)=>String(u.Status??'').toLowerCase()==='available').length),relatedUnits.map((u:any)=>u.UnitNumber??u.UnitCode??u.UnitID).join(', ')||'—']}));}catch(e:any){if(live)setError(e.message||'Could not load owner/building data.')}})();return()=>{live=false}},[])
  return <>{error&&<div role="alert" className="m-3 text-sm text-amber-700">Owners API: {error}</div>}<FilterReport title="Owner's Buildings" filter="Owner" headers={['Name','Building Code','Total Floors','Total Units','Available Units','Unit Numbers']} rows={rows}/></>
}
export default OwnersPage
