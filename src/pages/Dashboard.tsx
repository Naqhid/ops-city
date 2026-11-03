import React, { useEffect, useState } from 'react'
import { Activity, ArrowLeft, ArrowRight, ArrowUpRight, Banknote, BarChart3, Bell, Building2, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, CircleDollarSign, ClipboardList, CloudUpload, Download, Edit3, Eye, FileCheck2, FileText, Filter, Home, Landmark, LayoutDashboard, Menu, MoreHorizontal, Pencil, Plus, ReceiptText, RefreshCw, Search, Settings, Sparkles, Table2, Trash2, TrendingUp, Upload, UserRound, Users, Wallet, WalletCards, Wrench, X, Zap } from 'lucide-react'
import { Page } from '../types'
import { listResource, apiRequest } from '../lib/api'
import { PageHeader, Toolbar, TableWrap, TableHead, Th, Pagination, Status } from '../shared'

export function Dashboard({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [summary,setSummary]=useState<any>({buildings:0,investors:0,tenants:0,totalRent:0});
  const [unitCount,setUnitCount]=useState(0); const [availableCount,setAvailableCount]=useState(0); const [dashboardError,setDashboardError]=useState('');
  useEffect(()=>{let active=true;(async()=>{try{const [summaryResult,units]=await Promise.all([apiRequest<any>('/dashboard/summary'),listResource('units')]);if(!active)return;setSummary(summaryResult.data||summaryResult);setUnitCount(units.length);setAvailableCount(Math.max(0,units.length-(Number((summaryResult.data||summaryResult).tenants)||0)))}catch(e:any){if(active)setDashboardError(`Dashboard API unavailable: ${e.message}`)}})();return()=>{active=false}},[]);
  const occupancy=unitCount?Math.round(((unitCount-availableCount)/unitCount)*100):0;
  const money=(value:number)=>`QAR ${Number(value||0).toLocaleString('en-US',{maximumFractionDigits:2})}`;
  const cards = [
    ['Buildings',String(summary.buildings||0),'Live database count',Building2,'blue'],
    ['Total Units',String(unitCount),`${availableCount} estimated available`,Home,'violet'],
    ['Monthly Rent',money(summary.totalRent||0),'From rental records',CircleDollarSign,'green'],
    ['Occupancy',`${occupancy}%`,'Estimated from unit/tenant counts',Activity,'amber']
  ] as const

  return <div className="page-stack">
    <div className="hero-row">
      <div>
        <div className="eyebrow"><Sparkles size={14}/> PORTFOLIO OVERVIEW</div>
        <h1>Good afternoon, Athauallah</h1>
        <p>Monitor your property portfolio, tenants and financial activity from one place.</p>
      </div>
      <button className="primary-btn" onClick={() => onNavigate('buildings')}><Plus size={17}/> Add building</button>
    </div>

    <div className="stat-grid">
      {cards.map(([label,value,meta,Icon,tone]) =>
        <div className={`stat-card ${tone}`} key={label}>
          <div className="stat-top"><span>{label}</span><span className="stat-icon"><Icon size={18}/></span></div>
          <strong>{value}</strong><small>{meta}</small>
        </div>
      )}
    </div>

    <div className="people-metrics">
      <button className="people-card" onClick={() => onNavigate('investors')}>
        <span className="people-icon blue"><UserRound size={17}/></span>
        <span><b>{summary.investorRelations||0}</b><small>Owners / Relations</small></span>
        <ArrowUpRight size={15}/>
      </button>
      <button className="people-card" onClick={() => onNavigate('tenants')}>
        <span className="people-icon green"><Users size={17}/></span>
        <span><b>{summary.tenants||0}</b><small>Tenants</small></span>
        <ArrowUpRight size={15}/>
      </button>
      <button className="people-card" onClick={() => onNavigate('investors')}>
        <span className="people-icon violet"><Wallet size={17}/></span>
        <span><b>{summary.investors||0}</b><small>Investors</small></span>
        <ArrowUpRight size={15}/>
      </button>
    </div>

    <div className="dashboard-grid">
      <div className="panel large">
        <div className="panel-head">
          <div><h2>Portfolio snapshot</h2><p>Current property performance</p></div>
          <button className="ghost-btn" onClick={() => onNavigate('available')}>View report <ArrowUpRight size={15}/></button>
        </div>
        <div className="snapshot">
          <div className="donut"><div><b>{occupancy}%</b><span>Occupied</span></div></div>
          <div className="legend">
            <Legend label="Occupied units" value={String(Math.max(0,unitCount-availableCount))} tone="blue"/>
            <Legend label="Available units" value={String(availableCount)} tone="green"/>
            <Legend label="Buildings" value={String(summary.buildings||0)} tone="violet"/>
          </div>
          <div className="mini-chart">
            <div className="chart-bars">{[38,55,44,72,61,82,68,91,76,88,94,79].map((h,i)=><i style={{height:`${h}%`}} key={i}/>)}</div>
            <div className="chart-labels"><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span></div>
          </div>
        </div>
      </div>
      <div className="panel">
        <div className="panel-head"><div><h2>Quick actions</h2><p>Common tasks</p></div></div>
        <div className="quick-grid">
          <Quick icon={<Building2/>} label="Manage buildings" onClick={() => onNavigate('buildings')}/>
          <Quick icon={<FileCheck2/>} label="Agreements" onClick={() => onNavigate('agreements')}/>
          <Quick icon={<Banknote/>} label="Record source" onClick={() => onNavigate('sources')}/>
          <Quick icon={<BarChart3/>} label="View reports" onClick={() => onNavigate('available')}/>
        </div>
      </div>
    </div>

    <RenewalsDashboard onNavigate={onNavigate}/>

    <div className="panel">
      <div className="panel-head">
        <div><h2>Recent activity</h2><p>Latest changes across the portfolio</p></div>
        <button className="ghost-btn">View all</button>
      </div>
      <div className="activity-list">
        <ActivityItem icon={<Building2/>} title="South End building updated" text="Building details were updated" time="12 min ago"/>
        <ActivityItem icon={<FileText/>} title="Building Agreement template edited" text="Agreement draft was saved" time="48 min ago"/>
        <ActivityItem icon={<CircleDollarSign/>} title="Rent source added" text="Rent from Tenant · QAR 6,150" time="2 hrs ago"/>
      </div>
    </div>
  </div>
}

export function RenewalsDashboard({onNavigate}:{onNavigate:(p:Page)=>void}) {
  const [buildingRows,setBuildingRows]=useState<any[]>([]);
  const [rentRows,setRentRows]=useState<any[]>([]);
  const [leaseRows,setLeaseRows]=useState<any[]>([]);
  useEffect(()=>{let active=true;(async()=>{try{const [buildings,tenants]=await Promise.all([listResource('buildings'),listResource('tenants')]);if(!active)return;setBuildingRows(buildings.filter((b:any)=>b.RenewalDate||b.EndDate).map((b:any)=>({building:b.BuildingName||b.Name||'—',code:b.BlCode||b.BuildingID,person:b.OwnerName||'—',date:formatDate(b.RenewalDate||b.EndDate)})));setRentRows(tenants.filter((t:any)=>t.RDRenewalDate||t.RDEndDate).map((t:any)=>({building:t.BuildingName||'—',unit:t.UnitName||t.UnitID||'—',person:t.Name||'—',date:formatDate(t.RDRenewalDate||t.RDEndDate)})));setLeaseRows(tenants.filter((t:any)=>t.LDRenewalDate||t.LDEndDate).map((t:any)=>({building:t.BuildingName||'—',unit:t.UnitName||t.UnitID||'—',person:t.Name||'—',date:formatDate(t.LDRenewalDate||t.LDEndDate)})))}catch{/* renewal cards remain empty if API unavailable */}})();return()=>{active=false}},[]);
  return <div className="renewals-section"><div className="renewals-heading"><div><div className="eyebrow"><CalendarDays size={14}/> RENEWALS</div><h2>Renewal overview</h2><p>Renewal dates loaded from the property and tenant records.</p></div></div><div className="renewal-grid">
    <RenewalCard title="Building Renewals" subtitle="Building and owner renewal dates" icon={<Building2 size={17}/>} tone="blue" rows={buildingRows.map(r=>({...r,status:renewalStatus(r.date)}))} columns={['Building','Code','Owner','Renewal date']} onView={()=>onNavigate('buildings')}/>
    <RenewalCard title="Rent Renewals" subtitle="Tenant rent renewal dates" icon={<CircleDollarSign size={17}/>} tone="green" rows={rentRows.map(r=>({...r,status:renewalStatus(r.date)}))} columns={['Building','Unit','Tenant','Renewal date']} onView={()=>onNavigate('tenants')}/>
    <RenewalCard title="Lease Renewals" subtitle="Lease and agreement renewal dates" icon={<FileCheck2 size={17}/>} tone="violet" rows={leaseRows.map(r=>({...r,status:renewalStatus(r.date)}))} columns={['Building','Unit','Tenant','Renewal date']} empty="No lease renewals scheduled." onView={()=>onNavigate('agreements')}/>
  </div></div>
}
function formatDate(value:any){if(!value)return '';const d=new Date(value);return Number.isNaN(d.getTime())?'':`${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`}

export function renewalStatus(date:string) {
  const [day,month,year] = date.split('/').map(Number)
  const renewal = new Date(year, month - 1, day)
  const today = new Date(); today.setHours(0,0,0,0)
  const diff = Math.ceil((renewal.getTime() - today.getTime()) / 86400000)
  if (diff < 0) return 'Overdue'
  if (diff <= 60) return 'Due soon'
  return 'Upcoming'
}

export function RenewalCard({
  title, subtitle, icon, tone, rows, columns, empty, onView
}: {
  title:string; subtitle:string; icon:React.ReactNode; tone:string;
  rows:any[]; columns:string[]; empty?:string; onView:()=>void
}) {
  return <section className="panel renewal-card">
    <div className="renewal-card-head">
      <div className={`renewal-icon ${tone}`}>{icon}</div>
      <div className="renewal-card-title"><h3>{title}</h3><p>{subtitle}</p></div>
      <span className="renewal-count">{rows.length}</span>
    </div>
    {rows.length ? <div className="renewal-table-wrap">
      <table className="renewal-table">
        <thead><tr>{columns.map(c=><th key={c}>{c}</th>)}</tr></thead>
        <tbody>{rows.map((r,i)=><tr key={`${r.building}-${r.date}-${i}`}>
          <td><b>{r.building}</b></td>
          <td>{r.code || r.unit || '—'}</td>
          <td>{r.person || '—'}</td>
          <td><div className="renewal-date">{r.date}<span className={`renewal-status ${r.status.toLowerCase().replace(' ','-')}`}>{r.status}</span></div></td>
        </tr>)}</tbody>
      </table>
    </div> : <div className="renewal-empty"><CalendarDays size={25}/><span>{empty}</span></div>}
    <button className="renewal-view" onClick={onView}>View all <ArrowRight size={14}/></button>
  </section>
}

export function Legend({label,value,tone}:{label:string;value:string;tone:string}){return <div className="legend-row"><span className={`dot ${tone}`}/><span>{label}</span><b>{value}</b></div>}

export function Quick({icon,label,onClick}:{icon:React.ReactNode;label:string;onClick:()=>void}){return <button className="quick" onClick={onClick}><span>{icon}</span><b>{label}</b><ArrowRight size={14}/></button>}

export function ActivityItem({icon,title,text,time}:{icon:React.ReactNode;title:string;text:string;time:string}){return <div className="activity-item"><span className="activity-icon">{icon}</span><div><b>{title}</b><p>{text}</p></div><time>{time}</time></div>}
