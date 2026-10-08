import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  Activity, ArrowLeft, ArrowRight, ArrowUpRight, Banknote, BarChart3, Bell,
  Building2, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight,
  CircleDollarSign, ClipboardList, CloudUpload, Download, Edit3, Eye,
  FileCheck2, FileText, Filter, Home, Landmark, LayoutDashboard, Menu,
  MoreHorizontal, Pencil, Plus, ReceiptText, RefreshCw, Search, Settings,
  Sparkles, Table2, Trash2, TrendingUp, Upload, UserRound, Users, Wallet,
  WalletCards, Wrench, X, Zap
} from 'lucide-react'
import './styles.css'

type Page =
  | 'dashboard' | 'investors' | 'agreements' | 'agreement-editor' | 'buildings' | 'building-form'
  | 'investor-relation' | 'tenants' | 'building-rents' | 'building-expenses'
  | 'sources' | 'banks' | 'financial' | 'available' | 'building-cost' | 'owners' | 'investments'

type NavGroup = 'assets' | 'tenant' | 'expenses' | 'financials' | 'reports'

const buildings = [
  { code: 'BLD000001', name: 'South End', type: 'Residential', category: 'Gated Community', categoryName: '', address: 'Zone 4, Doha', floors: 2, units: 4, available: 1, status: 'Active', electricity: '', water: '' },
  { code: 'BLD000002', name: 'West End', type: 'Commercial', category: '', categoryName: '', address: '', floors: 0, units: 0, available: 0, status: 'Active', electricity: '', water: '' },
]
const investors = [
  { id: 'INV000001', name: 'Suleman', type: 'Investor, Owner', city: 'Waqah', phone: '+974 5550 1122', buildings: 1, status: 'Active' },
  { id: 'INV000002', name: 'Axiom Holdings', type: 'Owner', city: 'Doha', phone: '+974 4440 2200', buildings: 2, status: 'Active' },
]
const tenants = [
  { code: 'BLD000001', building: 'South End', type: 'Residential', category: 'Gated Community', address: 'Zone 4, Doha', status: 'Active', electricity: '' },
  { code: 'BLD000002', building: 'West End', type: 'Commercial', category: '', address: '', status: 'Active', electricity: '' },
]
const rentRows = [
  { code: 'BLD000001', building: 'South End', type: 'Residential', category: 'Gated Community', address: 'Zone 4, Doha', lat: '3345.776', lng: '4453.998', status: 'Active', electricity: '', water: '' },
  { code: 'BLD000002', building: 'West End', type: 'Commercial', category: '', address: '', lat: '', lng: '', status: 'Active', electricity: '', water: '' },
]
const sourceRows = [
  { code: 'DR000001', description: 'Rent from Tenant', status: 'Active', date: '11-12-2023' },
  { code: 'DR000002', description: 'E&W from Tenant', status: 'Active', date: '11-12-2023' },
  { code: 'DR000003', description: 'Maintenance cost from Tenant', status: 'Active', date: '11-12-2023' },
  { code: 'DR000004', description: 'General/Other', status: 'Active', date: '11-12-2023' },
  { code: 'DR000005', description: 'Investment', status: 'Active', date: '11-12-2023' },
]

const renewalData = {
  buildings: [
    { building: 'South End', code: 'BLD000002', person: 'Suleman', date: '11/02/2024' },
    { building: 'South End', code: 'BLD000002', person: 'Suleman', date: '10/03/2026' },
    { building: 'West End', code: 'BLD000002', person: 'Suleman', date: '20/09/2026' },
  ],
  rents: [
    { building: 'South End', unit: 'G1', person: 'Suleman', date: '18/02/2026' },
    { building: 'South End', unit: 'G1', person: 'kdsjkdsa', date: '12/10/2023' },
    { building: 'South End', unit: 'F1', person: 'Jacob Andrews', date: '03/03/2026' },
    { building: 'South End', unit: 'F1', person: 'Jacob Andrews', date: '03/03/2027' },
  ],
  leases: [],
}

