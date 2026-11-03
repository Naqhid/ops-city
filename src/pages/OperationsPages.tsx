import React, { useState, useEffect } from 'react'
import { Activity, ArrowLeft, ArrowRight, ArrowUpRight, Banknote, BarChart3, Bell, Building2, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, CircleDollarSign, ClipboardList, CloudUpload, Download, Edit3, Eye, FileCheck2, FileText, Filter, Home, Landmark, LayoutDashboard, Menu, MoreHorizontal, Pencil, Plus, ReceiptText, RefreshCw, Search, Settings, Sparkles, Table2, Trash2, TrendingUp, Upload, UserRound, Users, Wallet, WalletCards, Wrench, X, Zap } from 'lucide-react'
import { Page } from '../types'
import { listResource } from '../lib/api'
import { PageHeader, Toolbar, TableWrap, TableHead, Th, Pagination, Status } from '../shared'

export function SimpleBuildingTable({title,rows,query,setQuery,compact}:{title:string;rows:any[];query:string;setQuery:(v:string)=>void;compact?:boolean}){return <div className="page-stack"><PageHeader title={title} subtitle={compact?'Review building-related transactions and operational records.':'View the current tenant and property relationship data.'} action={<button className="secondary-btn"><Download size={16}/> Export</button>}/><div className="panel"><Toolbar query={query} setQuery={setQuery}/><TableWrap><TableHead><Th>Building</Th><Th>Building name</Th><Th>Building type</Th><Th>Category</Th><Th>Category name</Th><Th>Address</Th><Th>Latitude</Th><Th>Longitude</Th><Th>Status</Th><Th>Electricity</Th><Th>Water</Th></TableHead><tbody>{rows.map(r=><tr key={r.code}><td><span className="link">{r.code}</span></td><td><b>{r.building}</b></td><td>{r.type}</td><td>{r.category||'—'}</td><td>—</td><td>{r.address||'—'}</td><td>{r.lat||'—'}</td><td>{r.lng||'—'}</td><td><Status/></td><td>{r.electricity||'—'}</td><td>{r.water||'—'}</td></tr>)}</tbody></TableWrap><Pagination total={rows.length}/></div></div>}

export function OperationsPage() {
  const [buildings, setBuildings] = useState<any[]>([]);
  const [investors, setInvestors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [bData, iData] = await Promise.all([
          listResource('buildings'),
          listResource('investors')
        ]);
        if (!alive) return;
        setBuildings(bData.map((b: any) => ({
          code: b.BlCode || b.BuildingID || '',
          building: b.BuildingName || b.Name || '',
          type: b.BLType === 2 ? 'Commercial' : 'Residential',
          category: b.Category || '',
          address: [b.AddLine1, b.AddLine2, b.City, b.Country].filter(Boolean).join(', ') || '',
          lat: b.Latitude || '',
          lng: b.Longitude || '',
          electricity: b.ElectricityNumber || '',
          water: b.WaterNumber || ''
        })));
        setInvestors(iData.map((i: any) => ({
          id: i.InvesterID || i.id || '',
          name: i.Name || i.InvesterName || '',
          type: i.Type || 'Investor',
          address1: i.Address1 || '',
          address2: i.Address2 || '',
          city: i.City || '',
          phone: i.Phone || '',
          buildings: 0,
          status: i.Status || 'Active'
        })));
      } catch (e: any) {
        if (alive) setError(e.message || 'Failed to load data from API');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading operational data...</div>;
  if (error) return <div className="p-8 text-center text-rose-600">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <SimpleBuildingTable
        title="Buildings Overview"
        rows={buildings}
        query=""
        setQuery={() => {}}
        compact={true}
      />
      <SimpleBuildingTable
        title="Investors Overview"
        rows={investors.map(i => ({...i, code: i.id, building: i.name, type: i.type, category: '', address: i.address1, lat: '', lng: '', electricity: '', water: ''}))}
        query=""
        setQuery={() => {}}
        compact={true}
      />
    </div>
  );
}
