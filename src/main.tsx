import React, { useEffect, useMemo, useState, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { Bell, Building2, ChevronDown, ChevronRight, LayoutDashboard, Menu, Settings, Users, ReceiptText, WalletCards, BarChart3, Zap, LogOut, LockKeyhole } from 'lucide-react'
import './styles.css'
import { Page, NavGroup, Investor } from './types'
import { PageLoader } from './shared'
import { apiRequest, listResource } from './lib/api'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const InvestorsPage = lazy(() => import('./pages/InvestorsPage'))
const InvestorForm = lazy(() => import('./pages/InvestorForm'))
const AgreementsPage = lazy(() => import('./pages/AgreementsPage'))
const AgreementEditor = lazy(() => import('./pages/AgreementEditor'))
const BuildingsPage = lazy(() => import('./pages/BuildingsPage'))
const BuildingForm = lazy(() => import('./pages/BuildingForm'))
const InvestorRelationPage = lazy(() => import('./pages/InvestorRelationPage'))
const TenantsPage = lazy(() => import('./pages/TenantsPage'))
const BuildingRentsPage = lazy(() => import('./pages/BuildingRentsPage'))
const BuildingExpensesPage = lazy(() => import('./pages/BuildingExpensesPage'))
const SourcesPage = lazy(() => import('./pages/SourcesPage').then(m => ({ default: m.SourcesPage })))
const SourceModal = lazy(() => import('./pages/SourcesPage').then(m => ({ default: m.SourceModal })))
const ConfirmModal = lazy(() => import('./pages/SourcesPage').then(m => ({ default: m.ConfirmModal })))
const BankDetailsPage = lazy(() => import('./pages/BankDetailsPage'))
const FinancialPage = lazy(() => import('./pages/FinancialPage'))
const AvailablePage = lazy(() => import('./pages/AvailableBuildingsPage'))
const BuildingCostPage = lazy(() => import('./pages/BuildingCostPage'))
const OwnersPage = lazy(() => import('./pages/OwnersPage'))
const InvestmentsPage = lazy(() => import('./pages/InvestmentsPage'))

const BASE='/ops-city'
const routeMap:Record<Page,string>={dashboard:'/',investors:'/investors','investor-form':'/investors/new',agreements:'/agreements','agreement-editor':'/agreements/editor',buildings:'/buildings','building-form':'/buildings/new','investor-relation':'/investor-relation',tenants:'/tenants','building-rents':'/building-rents','building-expenses':'/building-expenses',sources:'/sources',banks:'/banks',financial:'/financial',available:'/reports/available-buildings','building-cost':'/reports/building-cost',owners:'/reports/owners',investments:'/reports/investments'}
function pathToPage(path:string):Page{const clean=(path.replace(/\/$/,'')||'/');const entry=Object.entries(routeMap).find(([,v])=>v===clean);return (entry?.[0] as Page)||'dashboard'}
function currentPage(){const pathname=window.location.pathname;const relative=pathname.startsWith(BASE)?pathname.slice(BASE.length)||'/':pathname; if(relative==='/investors/new'||relative.startsWith('/investors/edit/')) return 'investor-form'; return pathToPage(relative)}
function currentInvestorId(){const pathname=window.location.pathname;const prefix=`${BASE}/investors/edit/`;return pathname.startsWith(prefix)?decodeURIComponent(pathname.slice(prefix.length)):''}
function pagePath(page:Page){return `${BASE}${routeMap[page]==='/'?'/':routeMap[page]}`}


type AuthUser = { id:number|string; email:string; username:string; name:string; role:string }
const TOKEN_KEY = 'cityops_token'
const USER_KEY = 'cityops_user'

function LoginPage({ onLogin }: { onLogin:(token:string,user:AuthUser)=>void }) {
 const [identity,setIdentity]=useState('')
 const [password,setPassword]=useState('')
 const [loading,setLoading]=useState(false)
 const [error,setError]=useState('')
 const submit=async(e:React.FormEvent)=>{e.preventDefault();setError('');setLoading(true);try{
   const result=await apiRequest<{token:string;user:AuthUser}>('/auth/login',{method:'POST',body:JSON.stringify({email:identity,password})})
   onLogin(result.token,result.user)
 }catch(err){setError(err instanceof Error?err.message:'Unable to sign in. Check your connection and try again.')}finally{setLoading(false)}}
 return <div className="login-screen"><div className="login-visual"><div className="login-brand"><span className="login-brand-icon"><Building2 size={24}/></span><span><b>CITYOPS</b><small>PROPERTY MANAGEMENT</small></span></div><div className="login-hero"><span className="login-kicker">PROPERTY OPERATIONS PLATFORM</span><h1>Every property.<br/><em>One clear view.</em></h1><p>Manage buildings, tenants, agreements and financial operations in one secure workspace.</p><div className="login-feature"><span><Building2 size={17}/></span><div><b>Property operations</b><small>Keep your portfolio organized</small></div></div><div className="login-feature"><span><LockKeyhole size={17}/></span><div><b>Secure access</b><small>Sign in with your CityOps account</small></div></div></div><div className="login-footer">CITYOPS · PROPERTY MANAGEMENT SUITE</div></div><div className="login-form-side"><form className="login-card" onSubmit={submit}><div className="login-mobile-brand"><span className="login-brand-icon"><Building2 size={22}/></span><b>CITYOPS</b></div><div className="login-overline">WELCOME BACK</div><h2>Sign in to CityOps</h2><p className="login-intro">Enter your account details to continue.</p>{error&&<div className="login-error" role="alert">{error}</div>}<label className="login-label">Email or username<input autoFocus autoComplete="username" value={identity} onChange={e=>setIdentity(e.target.value)} placeholder="Enter email or username" required/></label><label className="login-label">Password<input type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password" required/></label><button className="login-submit" disabled={loading}>{loading?'Signing in…':'Sign in'}<ChevronRight size={17}/></button><div className="login-secure"><LockKeyhole size={13}/> Your session is protected with secure authentication.</div></form><div className="login-copyright">© 2026 CityOps. All rights reserved.</div></div></div>
}

function AppGate(){
 const [token,setToken]=useState(()=>localStorage.getItem(TOKEN_KEY)||'')
 const [user,setUser]=useState<AuthUser|null>(()=>{try{return JSON.parse(localStorage.getItem(USER_KEY)||'null')}catch{return null}})
 const login=(nextToken:string,nextUser:AuthUser)=>{localStorage.setItem(TOKEN_KEY,nextToken);localStorage.setItem(USER_KEY,JSON.stringify(nextUser));setToken(nextToken);setUser(nextUser)}
 const logout=()=>{localStorage.removeItem(TOKEN_KEY);localStorage.removeItem(USER_KEY);setToken('');setUser(null);window.history.replaceState({},'',`${BASE}/login`)}
 if(!token)return <LoginPage onLogin={login}/>
 return <App currentUser={user} onLogout={logout}/>
}

function App({currentUser,onLogout}:{currentUser:AuthUser|null;onLogout:()=>void}){
 const [page,setPage]=useState<Page>(currentPage); const [investorRows,setInvestorRows]=useState<Investor[]>([]); const [selectedInvestorId,setSelectedInvestorId]=useState(currentInvestorId()); const [collapsed,setCollapsed]=useState(false); const [mobileOpen,setMobileOpen]=useState(false); const [open,setOpen]=useState<Record<NavGroup,boolean>>({assets:true,tenant:false,expenses:false,financials:false,reports:false}); const [query,setQuery]=useState(''); const [selectedAgreement,setSelectedAgreement]=useState('Building Agreement'); const [modal,setModal]=useState<'source'|'delete'|null>(null); const [editingSource,setEditingSource]=useState({code:'NEW',description:'',status:'Active',date:'05-10-2026'})
 useEffect(()=>{const onPop=()=>{setPage(currentPage());setSelectedInvestorId(currentInvestorId())};window.addEventListener('popstate',onPop);return()=>window.removeEventListener('popstate',onPop)},[])
 useEffect(()=>{let alive=true;(async()=>{try{const data=await listResource('investors');if(alive)setInvestorRows(data.map((i:any)=>({id:i.InvesterID||i.id||'',name:i.Name||i.InvesterName||'',type:i.Type||'Investor',address1:i.Address1||'',address2:i.Address2||'',city:i.City||'',phone:i.Phone||'',buildings:0,status:i.Status||'Active'})))}catch(e){console.error('Failed to load investors:',e)}})();return()=>{alive=false}},[])
 const navigate=(next:Page)=>{const nextPath=pagePath(next);if(window.location.pathname!==nextPath)window.history.pushState({page:next},'',nextPath);setPage(next);setQuery('');setMobileOpen(false)}
 const nav=(p:Page)=>()=>navigate(p); const openInvestorForm=(id?:string)=>{const path=id?`${BASE}/investors/edit/${encodeURIComponent(id)}`:`${BASE}/investors/new`; if(window.location.pathname!==path) window.history.pushState({page:'investor-form',id},'',path); setSelectedInvestorId(id||''); setPage('investor-form'); setQuery(''); setMobileOpen(false)}; const toggle=(key:NavGroup)=>setOpen(v=>({...v,[key]:!v[key]}))
 const title=useMemo(()=>({dashboard:'Dashboard',investors:'Investors & Owners','investor-form':selectedInvestorId?'Edit Investor / Owner':'Create Investor / Owner',agreements:'Contract Agreements','agreement-editor':'Agreement Template',buildings:'Manage Buildings','building-form':'Building Details','investor-relation':'Investor Relation',tenants:'Tenants and Rentals','building-rents':'Building Rents','building-expenses':'Building Expense',sources:'Credit / Debit Sources',banks:'Bank Details',financial:'Financial',available:'Available Buildings','building-cost':'Building Total Cost',owners:"Owner's Buildings",investments:"Investor's Investment"} as Record<Page,string>)[page],[page])
 return <div className="app-shell"><Sidebar collapsed={collapsed} mobileOpen={mobileOpen} open={open} toggle={toggle} page={page} nav={nav}/>{mobileOpen&&<div className="sidebar-backdrop" onClick={()=>setMobileOpen(false)}/>}<div className={`main-shell ${collapsed?'sidebar-collapsed':''}`}><header className="topbar"><div className="topbar-left"><button className="icon-button" onClick={()=>{if(window.matchMedia('(max-width:760px)').matches)setMobileOpen(v=>!v);else setCollapsed(v=>!v)}}><Menu size={21}/></button><div className="breadcrumb"><span>CityOps</span><ChevronRight size={14}/><strong>{title}</strong></div></div><div className="top-actions"><button className="icon-button notification"><Bell size={18}/><span/></button><button className="icon-button"><Settings size={18}/></button><div className="user-chip"><div className="avatar">{(currentUser?.name||currentUser?.username||'U').split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase()}</div><div className="user-chip-text"><b>{currentUser?.name||currentUser?.username||'User'}</b><small>{currentUser?.role||'User'}</small></div><button className="logout-button" onClick={onLogout} title="Sign out" aria-label="Sign out"><LogOut size={16}/><span>Logout</span></button></div></div></header><main className="content">
 <Suspense fallback={<PageLoader/>}>
 {page==='dashboard'&&<Dashboard onNavigate={navigate}/>} {page==='investors'&&<InvestorsPage query={query} setQuery={setQuery} rows={investorRows} onCreate={()=>openInvestorForm()} onEdit={openInvestorForm}/>} {page==='investor-form'&&<InvestorForm value={investorRows.find(r=>r.id===selectedInvestorId)} onBack={nav('investors')} onSave={r=>{setInvestorRows(prev=>{const exists=prev.some(x=>x.id===r.id); return exists?prev.map(x=>x.id===r.id?r:x):[...prev,r]}); navigate('investors')}}/>} {page==='agreements'&&<AgreementsPage onDraft={name=>{setSelectedAgreement(name);navigate('agreement-editor')}}/>} {page==='agreement-editor'&&<AgreementEditor name={selectedAgreement} onBack={nav('agreements')}/>} {page==='buildings'&&<BuildingsPage query={query} setQuery={setQuery} onCreate={()=>navigate('building-form')} onEdit={()=>navigate('building-form')}/>} {page==='building-form'&&<BuildingForm onBack={nav('buildings')}/>} {page==='investor-relation'&&<InvestorRelationPage query={query} setQuery={setQuery}/>} {page==='tenants'&&<TenantsPage query={query} setQuery={setQuery}/>} {page==='building-rents'&&<BuildingRentsPage query={query} setQuery={setQuery}/>} {page==='building-expenses'&&<BuildingExpensesPage query={query} setQuery={setQuery}/>} {page==='sources'&&<SourcesPage onEdit={r=>{setEditingSource(r);setModal('source')}} onAdd={()=>{setEditingSource({code:'NEW',description:'',status:'Active',date:'05-10-2026'});setModal('source')}}/>} {page==='banks'&&<BankDetailsPage/>} {page==='financial'&&<FinancialPage/>} {page==='available'&&<AvailablePage/>} {page==='building-cost'&&<BuildingCostPage/>} {page==='owners'&&<OwnersPage/>} {page==='investments'&&<InvestmentsPage/>}
 </Suspense>
 </main><footer>© 2026 CityOps · Property Management Suite</footer></div>{modal==='source'&&<Suspense fallback={null}><SourceModal value={editingSource} onClose={()=>setModal(null)} onSave={()=>setModal(null)}/></Suspense>} {modal==='delete'&&<Suspense fallback={null}><ConfirmModal onClose={()=>setModal(null)}/></Suspense>}<button className="support-fab"><Zap size={17}/></button></div>
}

function Sidebar({collapsed,mobileOpen,open,toggle,page,nav}:{collapsed:boolean;mobileOpen:boolean;open:Record<NavGroup,boolean>;toggle:(k:NavGroup)=>void;page:Page;nav:(p:Page)=>()=>void}){const group=(key:NavGroup,label:string,icon:React.ReactNode,items:[string,Page][])=> <div className="nav-group"><button className={`nav-row ${items.some(([,p])=>p===page)?'group-active':''}`} onClick={()=>toggle(key)}><span className="nav-main"><span className="nav-icon">{icon}</span>{!collapsed&&<span>{label}</span>}</span>{!collapsed&&(open[key]?<ChevronDown size={15}/>:<ChevronRight size={15}/>)}</button>{!collapsed&&open[key]&&<div className="subnav">{items.map(([label,p])=><button key={p} onClick={nav(p)} className={`subnav-row ${page===p?'active':''}`}>{label}</button>)}</div>}</div>;return <aside className={`sidebar ${collapsed?'collapsed':''} ${mobileOpen?'mobile-open':''}`}><div className="brand"><div className="brand-mark"><Building2 size={21}/></div>{!collapsed&&<div><div className="brand-name">CITYOPS</div><div className="brand-sub">PROPERTY MANAGEMENT</div></div>}</div>{!collapsed&&<div className="profile"><div className="profile-avatar">AK<span/></div><div><b>Athauallah Khan</b><small>Administrator</small></div></div>}<nav className="sidebar-nav"><button className={`nav-row ${page==='dashboard'?'active':''}`} onClick={nav('dashboard')}><span className="nav-main"><span className="nav-icon"><LayoutDashboard size={18}/></span>{!collapsed&&<span>Dashboard</span>}</span>{!collapsed&&<ChevronRight size={15}/>}</button>{group('assets','Assets',<Building2 size={18}/>,[['Investors & Owners','investors'],['Contract Agreements','agreements'],['Manage Building','buildings'],['Investor Relation','investor-relation']])}{group('tenant','Tenant Maintenance',<Users size={18}/>,[['Tenants & Rentals','tenants']])}{group('expenses','Expenses',<ReceiptText size={18}/>,[['Building Rents','building-rents'],['Building Expense','building-expenses']])}{group('financials','Financials',<WalletCards size={18}/>,[['Credit/Debit Sources','sources'],['Bank Details','banks'],['Financial','financial']])}{group('reports','Reports',<BarChart3 size={18}/>,[['Available Building','available'],['Building Total Cost','building-cost'],["Owner's Building",'owners'],["Investor's Investment",'investments']])}</nav>{!collapsed}</aside>}

createRoot(document.getElementById('root')!).render(<React.StrictMode><AppGate/></React.StrictMode>)