function App() {
  const [page, setPage] = useState<Page>('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [open, setOpen] = useState<Record<NavGroup, boolean>>({ assets: true, tenant: false, expenses: false, financials: false, reports: false })
  const [query, setQuery] = useState('')
  const [selectedAgreement, setSelectedAgreement] = useState('Building Agreement')
  const [modal, setModal] = useState<'source' | 'delete' | null>(null)
  const [editingSource, setEditingSource] = useState(sourceRows[1])

  const navigate = (next: Page) => { setPage(next); setQuery(''); setMobileOpen(false) }
  const toggle = (key: NavGroup) => setOpen(v => ({ ...v, [key]: !v[key] }))

  const title = useMemo(() => ({
    dashboard: 'Dashboard', investors: 'Investors & Owners', agreements: 'Contract Agreements', 'agreement-editor': 'Agreement Template',
    buildings: 'Manage Buildings', 'building-form': 'Building Details', 'investor-relation': 'Investor Relation', tenants: 'Tenants and Rentals',
    'building-rents': 'Building Rents', 'building-expenses': 'Building Expense', sources: 'Credit / Debit Sources', banks: 'Bank Details',
    financial: 'Financial', available: 'Available Buildings', 'building-cost': 'Building Total Cost', owners: "Owner's Buildings", investments: "Investor's Investment"
  } as Record<Page, string>)[page], [page])

  const nav = (p: Page) => () => navigate(p)

  return (
    <div className="app-shell">
      <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} open={open} toggle={toggle} page={page} nav={nav} />
      {mobileOpen && <div className="sidebar-backdrop" onClick={() => setMobileOpen(false)} aria-hidden="true" />}
      <div className={`main-shell ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button" onClick={() => { if (window.matchMedia('(max-width:760px)').matches) setMobileOpen(v => !v); else setCollapsed(v => !v) }} aria-label="Toggle sidebar"><Menu size={21} /></button>
            <div className="breadcrumb"><span>CityOps</span><ChevronRight size={14}/><strong>{title}</strong></div>
          </div>
          <div className="top-actions">
            <button className="icon-button notification"><Bell size={18}/><span /></button>
            <button className="icon-button"><Settings size={18}/></button>
            <div className="avatar">AK</div>
          </div>
        </header>

        <main className="content">
          {page === 'dashboard' && <Dashboard onNavigate={navigate} />}
          {page === 'investors' && <InvestorsPage query={query} setQuery={setQuery} onCreate={() => {}} />}
          {page === 'agreements' && <AgreementsPage onDraft={(name) => { setSelectedAgreement(name); navigate('agreement-editor') }} />}
          {page === 'agreement-editor' && <AgreementEditor name={selectedAgreement} onBack={nav('agreements')} />}
          {page === 'buildings' && <BuildingsPage query={query} setQuery={setQuery} onCreate={() => navigate('building-form')} onEdit={() => navigate('building-form')} />}
          {page === 'building-form' && <BuildingForm onBack={nav('buildings')} />}
          {page === 'investor-relation' && <SimpleBuildingTable title="Investor Relation" rows={tenants} query={query} setQuery={setQuery} />}
          {page === 'tenants' && <SimpleBuildingTable title="Tenants and Rentals" rows={tenants} query={query} setQuery={setQuery} />}
          {page === 'building-rents' && <SimpleBuildingTable title="Building Rents" rows={rentRows} query={query} setQuery={setQuery} compact />}
          {page === 'building-expenses' && <SimpleBuildingTable title="Building Expense" rows={rentRows} query={query} setQuery={setQuery} compact />}
          {page === 'sources' && <SourcesPage onEdit={(r) => { setEditingSource(r); setModal('source') }} onAdd={() => { setEditingSource({ code: 'NEW', description: '', status: 'Active', date: '05-10-2026' }); setModal('source') }} />}
          {page === 'banks' && <BankDetailsPage />}
          {page === 'financial' && <FinancialPage />}
          {page === 'available' && <AvailablePage />}
          {page === 'building-cost' && <BuildingCostPage />}
          {page === 'owners' && <OwnersPage />}
          {page === 'investments' && <InvestmentsPage />}
        </main>
        <footer>© 2026 CityOps · Property Management Suite</footer>
      </div>

      {modal === 'source' && <SourceModal value={editingSource} onClose={() => setModal(null)} onSave={() => setModal(null)} />}
      {modal === 'delete' && <ConfirmModal onClose={() => setModal(null)} />}
      <button className="support-fab"><Zap size={17}/></button>
    </div>
  )
}

function Sidebar({ collapsed, mobileOpen, open, toggle, page, nav }: { collapsed: boolean; mobileOpen: boolean; open: Record<NavGroup, boolean>; toggle: (k: NavGroup) => void; page: Page; nav: (p: Page) => () => void }) {
  const group = (key: NavGroup, label: string, icon: React.ReactNode, items: [string, Page][]) => (
    <div className="nav-group">
      <button className={`nav-row ${items.some(([,p]) => p === page) ? 'group-active' : ''}`} onClick={() => toggle(key)} title={collapsed ? label : undefined}>
        <span className="nav-main"><span className="nav-icon">{icon}</span>{!collapsed && <span>{label}</span>}</span>
        {!collapsed && (open[key] ? <ChevronDown size={15}/> : <ChevronRight size={15}/>)}
      </button>
      {!collapsed && open[key] && <div className="subnav">{items.map(([label, p]) => <button key={p} onClick={nav(p)} className={`subnav-row ${page === p ? 'active' : ''}`}>{label}</button>)}</div>}
    </div>
  )
  return <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
    <div className="brand"><div className="brand-mark"><Building2 size={21}/></div>{!collapsed && <div><div className="brand-name">CITYOPS</div><div className="brand-sub">PROPERTY MANAGEMENT</div></div>}</div>
    {!collapsed && <div className="profile"><div className="profile-avatar">AK<span/></div><div><b>Athauallah Khan</b><small>Administrator</small></div></div>}
    <nav className="sidebar-nav">
      <button className={`nav-row ${page === 'dashboard' ? 'active' : ''}`} onClick={nav('dashboard')} title={collapsed ? 'Dashboard' : undefined}><span className="nav-main"><span className="nav-icon"><LayoutDashboard size={18}/></span>{!collapsed && <span>Dashboard</span>}</span>{!collapsed && <ChevronRight size={15}/>}</button>
      {group('assets', 'Assets', <Building2 size={18}/>, [['Investors & Owners','investors'],['Contract Agreements','agreements'],['Manage Building','buildings'],['Investor Relation','investor-relation']])}
      {group('tenant', 'Tenant Maintenance', <Users size={18}/>, [['Tenants & Rentals','tenants']])}
      {group('expenses', 'Expenses', <ReceiptText size={18}/>, [['Building Rents','building-rents'],['Building Expense','building-expenses']])}
      {group('financials', 'Financials', <WalletCards size={18}/>, [['Credit/Debit Sources','sources'],['Bank Details','banks'],['Financial','financial']])}
      {group('reports', 'Reports', <BarChart3 size={18}/>, [['Available Building','available'],['Building Total Cost','building-cost'],["Owner's Building",'owners'],["Investor's Investment",'investments']])}
    </nav>
    {!collapsed && <div className="sidebar-status"><div><span>Portfolio health</span><b>Excellent</b></div><div className="health-track"><i/></div><small>76% operational readiness</small></div>}
  </aside>
}

function Dashboard({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const cards = [
    ['Buildings','2','+1 this month',Building2,'blue'],
    ['Total Units','4','1 available',Home,'violet'],
    ['Monthly Rent','QAR 18,450','+8.4% vs last month',CircleDollarSign,'green'],
    ['Occupancy','75%','1 unit available',Activity,'amber']
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
        <span><b>1</b><small>Owners</small></span>
        <ArrowUpRight size={15}/>
      </button>
      <button className="people-card" onClick={() => onNavigate('tenants')}>
        <span className="people-icon green"><Users size={17}/></span>
        <span><b>3</b><small>Tenants</small></span>
        <ArrowUpRight size={15}/>
      </button>
      <button className="people-card" onClick={() => onNavigate('investors')}>
        <span className="people-icon violet"><Wallet size={17}/></span>
        <span><b>1</b><small>Investors</small></span>
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
          <div className="donut"><div><b>75%</b><span>Occupied</span></div></div>
          <div className="legend">
            <Legend label="Occupied units" value="3" tone="blue"/>
            <Legend label="Available units" value="1" tone="green"/>
            <Legend label="Buildings" value="2" tone="violet"/>
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

function RenewalsDashboard({onNavigate}:{onNavigate:(p:Page)=>void}) {
  return <div className="renewals-section">
    <div className="renewals-heading">
      <div>
        <div className="eyebrow"><CalendarDays size={14}/> RENEWALS</div>
        <h2>Renewal overview</h2>
        <p>Keep upcoming and overdue property renewals visible at a glance.</p>
      </div>
    </div>
    <div className="renewal-grid">
      <RenewalCard
        title="Building Renewals"
        subtitle="Building and owner renewal dates"
        icon={<Building2 size={17}/>}
        tone="blue"
        rows={renewalData.buildings.map(r => ({...r, status: renewalStatus(r.date)}))}
        columns={['Building','Code','Owner','Renewal date']}
        onView={() => onNavigate('buildings')}
      />
      <RenewalCard
        title="Rent Renewals"
        subtitle="Tenant rent renewal dates"
        icon={<CircleDollarSign size={17}/>}
        tone="green"
        rows={renewalData.rents.map(r => ({...r, status: renewalStatus(r.date)}))}
        columns={['Building','Unit','Tenant','Renewal date']}
        onView={() => onNavigate('tenants')}
      />
      <RenewalCard
        title="Lease Renewals"
        subtitle="Lease and agreement renewal dates"
        icon={<FileCheck2 size={17}/>}
        tone="violet"
        rows={renewalData.leases.map(r => ({...r, status: renewalStatus(r.date)}))}
        columns={['Building','Unit','Owner','Renewal date']}
        empty="No lease renewals scheduled."
        onView={() => onNavigate('agreements')}
      />
    </div>
  </div>
}

function renewalStatus(date:string) {
  const [day,month,year] = date.split('/').map(Number)
  const renewal = new Date(year, month - 1, day)
  const today = new Date(2026, 9, 8)
  const diff = Math.ceil((renewal.getTime() - today.getTime()) / 86400000)
  if (diff < 0) return 'Overdue'
  if (diff <= 60) return 'Due soon'
  return 'Upcoming'
}

function RenewalCard({
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

function Legend({label,value,tone}:{label:string;value:string;tone:string}){return <div className="legend-row"><span className={`dot ${tone}`}/><span>{label}</span><b>{value}</b></div>}
function Quick({icon,label,onClick}:{icon:React.ReactNode;label:string;onClick:()=>void}){return <button className="quick" onClick={onClick}><span>{icon}</span><b>{label}</b><ArrowRight size={14}/></button>}
function ActivityItem({icon,title,text,time}:{icon:React.ReactNode;title:string;text:string;time:string}){return <div className="activity-item"><span className="activity-icon">{icon}</span><div><b>{title}</b><p>{text}</p></div><time>{time}</time></div>}

function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) { return <div className="page-header"><div><div className="eyebrow">CITYOPS · MANAGEMENT</div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>{action}</div> }
function Toolbar({ query, setQuery, count = 25 }: { query: string; setQuery: (v:string)=>void; count?: number }) { return <div className="toolbar"><label>Show <select defaultValue={String(count)}><option>10</option><option>25</option><option>50</option><option>100</option></select> entries</label><div className="search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search records..."/></div></div> }
function TableWrap({ children }: { children: React.ReactNode }) { return <div className="table-scroll"><table>{children}</table></div> }
function TableHead({children}:{children:React.ReactNode}){return <thead><tr>{children}</tr></thead>}
function Th({children}:{children:React.ReactNode}){return <th>{children}<span>↕</span></th>}
function Pagination({ total=2 }: { total?: number }) { return <div className="pagination"><span>Showing 1 to {total} of {total} entries</span><div><button>Previous</button><button className="current">1</button><button>Next</button></div></div> }
function Status({children='Active'}:{children?:React.ReactNode}){return <span className="status"><i/>{children}</span>}

function InvestorsPage({query,setQuery,onCreate}:{query:string;setQuery:(v:string)=>void;onCreate:()=>void}) { return <div className="page-stack"><PageHeader title="Investors & Owners" subtitle="Manage property owners, investors and their portfolio relationships." action={<button className="primary-btn" onClick={onCreate}><Plus size={17}/> Create new</button>}/><div className="panel"><Toolbar query={query} setQuery={setQuery}/><TableWrap><TableHead><Th>Investor</Th><Th>Type</Th><Th>City</Th><Th>Phone</Th><Th>Buildings</Th><Th>Status</Th><Th>Actions</Th></TableHead><tbody>{investors.map(r=><tr key={r.id}><td><b className="link">{r.id}</b><small className="cell-sub">{r.name}</small></td><td>{r.type}</td><td>{r.city}</td><td>{r.phone}</td><td><span className="pill">{r.buildings} properties</span></td><td><Status/></td><td><RowActions/></td></tr>)}</tbody></TableWrap><Pagination total={2}/></div></div> }
function RowActions(){return <div className="row-actions"><button title="View"><Eye size={15}/></button><button title="Edit"><Pencil size={15}/></button><button title="More"><MoreHorizontal size={15}/></button></div>}

function AgreementsPage({onDraft}:{onDraft:(name:string)=>void}) {return <div className="page-stack"><PageHeader title="Contract Agreements" subtitle="Create, maintain and generate agreement templates." action={<button className="secondary-btn"><Download size={16}/> Export</button>}/><div className="panel"><Toolbar query="" setQuery={()=>{}}/><TableWrap><TableHead><Th>Agreement type</Th><Th>Template status</Th><Th>Last updated</Th><Th>Actions</Th></TableHead><tbody>{['Building Agreement','Tenant Agreement'].map((name,i)=><tr key={name}><td><div className="table-title"><span className="doc-icon"><FileText size={16}/></span><div><b>{name}</b><small>{i===0?'Property tenancy master agreement':'Tenant lease agreement'}</small></div></div></td><td><span className="badge green">Draft template</span></td><td>05 Oct 2026</td><td><button className="template-btn" onClick={()=>onDraft(name)}><Pencil size={14}/> Draft Template</button></td></tr>)}</tbody></TableWrap><Pagination total={2}/></div></div>}

function AgreementEditor({name,onBack}:{name:string;onBack:()=>void}) {const tags=['[OrganizationName]','[TenantName]','[OwnerName]','[ContractStartDate]','[ContractEndDate]','[ContractYear]','[ContractMonth]','[ContractDays]','[MonthlyRent]','[SecurityDeposit]','[W&E_Deposit]','[MaintenanceDeposit]','[Miscellaneous]','[Others]','[CurrentDate]']; const [content,setContent]=useState(`AGREEMENT\n\nParty 1: [OrganizationName]\nParty 2: [OwnerName]\n\nSubject: Agreement of tenancy contract between [OrganizationName] and [OwnerName] as per the details provided below.\n\nContract start date: [ContractStartDate]\nContract end date: [ContractEndDate]\n\nContract term:\nYear: [ContractYear]\nMonth: [ContractMonth]\nDays: [ContractDays]\n\nDeposit Type:\nMonthly Rent amount: [MonthlyRent]\nSecurity Deposit: [SecurityDeposit]\nW&E Deposit: [W&E_Deposit]\nMaintenance Deposit: [MaintenanceDeposit]\nMiscellaneous: [Miscellaneous]\nOthers: [Others]\n\nThis is a tenancy contract obliged by both the parties.\n\nName: [OrganizationName]                         Name: [OwnerName]\nDate: [CurrentDate]                              Date: [CurrentDate]\nSignature:                                      Signature:`); return <div className="page-stack"><div className="editor-top"><button className="back-btn" onClick={onBack}><ArrowLeft size={16}/> Back to agreements</button><div><span className="badge blue">Draft</span><b>{name}</b></div><button className="primary-btn"><Check size={17}/> Save template</button></div><div className="editor-layout"><section className="panel editor-panel"><div className="editor-title"><div><div className="eyebrow">TEMPLATE BUILDER</div><h2>{name}</h2></div><select className="select-lg" value={name} onChange={()=>{}}><option>{name}</option><option>Tenant Agreement</option><option>Building Agreement</option></select></div><div className="editor-toolbar"><button><b>B</b></button><button><u>U</u></button><button><i>I</i></button><span/><button>• List</button><button>1. List</button><button>≡ Align</button><button>↗ Link</button><button>▦ Table</button></div><textarea className="agreement-editor" value={content} onChange={e=>setContent(e.target.value)}/><div className="editor-foot"><span><Check size={14}/> Autosaved just now</span><span>{content.length} characters</span></div></section><aside className="panel tag-panel"><div className="tag-header"><div><h2>Agreement Tags</h2><p>Click a tag to insert it into the template.</p></div><Sparkles size={18}/></div><div className="tag-list">{tags.map(tag=><button key={tag} onClick={()=>setContent(c=>c+' '+tag)}>{tag}<Plus size={13}/></button>)}</div><div className="tip"><Sparkles size={16}/><div><b>Smart placeholders</b><p>Tags are replaced automatically when an agreement is generated.</p></div></div></aside></div></div>}

function BuildingsPage({query,setQuery,onCreate,onEdit}:{query:string;setQuery:(v:string)=>void;onCreate:()=>void;onEdit:()=>void}){return <div className="page-stack"><PageHeader title="Manage Buildings" subtitle="Keep your buildings, units and property details organized." action={<button className="primary-btn" onClick={onCreate}><Plus size={17}/> Create new</button>}/><div className="panel"><Toolbar query={query} setQuery={setQuery}/><TableWrap><TableHead><Th>Building</Th><Th>Building name</Th><Th>Category</Th><Th>Address</Th><Th>Floors</Th><Th>Units</Th><Th>Status</Th><Th>Actions</Th></TableHead><tbody>{buildings.map(b=><tr key={b.code}><td><button className="link" onClick={onEdit}>{b.code}</button></td><td><b>{b.name}</b><small className="cell-sub">{b.type}</small></td><td>{b.category || '—'}<small className="cell-sub">{b.categoryName || '—'}</small></td><td>{b.address || '—'}</td><td>{b.floors}</td><td><span className="pill">{b.units} total · {b.available} open</span></td><td><Status/></td><td><button className="edit-btn" onClick={onEdit}><Pencil size={14}/> Edit</button></td></tr>)}</tbody></TableWrap><Pagination total={2}/></div></div>}

function BuildingForm({onBack}:{onBack:()=>void}){const [tab,setTab]=useState('Building'); return <div className="page-stack"><div className="editor-top"><button className="back-btn" onClick={onBack}><ArrowLeft size={16}/> Back to buildings</button><div><span className="badge violet">Property</span><b>Create building</b></div><div className="inline-actions"><button className="secondary-btn" onClick={onBack}>Cancel</button><button className="primary-btn"><Check size={17}/> Save building</button></div></div><div className="tabs"><button className={tab==='Building'?'active':''} onClick={()=>setTab('Building')}>Building</button><button className={tab==='Floor Plan'?'active':''} onClick={()=>setTab('Floor Plan')}>Floor Plan</button></div>{tab==='Building'?<div className="form-stack"><FormCard title="Building information" icon={<Building2/>}><div className="form-grid three"><Field label="Organization" required type="select" value="Axiom"/><Field label="Building Name" required/><Field label="Building Type" required type="select" placeholder="Select"/><Field label="Category" type="select" placeholder="Select"/><Field label="Category Name"/><Field label="Status" type="select" value="Active"/><Field label="Electricity / W" required type="select" placeholder="Select"/><Field label="Paid By" required type="select" placeholder="Select"/><Field label="Number of Floors" type="number" value="0"/><Field label="Electricity Number"/><Field label="Water Number"/><Field label="Comments" textarea wide/></div></FormCard><FormCard title="Address" icon={<Landmark/>}><div className="form-grid three"><Field label="Building Number"/><Field label="Zone Number"/><Field label="Street Number"/><Field label="Address Line 1"/><Field label="Address Line 2"/><Field label="City"/><Field label="Country" type="select" value="Qatar"/><Field label="Latitude"/><Field label="Longitude"/></div></FormCard><FormCard title="Construction" icon={<Home/>}><div className="form-grid three"><Field label="Zone"/><Field label="Block"/><Field label="Site"/><Field label="Total Area" suffix="Sq.Ft"/><Field label="Constructed Area" suffix="Sq.Ft"/></div><div className="amenities"><b>Amenities</b><div>{['Indoor Gym','Outdoor Gym','Swimming Pool','Independent Supermarket','Private Parking','Guest Parking','Park/Courtyard','Kids Play Area','Jogging Track','Tennis Court','Basketball Court','Free Wi-Fi','Elevators/Lifts','Conference Room'].map(x=><label key={x}><input type="checkbox"/>{x}</label>)}</div></div></FormCard><FormCard title="Value" icon={<CircleDollarSign/>}><div className="form-grid three"><Field label="Current Building Value"/><Field label="Currency" type="select" value="QAR"/><Field label="As of Date" type="date"/></div></FormCard><FormCard title="Building documents" icon={<FileText/>}><div className="upload-grid"><Field label="Type" type="select" placeholder="Please select"/><Field label="Title"/><div className="dropzone"><CloudUpload size={30}/><b>Drag & drop files here</b><span>or click to browse</span></div></div><div className="document-empty"><Table2 size={17}/> No documents attached to this building</div></FormCard></div>:<FloorPlan/>}</div>}
function FormCard({title,icon,children}:{title:string;icon:React.ReactNode;children:React.ReactNode}){return <section className="form-card"><div className="form-card-head"><span>{icon}</span><div><h2>{title}</h2><p>Enter and maintain accurate property information.</p></div></div>{children}</section>}
function Field({label,required,type='text',value,placeholder,textarea,suffix,wide}:{label:string;required?:boolean;type?:string;value?:string;placeholder?:string;textarea?:boolean;suffix?:string;wide?:boolean}){return <label className={`field-wrap ${wide?'wide':''}`}><span>{required&&<em>*</em>}{label}</span>{textarea?<textarea placeholder={placeholder}/> : type==='select'?<select defaultValue={value||''}><option value="">{placeholder||'Select'}</option>{value&&<option value={value}>{value}</option>}<option>Residential</option><option>Commercial</option><option>Owner</option></select>:<div className="input-suffix"><input type={type} defaultValue={value} placeholder={placeholder}/>{suffix&&<b>{suffix}</b>}</div>}</label>}
function FloorPlan(){return <div className="panel floor-plan"><div className="empty-illustration"><Building2 size={42}/><h2>Floor plan workspace</h2><p>Add floors, units and layouts after saving the building.</p><button className="secondary-btn"><Plus size={16}/> Add floor</button></div></div>}

function SimpleBuildingTable({title,rows,query,setQuery,compact}:{title:string;rows:any[];query:string;setQuery:(v:string)=>void;compact?:boolean}){return <div className="page-stack"><PageHeader title={title} subtitle={compact?'Review building-related transactions and operational records.':'View the current tenant and property relationship data.'} action={<button className="secondary-btn"><Download size={16}/> Export</button>}/><div className="panel"><Toolbar query={query} setQuery={setQuery}/><TableWrap><TableHead><Th>Building</Th><Th>Building name</Th><Th>Building type</Th><Th>Category</Th><Th>Category name</Th><Th>Address</Th><Th>Latitude</Th><Th>Longitude</Th><Th>Status</Th><Th>Electricity</Th><Th>Water</Th></TableHead><tbody>{rows.map(r=><tr key={r.code}><td><span className="link">{r.code}</span></td><td><b>{r.building}</b></td><td>{r.type}</td><td>{r.category||'—'}</td><td>—</td><td>{r.address||'—'}</td><td>{r.lat||'—'}</td><td>{r.lng||'—'}</td><td><Status/></td><td>{r.electricity||'—'}</td><td>{r.water||'—'}</td></tr>)}</tbody></TableWrap><Pagination total={2}/></div></div>}

function SourcesPage({onEdit,onAdd}:{onEdit:(r:any)=>void;onAdd:()=>void}){return <div className="page-stack"><PageHeader title="Credit / Debit Sources" subtitle="Configure the transaction sources used throughout financial records." action={<button className="primary-btn" onClick={onAdd}><Plus size={17}/> Add source</button>}/><div className="panel"><Toolbar query="" setQuery={()=>{}}/><TableWrap><TableHead><Th>Item code</Th><Th>Description</Th><Th>Status</Th><Th>Date</Th><Th>Actions</Th></TableHead><tbody>{sourceRows.map(r=><tr key={r.code}><td><b>{r.code}</b></td><td>{r.description}</td><td><select className="inline-select" defaultValue={r.status}><option>Active</option><option>Inactive</option></select></td><td>{r.date}</td><td><button className="edit-btn" onClick={()=>onEdit(r)}><Pencil size={14}/> Edit</button></td></tr>)}</tbody></TableWrap><Pagination total={5}/></div></div>}
function SourceModal({value,onClose,onSave}:{value:any;onClose:()=>void;onSave:()=>void}){return <div className="modal-backdrop"><div className="modal"><div className="modal-head"><div><span className="eyebrow">FINANCIAL MASTER</span><h2>{value.code==='NEW'?'Add source':'Update source'}</h2></div><button onClick={onClose}><X/></button></div><div className="modal-body"><Field label="Description" value={value.description} textarea/><Field label="Status" type="select" value={value.status}/></div><div className="modal-foot"><button className="secondary-btn" onClick={onClose}>Close</button><button className="primary-btn" onClick={onSave}><Check size={16}/> Save</button></div></div></div>}
function ConfirmModal({onClose}:{onClose:()=>void}){return <div className="modal-backdrop"><div className="modal small"><div className="modal-head"><h2>Delete record?</h2><button onClick={onClose}><X/></button></div><div className="modal-body"><p>This action cannot be undone. Please confirm that you want to continue.</p></div><div className="modal-foot"><button className="secondary-btn" onClick={onClose}>Cancel</button><button className="danger-btn">Delete</button></div></div></div>}

function BankDetailsPage(){return <div className="page-stack"><PageHeader title="Bank Details" subtitle="Maintain bank accounts and settlement information."/><div className="form-stack"><FormCard title="Bank details" icon={<Landmark/>}><div className="form-grid three"><Field label="Organization" required type="select" value="Axiom"/><Field label="Account Number" required/><Field label="Account Name" required/><Field label="Account Type" required type="select" value="Current Account"/><Field label="IBAN Code"/><Field label="Swift Code"/><Field label="Bank Name" required/><Field label="Branch"/><Field label="Bank Code" value="BNK000003"/><Field label="IFSC Code"/><Field label="MICR Code"/><Field label="Address" textarea/><Field label="Country" type="select" value="Qatar"/><Field label="Contact Name"/><Field label="Contact Number"/><Field label="Contact Email"/></div></FormCard><div className="inline-actions bottom-actions"><button className="secondary-btn">Cancel</button><button className="primary-btn"><Check size={16}/> Save</button><button className="secondary-btn">Return</button></div></div></div>}
function FinancialPage(){return <div className="page-stack"><PageHeader title="Financial" subtitle="Track monthly receipts, payments and account balances."/><div className="panel"><div className="filters"><Field label="Organization" type="select" value="Axiom"/><Field label="Year" type="select" value="2026"/><Field label="Month" type="select" value="October"/><Field label="Payment Method" type="select" placeholder="— Select —"/><Field label="Bank Details" type="select" placeholder="— Select All —"/><button className="primary-btn export-btn"><Download size={16}/> Export</button></div><TableWrap><TableHead><Th>Source</Th><Th>Description</Th><Th>Post/Pay by</Th><Th>Amount</Th><Th>DB / CR</Th><Th>Currency</Th><Th>Bank details</Th></TableHead><tbody><tr><td colSpan={3} className="total-label">Total Balance</td><td><b>0.00</b></td><td>—</td><td>QAR</td><td>—</td></tr></tbody></TableWrap></div></div>}
function AvailablePage(){return <ReportTable title="Available Buildings" subtitle="A live view of units available across the portfolio." headers={['Name','Building Code','Total Floors','Total Units','Available Units','Unit Numbers']} rows={[['South End','BLD000001','2','4','1','G1'],['West End','BLD000002','0','0','0','—']]} />}
function BuildingCostPage(){return <div className="page-stack"><PageHeader title="Building Total Cost" subtitle="Generate cost summaries by category and building."/><div className="panel"><div className="report-filters"><Field label="Category" type="select" placeholder="— Please Select —"/><Field label="Building" type="select" placeholder="— Please Select —"/><button className="primary-btn"><RefreshCw size={16}/> Generate</button></div><div className="report-divider"/><div className="report-actions"><button className="secondary-btn"><Download size={16}/> Export</button></div><TableWrap><TableHead><Th>Name</Th><Th>Lease Amount</Th><Th>Rent Amount</Th><Th>Owner Name</Th></TableHead><tbody><tr><td colSpan={4} className="empty-row">Select filters and generate the report.</td></tr></tbody></TableWrap></div></div>}
function ReportTable({title,subtitle,headers,rows}:{title:string;subtitle:string;headers:string[];rows:string[][]}){return <div className="page-stack"><PageHeader title={title} subtitle={subtitle} action={<button className="secondary-btn"><Download size={16}/> Export</button>}/><div className="panel"><TableWrap><TableHead>{headers.map(h=><Th key={h}>{h}</Th>)}</TableHead><tbody>{rows.map((r,i)=><tr key={i}>{r.map((x,j)=><td key={j}>{j===0?<b>{x}</b>:x}</td>)}</tr>)}</tbody></TableWrap></div></div>}
function OwnersPage(){return <FilterReport title="Owner's Buildings" filter="Owner" headers={['Name','Building Code','Total Floors','Total Units','Available Units','Unit Numbers']} rows={[['South End','BLD000001','2','4','0','—'],['West End','BLD000002','0','0','0','—']]} />}
function InvestmentsPage(){return <FilterReport title="Investment Buildings" filter="Investor" headers={['Building Name','Date','Investment Amount','Settlement','Investor Name']} rows={[['South End','11/12/2023','535','—','Suleman'],['South End','11/12/2023','7,878','—','Suleman']]} />}
function FilterReport({title,filter,headers,rows}:{title:string;filter:string;headers:string[];rows:string[][]}){return <div className="page-stack"><PageHeader title={title} subtitle="Filter and export portfolio ownership and investment information."/><div className="panel"><div className="single-filter"><Field label={filter} type="select" placeholder="Select"/><button className="secondary-btn"><Download size={16}/> Export</button></div><TableWrap><TableHead>{headers.map(h=><Th key={h}>{h}</Th>)}</TableHead><tbody>{rows.map((r,i)=><tr key={i}>{r.map((x,j)=><td key={j}>{j===0?<b>{x}</b>:x}</td>)}</tr>)}</tbody></TableWrap></div></div>}

function AppRouter(){return <App/>}

createRoot(document.getElementById('root')!).render(<React.StrictMode><AppRouter/></React.StrictMode>)
