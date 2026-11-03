import React from 'react'
import { Search } from 'lucide-react'
export function PageHeader({ title, subtitle, action }: { title:string; subtitle?:string; action?:React.ReactNode }) { return <div className="page-header"><div><div className="eyebrow">CITYOPS · MANAGEMENT</div><h1>{title}</h1>{subtitle&&<p>{subtitle}</p>}</div>{action}</div> }
export function Toolbar({ query, setQuery, count=25 }: { query:string; setQuery:(v:string)=>void; count?:number }) { return <div className="toolbar"><label>Show <select defaultValue={String(count)}><option>10</option><option>25</option><option>50</option><option>100</option></select> entries</label><div className="search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search records..."/></div></div> }
export function TableWrap({children}:{children:React.ReactNode}){return <div className="table-scroll"><table>{children}</table></div>}
export function TableHead({children}:{children:React.ReactNode}){return <thead><tr>{children}</tr></thead>}
export function Th({children}:{children:React.ReactNode}){return <th>{children}<span>↕</span></th>}
export function Pagination({total=2}:{total?:number}){return <div className="pagination"><span>Showing 1 to {total} of {total} entries</span><div><button>Previous</button><button className="current">1</button><button>Next</button></div></div>}
export function Status({children='Active'}:{children?:React.ReactNode}){return <span className="status"><i/>{children}</span>}

export function Field({label,value,type='text',required,textarea,placeholder,options}:{label:string;value?:string;type?:string;required?:boolean;textarea?:boolean;placeholder?:string;options?:string[]}){
 return <label className="field"><span>{required&&<i>*</i>}{label}</span>{
  textarea
   ? <textarea defaultValue={value} placeholder={placeholder}/>
   : type==='select'
    ? <select defaultValue={value}>{placeholder&&<option value="">{placeholder}</option>}{(options||(value?[value]:[])).map(o=><option key={o}>{o}</option>)}</select>
    : <input type={type} defaultValue={value} placeholder={placeholder}/>
 }</label>
}

export function FormCard({title,icon,children}:{title:string;icon?:React.ReactNode;children:React.ReactNode}){
 return <section className="form-card"><header>{icon&&<span className="form-card-icon">{icon}</span>}<h3>{title}</h3></header><div className="form-card-body">{children}</div></section>
}
