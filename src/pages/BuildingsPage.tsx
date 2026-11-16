import React, { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Building2, Check, CloudUpload, FileText, Home, Image as ImageIcon, Landmark, Plus, Trash2, Pencil, X } from 'lucide-react'
import { createResource, updateResource, deleteResource, listAll, apiRequest, apiUpload, apiBlob, ApiError } from '../lib/api'
import { PageHeader, DataTable, Status } from '../shared'

type Unit={dbId?:number; name:string; type:string; bedrooms:string; bathrooms:string; hall:string; kitchen:string; balcony:string; furnish:string; electricity:string; water:string; privParking:string}
type Floor={dbId?:number; name:string; area:string; constructed:string; common:string; units:Unit[]}
type BuildingRecord={dbId?:number; code:string; name:string; organization:string; type:string; category:string; categoryName:string; status:string; floors:string; electricityW:string; paidBy:string; electricity:string; water:string; comments:string; buildingNumber:string; zoneNumber:string; streetNumber:string; address1:string; address2:string; city:string; country:string; latitude:string; longitude:string; zone:string; block:string; site:string; totalArea:string; constructedArea:string; amenities:string[]; address:string; units:number; available:number; floorPlan:Floor[]}
type FileRow={FileID:number; Kind:string; DocType:string|null; Title:string|null; FileName:string; FileSize:number; CreatedAt:string; CreatedBy:string|null; UpdatedAt:string; UpdatedBy:string|null}
type Pending={file:File; kind:'image'|'document'; docType:string; title:string}
type RentRow={RentID:number; UnitID:number; Currency:string|null; LeaseAmount:string|null; BaseRent:string|null; MaintenanceCost:string|null; PrivParkingCost:string|null; MiscCost:string|null; Status:string; RentDate:string}
type Org={OrganizationID:number; Name:string; Currency?:string|null}
type Tab='Building'|'Floor Plan'|'Unit Rent / Lease'

const amenitiesList=['Indoor Gym','Outdoor Gym','Swimming Pool','Independent Supermarket','Private Parking','Guest Parking','Park/Courtyard','Kids Play Area','Jogging Track','Tennis Court','Basketball Court','Free Wi-Fi','Elevators/Lifts','Conference Room']
const FURNISH=['Fully Furnished','Semi Furnished','Unfurnished']
const DOC_TYPES=['General Documents','Agreement','Ownership Document','Other']
// Unit type -> default rooms (bedrooms, bathrooms, kitchen, balcony)
const UNIT_TYPES:Record<string,[string,string,string,string]>={'Duplex':['4','4','1','3'],'Triplex':['5','5','1','4'],'Studio Apartment':['1','1','1','0'],'1 BHK':['1','1','1','1'],'2 BHK':['2','2','1','2'],'3 BHK':['3','3','1','2'],'4 BHK':['4','4','1','3'],'5/6 BHK':['5','4','1','3'],'Penthouse':['3','4','1','1']}
const MAX_IMAGE=5*1024*1024, MAX_DOC=15*1024*1024
const emptyUnit=():Unit=>({name:'',type:'',bedrooms:'',bathrooms:'',hall:'',kitchen:'',balcony:'',furnish:'Fully Furnished',electricity:'',water:'',privParking:''})
const emptyFloor=(name='Ground Floor'):Floor=>({name,area:'',constructed:'',common:'',units:[emptyUnit()]})
const blank=():BuildingRecord=>({code:'',name:'',organization:'',type:'Residential Building',category:'Gated Community',categoryName:'',status:'Active',floors:'1',electricityW:'By Unit',paidBy:'By Tenant',electricity:'',water:'',comments:'',buildingNumber:'',zoneNumber:'',streetNumber:'',address1:'',address2:'',city:'',country:'Qatar',latitude:'',longitude:'',zone:'',block:'',site:'',totalArea:'',constructedArea:'',amenities:[],address:'',units:0,available:0,floorPlan:[emptyFloor()]})
const isAdminUser=()=>{try{return JSON.parse(localStorage.getItem('cityapp_user')||'null')?.role==='admin'}catch{return false}}
const fmtDate=(v?:string|null)=>v?new Date(v).toLocaleString():'—'
const fmtSize=(n:number)=>n>=1048576?`${(n/1048576).toFixed(1)} MB`:`${Math.max(1,Math.round(n/1024))} KB`
const fromDb=(b:any):BuildingRecord=>{
  const amenityMap:Record<string,any>={'Indoor Gym':b.IndoorGym,'Outdoor Gym':b.OutdoorGym,'Swimming Pool':b.SwimmingPool,'Independent Supermarket':b.IndependentSuperMarket,'Private Parking':b.PrivateParking,'Guest Parking':b.GuestParking,'Park/Courtyard':b.ParkCourtYard,'Kids Play Area':b.KidsPlayArea,'Jogging Track':b.JoggingTrack,'Tennis Court':b.TennisCourt,'Basketball Court':b.BasketballCourt,'Free Wi-Fi':b.FreeWifi,'Elevators/Lifts':b.Elevators,'Conference Room':b.ConferenceRoom}
  return {...blank(),dbId:Number(b.BuildingID)||undefined,code:String(b.BlCode||b.BuildingID||''),name:String(b.BuildingName||b.Name||''),organization:String(b.OrganizationName||''),type:b.BLType===2?'Commercial Building':'Residential Building',category:String(b.Category||'Gated Community'),status:Number(b.Status)===0?'Inactive':'Active',floors:String(b.NoofFloors||1),electricity:String(b.ElectricityNumber||''),water:String(b.WaterNumber||''),comments:String(b.Comments||''),address1:String(b.AddLine1||''),address2:String(b.AddLine2||''),city:String(b.City||''),country:String(b.Country||'Qatar'),latitude:String(b.Latitude||''),longitude:String(b.Longitude||''),zone:String(b.Zone||''),totalArea:String(b.TotalArea||''),constructedArea:String(b.ConstructedArea||''),amenities:amenitiesList.filter(a=>amenityMap[a]===1),address:[b.AddLine1,b.AddLine2,b.City,b.Country].filter(Boolean).join(', '),units:0,available:0,floorPlan:[]}
}
const unitFromDb=(u:any):Unit=>({dbId:Number(u.UnitID),name:String(u.UnitName||''),type:String(u.UnitType||''),bedrooms:String(u.Bedroom||''),bathrooms:String(u.Bathroom||''),hall:String(u.Hall||''),kitchen:String(u.Kitchen||''),balcony:String(u.Balcony||''),furnish:String(u.FurnishDetails||'Fully Furnished'),electricity:String(u.ElectricityNumber||''),water:String(u.WaterNumber||''),privParking:String(u.PrivParking||'')})

function Field({label,value,onChange,type='text',required,options,wide,disabled}:{label:string;value:string;onChange:(v:string)=>void;type?:string;required?:boolean;options?:string[];wide?:boolean;disabled?:boolean}){return <label className={`bm-field ${wide?'wide':''}`}><span>{required&&<i>*</i>}{label}</span>{options?<select value={value} disabled={disabled} onChange={e=>onChange(e.target.value)}>{options.map(o=><option key={o}>{o}</option>)}</select>:<input type={type} value={value} disabled={disabled} onChange={e=>onChange(e.target.value)}/>}</label>}
function Section({title,icon,children,note='Maintain the building information and related records.'}:{title:string;icon:React.ReactNode;children:React.ReactNode;note?:string}){return <section className="bm-section"><header><span>{icon}</span><div><h3>{title}</h3><p>{note}</p></div></header>{children}</section>}

// Images are protected by the API, so they are fetched with the auth token and shown from a blob URL.
function AuthImage({fileId,className}:{fileId:number;className?:string}){
  const [src,setSrc]=useState('')
  useEffect(()=>{let url='';let live=true;apiBlob(`/building-files/${fileId}/download`).then(b=>{if(!live)return;url=URL.createObjectURL(b);setSrc(url)}).catch(()=>{});return()=>{live=false;if(url)URL.revokeObjectURL(url)}},[fileId])
  return src?<img src={src} alt="Building" className={className}/>:<span className={className}/>
}
function LocalImage({file}:{file:File}){const url=useMemo(()=>URL.createObjectURL(file),[file]);useEffect(()=>()=>URL.revokeObjectURL(url),[url]);return <img src={url} alt={file.name}/>}
async function downloadFile(f:FileRow){const blob=await apiBlob(`/building-files/${f.FileID}/download`);const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=f.FileName;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000)}

export function BuildingsPage({query,setQuery,onCreate,onEdit}:{query:string;setQuery:(v:string)=>void;onCreate:()=>void;onEdit:()=>void}){
 const [rows,setRows]=useState<BuildingRecord[]>([]); const [selected,setSelected]=useState<BuildingRecord|null>(null); const [tab,setTab]=useState<Tab>('Building'); const [isNew,setIsNew]=useState(false); const [search]=useState(query); const [message,setMessage]=useState(''); const [loading,setLoading]=useState(true); const [saving,setSaving]=useState(false)
 const [orgs,setOrgs]=useState<Org[]>([]); const [covers,setCovers]=useState<Record<number,number>>({})
 const [files,setFiles]=useState<FileRow[]>([]); const [pending,setPending]=useState<Pending[]>([]); const [docType,setDocType]=useState(''); const [docTitle,setDocTitle]=useState('')
 const [rents,setRents]=useState<RentRow[]>([]); const [rentDraft,setRentDraft]=useState<Record<string,string>>({status:'Active'})
 const admin=isAdminUser()
 useEffect(()=>{let alive=true;(async()=>{try{setLoading(true);const [buildings,floors,units,o,c]=await Promise.all([listAll<any>('buildings'),listAll<any>('floors'),listAll<any>('units'),apiRequest<{data:Org[]}>('/master/organizations'),apiRequest<{data:{FileID:number;BuildingID:number}[]}>('/building-files')]);const mapped=buildings.map((b:any)=>{const r=fromDb(b);const fs=floors.filter((f:any)=>Number(f.Building_BuildingID)===Number(b.BuildingID));r.floorPlan=fs.map((f:any)=>({dbId:Number(f.FloorID),name:String(f.FloorName||''),area:String(f.FloorArea||''),constructed:String(f.ConstructedArea||''),common:String(f.CommonArea||''),units:units.filter((u:any)=>Number(u.Floor_FloorID)===Number(f.FloorID)).map(unitFromDb)}));r.units=r.floorPlan.reduce((n,f)=>n+f.units.length,0);return r});if(alive){setRows(mapped);setOrgs(o.data);setCovers(Object.fromEntries(c.data.map(x=>[x.BuildingID,x.FileID])))}}catch(e:any){if(alive)setMessage(`Could not load buildings from API: ${e.message}`)}finally{if(alive)setLoading(false)}})();return()=>{alive=false}},[])
 const filtered=useMemo(()=>rows.filter(r=>`${r.code} ${r.name} ${r.category} ${r.address}`.toLowerCase().includes(search.toLowerCase())),[rows,search])
 const update=(key:keyof BuildingRecord,value:any)=>setSelected(s=>s?({...s,[key]:value}):s)
 const defaultOrg=orgs[0]?.Name||''
 const orgCurrency=orgs.find(o=>o.Name===selected?.organization)?.Currency||orgs[0]?.Currency||'QAR'
 const resetAux=()=>{setFiles([]);setPending([]);setDocType('');setDocTitle('');setRents([]);setRentDraft({status:'Active'})}
 const loadAux=async(r:BuildingRecord)=>{if(!r.dbId)return;try{const [f,allRents]=await Promise.all([apiRequest<{data:FileRow[]}>(`/building-files?buildingId=${r.dbId}`),listAll<RentRow>('unit-rents')]);setFiles(f.data);const ids=new Set(r.floorPlan.flatMap(fl=>fl.units.map(u=>u.dbId)));setRents(allRents.filter(x=>ids.has(Number(x.UnitID))))}catch(e:any){setMessage(`Could not load images/documents: ${e.message}`)}}
 const edit=(r:BuildingRecord)=>{resetAux();const copy={...r,amenities:[...r.amenities],floorPlan:r.floorPlan.map(f=>({...f,units:f.units.map(u=>({...u}))}))};setSelected(copy);setIsNew(false);setTab('Building');setMessage('');void loadAux(copy)}
 const create=()=>{resetAux();setSelected({...blank(),organization:defaultOrg});setIsNew(true);setTab('Building');setMessage('')}
 const images=files.filter(f=>f.Kind==='image'), pendingImages=pending.filter(p=>p.kind==='image'), docs=files.filter(f=>f.Kind!=='image'), pendingDocs=pending.filter(p=>p.kind==='document')

 const addImages=async(list:FileList|null)=>{if(!list||!selected)return;const picked=Array.from(list);const tooBig=picked.find(f=>f.size>MAX_IMAGE);if(tooBig){setMessage(`${tooBig.name} is larger than 5 MB.`);return}if(picked.some(f=>!/\.(jpe?g|png|webp)$/i.test(f.name))){setMessage('Images must be JPG, PNG or WebP.');return}setMessage('');if(selected.dbId){try{for(const file of picked){const fd=new FormData();fd.append('buildingId',String(selected.dbId));fd.append('kind','image');fd.append('file',file);const r=await apiUpload<{data:FileRow}>('/building-files',fd);setFiles(f=>[r.data,...f]);setCovers(c=>c[selected.dbId!]?c:{...c,[selected.dbId!]:r.data.FileID})}}catch(e:any){setMessage(`Image upload failed: ${e.message}`)}}else setPending(p=>[...p,...picked.map(file=>({file,kind:'image' as const,docType:'',title:''}))])}
 const addDocument=async(list:FileList|null)=>{if(!list?.[0]||!selected)return;const file=list[0];if(!docType){setMessage('Select a document type before attaching a file.');return}if(file.size>MAX_DOC){setMessage(`${file.name} is larger than 15 MB.`);return}setMessage('');if(selected.dbId){try{const fd=new FormData();fd.append('buildingId',String(selected.dbId));fd.append('kind','document');fd.append('docType',docType);fd.append('title',docTitle||file.name);fd.append('file',file);const r=await apiUpload<{data:FileRow}>('/building-files',fd);setFiles(f=>[r.data,...f]);setDocTitle('')}catch(e:any){setMessage(`Document upload failed: ${e.message}`)}}else{setPending(p=>[...p,{file,kind:'document',docType,title:docTitle||file.name}]);setDocTitle('')}}
 const removeFile=async(f:FileRow)=>{if(!confirm(`Delete ${f.FileName}?`))return;try{await apiRequest(`/building-files/${f.FileID}`,{method:'DELETE'});setFiles(x=>x.filter(y=>y.FileID!==f.FileID))}catch(e:any){setMessage(`Delete failed: ${e.message}`)}}

 const save=async()=>{
  if(!selected)return
  if(!selected.name.trim()){setMessage('Building Name is required.');setTab('Building');return}
  if(images.length+pendingImages.length<1){setMessage('Attach at least one building image before saving.');setTab('Building');return}
  setSaving(true);setMessage('')
  let dbId=selected.dbId
  try{
   const rec={...selected,code:selected.code||`BLD${String(Date.now()).slice(-6)}`,address:[selected.address1,selected.address2,selected.city,selected.country].filter(Boolean).join(', '),units:selected.floorPlan.reduce((n,f)=>n+f.units.length,0)}
   const org=orgs.find(o=>o.Name===rec.organization)
   const payload:any={BlCode:rec.code,BuildingName:rec.name,OrganizationName:rec.organization,AddLine1:rec.address1,AddLine2:rec.address2,City:rec.city,Country:rec.country,Latitude:rec.latitude,Longitude:rec.longitude,Zone:rec.zone,TotalArea:rec.totalArea,ConstructedArea:rec.constructedArea,NoofFloors:Number(rec.floors)||0,Category:rec.category,Status:rec.status==='Inactive'?0:1,ElectricityNumber:rec.electricity,WaterNumber:rec.water,Comments:rec.comments,BLType:rec.type==='Commercial Building'?2:1}
   if(admin&&org)payload.Organization_OrganizationID=org.OrganizationID
   const amenityFields:any={'Indoor Gym':'IndoorGym','Outdoor Gym':'OutdoorGym','Swimming Pool':'SwimmingPool','Independent Supermarket':'IndependentSuperMarket','Private Parking':'PrivateParking','Guest Parking':'GuestParking','Park/Courtyard':'ParkCourtYard','Kids Play Area':'KidsPlayArea','Jogging Track':'JoggingTrack','Tennis Court':'TennisCourt','Basketball Court':'BasketballCourt','Free Wi-Fi':'FreeWifi','Elevators/Lifts':'Elevators','Conference Room':'ConferenceRoom'}
   Object.entries(amenityFields).forEach(([label,col])=>payload[col as string]=rec.amenities.includes(label)?1:0)
   let response:any
   if(!dbId){response=await createResource('buildings',payload)}else{response=await updateResource('buildings',dbId,payload)}
   const saved=response?.data||response
   dbId=Number(saved.BuildingID||dbId)
   const code=String(saved.BlCode||rec.code)
   const floorPlan:Floor[]=[]
   if(dbId){
    for(const f of rec.floorPlan){
     const floorPayload:any={FloorName:f.name,Building_BuildingID:dbId,BuildingCode:code,BuildingName:rec.name,OrganizationName:rec.organization,FloorArea:f.area,ConstructedArea:f.constructed,CommonArea:f.common}
     let floorId=f.dbId
     if(floorId)await updateResource('floors',floorId,floorPayload);else{const fr:any=await createResource('floors',floorPayload);floorId=Number((fr.data||fr).FloorID)}
     const units:Unit[]=[]
     for(const u of f.units){
      if(!u.dbId&&!u.name.trim())continue
      const up:any={UnitName:u.name||'Unit',UnitType:u.type,BuildingCode:code,BuildingName:rec.name,OrganizationName:rec.organization,Floor_FloorID:floorId,FloorName:f.name,Bedroom:u.bedrooms,Bathroom:u.bathrooms,Hall:u.hall,Kitchen:u.kitchen,Balcony:u.balcony,FurnishDetails:u.furnish,ElectricityNumber:u.electricity,WaterNumber:u.water,PrivParking:u.privParking}
      let unitId=u.dbId
      if(unitId)await updateResource('units',unitId,up);else{const ur:any=await createResource('units',up);unitId=Number((ur.data||ur).UnitID)}
      units.push({...u,dbId:unitId})
     }
     floorPlan.push({...f,dbId:floorId,units})
    }
   }
   const finalRec={...rec,dbId,code,floorPlan}
   // Upload queued images/documents now that the building exists. Keep the editor open on failure so nothing is lost.
   const queue=[...pending]
   for(const p of [...queue]){
    const fd=new FormData();fd.append('buildingId',String(dbId));fd.append('kind',p.kind);fd.append('docType',p.docType);fd.append('title',p.title);fd.append('file',p.file)
    try{const r=await apiUpload<{data:FileRow}>('/building-files',fd);setFiles(f=>[r.data,...f]);queue.splice(queue.indexOf(p),1);setPending([...queue])}
    catch(e:any){setSelected(finalRec);setIsNew(false);setMessage(`Building saved, but ${p.file.name} failed to upload: ${e.message}. Fix it and save again.`);return}
   }
   setRows(old=>old.some(r=>r.dbId===dbId)?old.map(r=>r.dbId===dbId?finalRec:r):[...old,finalRec])
   setSelected(null);setMessage('')
   apiRequest<{data:{FileID:number;BuildingID:number}[]}>('/building-files').then(c=>setCovers(Object.fromEntries(c.data.map(x=>[x.BuildingID,x.FileID])))).catch(()=>{})
  }catch(e:any){if(dbId&&!selected.dbId){setSelected(s=>s?{...s,dbId}:s);setIsNew(false)}setMessage(`Save failed: ${e.message}`)}finally{setSaving(false)}
 }
 const remove=async(code:string)=>{const row=rows.find(x=>x.code===code);if(!row)return;if(confirm('Delete this building?')){try{if(!row.dbId)throw new Error('Database ID missing');await deleteResource('buildings',row.dbId);setRows(r=>r.filter(x=>x.code!==code))}catch(e:any){setMessage(`Delete failed: ${e.message}`)}}}

 const changeFloor=(i:number,key:keyof Floor,val:any)=>update('floorPlan',selected!.floorPlan.map((f,j)=>j===i?{...f,[key]:val}:f))
 const changeUnit=(fi:number,ui:number,patch:Partial<Unit>)=>update('floorPlan',selected!.floorPlan.map((f,i)=>i===fi?{...f,units:f.units.map((u,j)=>j===ui?{...u,...patch}:u)}:f))
 const pickUnitType=(fi:number,ui:number,type:string)=>{const d=UNIT_TYPES[type];changeUnit(fi,ui,d?{type,bedrooms:d[0],bathrooms:d[1],kitchen:d[2],balcony:d[3]}:{type})}
 const dropFloorLocal=(fi:number)=>update('floorPlan',selected!.floorPlan.filter((_,i)=>i!==fi))
 // Floor removal rules: no units -> delete; units with tenants -> blocked; units without tenants -> confirm, then delete units too.
 const removeFloor=async(fi:number)=>{
  const f=selected!.floorPlan[fi];const hasUnits=f.units.some(u=>u.dbId||u.name.trim())
  if(!f.dbId){if(hasUnits&&!confirm('All the units under this floor will also be deleted permanently. Confirm to continue with the deletion.'))return;dropFloorLocal(fi);return}
  try{await apiRequest(`/floors/${f.dbId}/safe`,{method:'DELETE'});dropFloorLocal(fi)}
  catch(e:any){const code=e instanceof ApiError?e.body?.code:''
   if(code==='TENANTS_OCCUPIED'){alert('Floor cannot be deleted because tenants are occupied in the floor units')}
   else if(code==='CONFIRM_REQUIRED'){if(confirm('All the units under this floor will also be deleted permanently. Confirm to continue with the deletion.')){try{await apiRequest(`/floors/${f.dbId}/safe?confirm=1`,{method:'DELETE'});dropFloorLocal(fi)}catch(e2:any){setMessage(`Delete failed: ${e2.message}`)}}}
   else setMessage(`Delete failed: ${e.message}`)}
 }

 // Unit rent / lease rows
 const savedUnits=selected?selected.floorPlan.flatMap(f=>f.units.filter(u=>u.dbId).map(u=>({...u,floor:f.name}))):[]
 const unitById=(id:number)=>savedUnits.find(u=>u.dbId===id)
 const today=new Date().toISOString().slice(0,10)
 const addRent=async()=>{const unitId=Number(rentDraft.unit||savedUnits[0]?.dbId);if(!unitId){setMessage('Save the building with at least one unit first.');return}const status=rentDraft.status||'Active';if(status==='Active'&&rents.some(r=>r.UnitID===unitId&&r.Status==='Active')){setMessage('This unit already has an active rent row. Set it to Inactive before adding another.');return}const num=(k:string)=>rentDraft[k]===undefined||rentDraft[k]===''?null:Number(rentDraft[k]);if(['lease','base','maint','parking','misc'].some(k=>Number.isNaN(num(k)))){setMessage('Amounts must be numbers.');return}try{const r:any=await createResource('unit-rents',{UnitID:unitId,Currency:rentDraft.currency||orgCurrency,LeaseAmount:num('lease'),BaseRent:num('base'),MaintenanceCost:num('maint'),PrivParkingCost:num('parking'),MiscCost:num('misc'),Status:status,RentDate:today});setRents(x=>[r,...x]);setRentDraft({status:'Active'});setMessage('')}catch(e:any){setMessage(e.message)}}
 const setRentStatus=async(r:RentRow,status:string)=>{if(status==='Active'&&rents.some(x=>x.UnitID===r.UnitID&&x.RentID!==r.RentID&&x.Status==='Active')){setMessage('This unit already has an active rent row. Set it to Inactive before activating another.');return}try{const u:any=await updateResource('unit-rents',r.RentID,{Status:status});setRents(x=>x.map(y=>y.RentID===r.RentID?u:y));setMessage('')}catch(e:any){setMessage(e.message)}}
 const rd=(k:string)=>rentDraft[k]??''
 const setRd=(k:string)=>(v:string)=>setRentDraft(d=>({...d,[k]:v}))

 if(selected)return <div className="page-stack bm-root"><div className="bm-editor-top"><h1>Property <span className="bm-sep">&gt;</span> {isNew?'Create Building':`Building · ${selected.name}`}</h1><div className="bm-actions"><button className="secondary-btn" onClick={()=>setSelected(null)}><ArrowLeft size={16}/> Back to buildings</button><button className="secondary-btn" onClick={()=>setSelected(null)}>Cancel</button><button className="primary-btn" onClick={save} disabled={saving}>{saving?'Saving…':<><Check size={16}/> Save building</>}</button></div></div>
 <div className="bm-tabs">{(['Building','Floor Plan','Unit Rent / Lease'] as Tab[]).map(t=><button key={t} className={tab===t?'active':''} onClick={()=>setTab(t)}>{t}{t==='Floor Plan'&&<> <span>{selected.floorPlan.length}</span></>}</button>)}</div>{message&&<div className="bm-message">{message}</div>}
 {tab==='Building'&&<div className="bm-form-grid">
  <Section title="Building images" icon={<ImageIcon/>} note="At least one image is required. JPG, PNG or WebP, up to 5 MB each.">
   <div className="bm-gallery">{images.map(f=><div className="bm-thumb" key={f.FileID}><AuthImage fileId={f.FileID}/><button title="Delete image" onClick={()=>removeFile(f)}><Trash2 size={14}/></button></div>)}{pendingImages.map((p,i)=><div className="bm-thumb" key={`p${i}`}><LocalImage file={p.file}/><small>Pending save</small><button title="Remove" onClick={()=>setPending(x=>x.filter(y=>y!==p))}><X size={14}/></button></div>)}{!images.length&&!pendingImages.length&&<div className="bm-img-empty">No image attached</div>}</div>
   <label className="bm-upload"><CloudUpload/><b>Click to attach building images</b><input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={e=>{void addImages(e.target.files);e.target.value=''}}/></label>
  </Section>
  <Section title="Building information" icon={<Building2/>}><div className="bm-fields"><Field label="Organization" required value={selected.organization} disabled={!admin} onChange={v=>update('organization',v)} options={orgs.length?orgs.map(o=>o.Name):[selected.organization]}/><Field label="Building Name" required value={selected.name} onChange={v=>update('name',v)}/><Field label="Building Type" required value={selected.type} onChange={v=>update('type',v)} options={['Residential Building','Commercial Building','Mixed Use Building','Villa']}/><Field label="Category" value={selected.category} onChange={v=>update('category',v)} options={['Gated Community','Apartment','Villa','Commercial']}/><Field label="Category Name" value={selected.categoryName} onChange={v=>update('categoryName',v)}/><Field label="Status" value={selected.status} onChange={v=>update('status',v)} options={['Active','Inactive','Under Maintenance']}/><Field label="Number of Floors" type="number" value={selected.floors} onChange={v=>update('floors',v)}/><Field label="Electricity/W" required value={selected.electricityW} onChange={v=>update('electricityW',v)} options={['By Unit','By Building','Included in Rent']}/><Field label="Paid By" required value={selected.paidBy} onChange={v=>update('paidBy',v)} options={['By Tenant','By Owner','By Unit']}/><Field label="Electricity Number" value={selected.electricity} onChange={v=>update('electricity',v)}/><Field label="Water Number" value={selected.water} onChange={v=>update('water',v)}/><Field label="Comments" value={selected.comments} onChange={v=>update('comments',v)} wide/></div></Section>
  <Section title="Address" icon={<Landmark/>}><div className="bm-fields"><Field label="Building Number" value={selected.buildingNumber} onChange={v=>update('buildingNumber',v)}/><Field label="Zone Number" value={selected.zoneNumber} onChange={v=>update('zoneNumber',v)}/><Field label="Street Number" value={selected.streetNumber} onChange={v=>update('streetNumber',v)}/><Field label="Address Line 1" value={selected.address1} onChange={v=>update('address1',v)}/><Field label="Address Line 2" value={selected.address2} onChange={v=>update('address2',v)}/><Field label="City" value={selected.city} onChange={v=>update('city',v)}/><Field label="Country" value={selected.country} onChange={v=>update('country',v)} options={['Qatar','India','United Arab Emirates','Saudi Arabia']}/><Field label="Latitude" value={selected.latitude} onChange={v=>update('latitude',v)}/><Field label="Longitude" value={selected.longitude} onChange={v=>update('longitude',v)}/></div></Section>
  <Section title="Construction" icon={<Home/>}><div className="bm-fields"><Field label="Zone" value={selected.zone} onChange={v=>update('zone',v)}/><Field label="Block" value={selected.block} onChange={v=>update('block',v)}/><Field label="Site" value={selected.site} onChange={v=>update('site',v)}/><Field label="Total Area (Sq.Ft)" value={selected.totalArea} onChange={v=>update('totalArea',v)}/><Field label="Constructed Area (Sq.Ft)" value={selected.constructedArea} onChange={v=>update('constructedArea',v)}/></div><div className="bm-amenities"><b>Amenities</b><div>{amenitiesList.map(a=><label key={a}><input type="checkbox" checked={selected.amenities.includes(a)} onChange={e=>update('amenities',e.target.checked?[...selected.amenities,a]:selected.amenities.filter(x=>x!==a))}/>{a}</label>)}</div></div></Section>
  <Section title="Building documents" icon={<FileText/>} note="Attach multiple documents. Pick a type and an optional title, then choose a file.">
   <div className="bm-fields"><Field label="Type" value={docType||'Please select'} onChange={v=>setDocType(v==='Please select'?'':v)} options={['Please select',...DOC_TYPES]}/><Field label="Title" value={docTitle} onChange={setDocTitle}/><div className="bm-field"><span>Attachment</span><label className="bm-upload"><CloudUpload/><b>Drag and drop a file here or click</b><input type="file" onChange={e=>{void addDocument(e.target.files);e.target.value=''}}/></label></div></div>
   <table className="bm-doc-table"><thead><tr><th>Attachment</th><th>Type</th><th>Title</th><th>Added</th><th>Last updated</th><th></th></tr></thead><tbody>
    {docs.map(f=><tr key={f.FileID}><td><button className="bm-link" onClick={()=>void downloadFile(f)}>{f.FileName}</button> <small>({fmtSize(f.FileSize)})</small></td><td>{f.DocType||'—'}</td><td>{f.Title||'—'}</td><td>{fmtDate(f.CreatedAt)}<br/><small>{f.CreatedBy||'—'}</small></td><td>{fmtDate(f.UpdatedAt)}<br/><small>{f.UpdatedBy||'—'}</small></td><td><button className="bm-icon-danger" title="Delete" onClick={()=>void removeFile(f)}><Trash2 size={14}/></button></td></tr>)}
    {pendingDocs.map((p,i)=><tr key={`p${i}`}><td>{p.file.name} <small>({fmtSize(p.file.size)})</small></td><td>{p.docType}</td><td>{p.title}</td><td colSpan={2}><small>Uploads when the building is saved</small></td><td><button className="bm-icon-danger" title="Remove" onClick={()=>setPending(x=>x.filter(y=>y!==p))}><X size={14}/></button></td></tr>)}
    {!docs.length&&!pendingDocs.length&&<tr><td colSpan={6}>No documents attached.</td></tr>}
   </tbody></table>
  </Section></div>}
 {tab==='Floor Plan'&&<div className="bm-floor-list">{selected.floorPlan.map((floor,fi)=><Section key={fi} title={floor.name||`Floor ${fi+1}`} icon={<Building2/>}><div className="bm-floor-meta"><Field label="Floor Name" value={floor.name} onChange={v=>changeFloor(fi,'name',v)}/><Field label="Area (Sq.Ft.)" value={floor.area} onChange={v=>changeFloor(fi,'area',v)}/><Field label="Constructed Area (Sq.Ft.)" value={floor.constructed} onChange={v=>changeFloor(fi,'constructed',v)}/><Field label="Common Area (Sq.Ft.)" value={floor.common} onChange={v=>changeFloor(fi,'common',v)}/><button className="bm-icon-danger" onClick={()=>void removeFloor(fi)}><Trash2 size={15}/> Remove floor</button></div><div className="bm-unit-head"><b>Units</b><button className="secondary-btn" onClick={()=>changeFloor(fi,'units',[...floor.units,emptyUnit()])}><Plus size={15}/> Add unit</button></div><div className="bm-table-scroll"><table><thead><tr>{['Unit Name','Unit Type','Bedrooms','Bathrooms','Hall','Kitchen','Balcony','Furnish Details','Electricity Number','Water Number','Priv Parking',''].map(x=><th key={x}>{x}</th>)}</tr></thead><tbody>{floor.units.map((u,ui)=><tr key={ui}>
   <td><input aria-label="Unit name" value={u.name} onChange={e=>changeUnit(fi,ui,{name:e.target.value})}/></td>
   <td><select aria-label="Unit type" value={u.type} onChange={e=>pickUnitType(fi,ui,e.target.value)}><option value="">Select type</option>{u.type&&!UNIT_TYPES[u.type]&&<option>{u.type}</option>}{Object.keys(UNIT_TYPES).map(t=><option key={t}>{t}</option>)}</select></td>
   {(['bedrooms','bathrooms','hall','kitchen','balcony'] as (keyof Unit)[]).map(k=><td key={k}><input aria-label={k} value={u[k] as string} onChange={e=>changeUnit(fi,ui,{[k]:e.target.value})}/></td>)}
   <td><select aria-label="Furnish details" value={u.furnish} onChange={e=>changeUnit(fi,ui,{furnish:e.target.value})}>{!FURNISH.includes(u.furnish)&&<option>{u.furnish}</option>}{FURNISH.map(x=><option key={x}>{x}</option>)}</select></td>
   {(['electricity','water','privParking'] as (keyof Unit)[]).map(k=><td key={k}><input aria-label={k} value={u[k] as string} onChange={e=>changeUnit(fi,ui,{[k]:e.target.value})}/></td>)}
   <td><button className="bm-icon-danger" onClick={()=>changeFloor(fi,'units',floor.units.filter((_,i)=>i!==ui))}><Trash2 size={14}/></button></td></tr>)}</tbody></table></div></Section>)}<button className="primary-btn bm-add-floor" onClick={()=>update('floorPlan',[...selected.floorPlan,emptyFloor(`Floor ${selected.floorPlan.length}`)])}><Plus size={16}/> Add floor</button></div>}
 {tab==='Unit Rent / Lease'&&<Section title="Unit rent / lease details" icon={<Home/>} note="A unit can have many rent rows over time but only one Active row. Save the building first so every unit exists.">
  <div className="bm-table-scroll"><table><thead><tr>{['Unit Name','Type','Currency','Lease Amount / Security Deposit','Base Rent','Monthly Maintenance','Priv Parking Cost','Misc Cost','Status','Date'].map(x=><th key={x}>{x}</th>)}</tr></thead><tbody>
   {rents.map(r=>{const u=unitById(r.UnitID);return <tr key={r.RentID}><td>{u?.name||`#${r.UnitID}`}</td><td>{u?.type||'—'}</td><td>{r.Currency}</td><td>{r.LeaseAmount??'—'}</td><td>{r.BaseRent??'—'}</td><td>{r.MaintenanceCost??'—'}</td><td>{r.PrivParkingCost??'—'}</td><td>{r.MiscCost??'—'}</td><td><select value={r.Status} onChange={e=>void setRentStatus(r,e.target.value)}><option>Active</option><option>Inactive</option></select></td><td>{String(r.RentDate).slice(0,10)}</td></tr>})}
   {!rents.length&&<tr><td colSpan={10}>No rent rows yet.</td></tr>}
   <tr><td><select value={rd('unit')||String(savedUnits[0]?.dbId??'')} onChange={e=>setRd('unit')(e.target.value)}>{savedUnits.map(u=><option key={u.dbId} value={u.dbId}>{u.name} ({u.floor})</option>)}</select></td><td>{unitById(Number(rd('unit')||savedUnits[0]?.dbId))?.type||'—'}</td><td><input value={rentDraft.currency??orgCurrency} onChange={e=>setRd('currency')(e.target.value)}/></td>{(['lease','base','maint','parking','misc'] as string[]).map(k=><td key={k}><input type="number" min="0" value={rd(k)} onChange={e=>setRd(k)(e.target.value)}/></td>)}<td><select value={rd('status')||'Active'} onChange={e=>setRd('status')(e.target.value)}><option>Active</option><option>Inactive</option></select></td><td>{today}</td></tr>
  </tbody></table></div>
  <div style={{marginTop:12}}><button className="primary-btn" disabled={!savedUnits.length} onClick={()=>void addRent()}><Plus size={15}/> Add rent row</button>{!savedUnits.length&&<span className="bm-error"> Add units on the Floor Plan tab and save the building first.</span>}</div>
 </Section>}
 <div className="bm-bottom-save"><button className="secondary-btn" onClick={()=>setSelected(null)}>Cancel</button><button className="primary-btn" onClick={save} disabled={saving}>{saving?'Saving…':<><Check size={16}/> Save building</>}</button></div></div>
 return <div className="page-stack bm-root"><PageHeader title="Manage Buildings" subtitle="Manage building details, floors, units and documents in one place." action={<button className="primary-btn" onClick={create}><Plus size={17}/> Create New</button>}/><div className="panel">{message&&<div className="bm-message">{message}</div>}{loading&&<div className="bm-message">Loading buildings from backend…</div>}<DataTable data={filtered} columns={[{key:'cover',label:'Image',sortable:false,render:(_:any,row:BuildingRecord)=>row.dbId&&covers[row.dbId]?<AuthImage fileId={covers[row.dbId]} className="bm-cover"/>:'—'},{key:'code',label:'Building',render:(val:any,row:BuildingRecord)=>(<button className="bm-link" onClick={()=>edit(row)}>{val||'—'}</button>)},{key:'name',label:'Building Name',render:(val:any)=>(<b>{val}</b>)},{key:'categoryName',label:'Category Name',render:(val:any)=>val||'—'},{key:'address',label:'Address',render:(val:any)=>val||'—'},{key:'latitude',label:'Latitude',render:(val:any)=>val||'—'},{key:'longitude',label:'Longitude',render:(val:any)=>val||'—'},{key:'status',label:'Status',render:(val:any)=>(<Status>{val}</Status>)},{key:'electricity',label:'Electricity Number',render:(val:any)=>val||'—'},{key:'water',label:'Water Number',render:(val:any)=>val||'—'},{key:'actions',label:'Actions',sortable:false,render:(_:any,row:BuildingRecord)=>(<div className="bm-row-actions"><button title="Edit" onClick={()=>edit(row)}><Pencil size={14}/></button><button title="Delete" onClick={()=>remove(row.code)}><Trash2 size={14}/></button></div>)}]} pageSize={25} emptyMessage="No buildings found" onRowClick={(row:BuildingRecord)=>edit(row)}/></div></div>
}
