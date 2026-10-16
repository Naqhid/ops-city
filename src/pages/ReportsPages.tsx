import React, { useMemo, useState } from "react";

type Report = {
  id: string;
  name: string;
  description: string;
  category: "Financial" | "Property" | "Tenant" | "Operations";
  updated: string;
  format: "PDF" | "Excel" | "CSV";
  icon: string;
};

const reports: Report[] = [
  { id: "RPT-001", name: "Financial Summary", description: "Receipts, payments and account balances for a selected period.", category: "Financial", updated: "Monthly", format: "PDF", icon: "chart" },
  { id: "RPT-002", name: "Income & Expense", description: "Compare incoming payments with expenses across your properties.", category: "Financial", updated: "Monthly", format: "Excel", icon: "wallet" },
  { id: "RPT-003", name: "Bank Transactions", description: "Review account activity, payment methods and bank movements.", category: "Financial", updated: "Daily", format: "Excel", icon: "bank" },
  { id: "RPT-004", name: "Property Occupancy", description: "Occupancy, availability and property status at a glance.", category: "Property", updated: "Live data", format: "PDF", icon: "building" },
  { id: "RPT-005", name: "Property Register", description: "A structured overview of property records and key details.", category: "Property", updated: "Live data", format: "Excel", icon: "list" },
  { id: "RPT-006", name: "Tenant Directory", description: "Tenant records and contact information for internal review.", category: "Tenant", updated: "Live data", format: "Excel", icon: "users" },
  { id: "RPT-007", name: "Lease Expiry", description: "Track upcoming lease end dates and renewal follow-ups.", category: "Tenant", updated: "Monthly", format: "PDF", icon: "calendar" },
  { id: "RPT-008", name: "Maintenance Overview", description: "Monitor maintenance requests, status and outstanding work.", category: "Operations", updated: "Weekly", format: "CSV", icon: "tools" },
];

const iconPaths: Record<string, React.ReactNode> = {
  chart: <><path d="M4 19V5M4 19h17"/><path d="m7 15 4-4 3 2 5-6"/><path d="M16 7h3v3"/></>,
  wallet: <><rect x="3" y="6" width="18" height="15" rx="2"/><path d="M3 9h18M16 14h2"/><path d="M6 6V4h12"/></>,
  bank: <><path d="m3 9 9-6 9 6"/><path d="M5 10v8m4-8v8m6-8v8m4-8v8M3 21h18M3 18h18"/></>,
  building: <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h2m4 0h2M8 11h2m4 0h2M8 15h2m4 0h2M10 21v-3h4v3"/></>,
  list: <><path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6h.01M4 12h.01M4 18h.01"/></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M8 14h3"/></>,
  tools: <><path d="M14 7 7 14l-3-3 7-7a5 5 0 0 0 6 6l-7 7 3 3 7-7a5 5 0 0 0 1-6l-3 3z"/></>,
};

function Icon({ name, size = 21 }: { name: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{iconPaths[name] || iconPaths.list}</svg>;
}

export default function Reports() {
  const [category, setCategory] = useState("All reports");
  const [query, setQuery] = useState("");
  const [format, setFormat] = useState("All formats");
  const [selected, setSelected] = useState<string[]>([]);
  const [notice, setNotice] = useState("");

  const visible = useMemo(() => reports.filter(r =>
    (category === "All reports" || r.category === category) &&
    (format === "All formats" || r.format === format) &&
    (!query.trim() || `${r.name} ${r.description} ${r.category}`.toLowerCase().includes(query.trim().toLowerCase()))
  ), [category, format, query]);

  const categories = ["All reports", "Financial", "Property", "Tenant", "Operations"];

  function downloadReport(report: Report) {
    // Demo export: a small CSV index so the action works without a report API.
    const csv = ["Report ID,Report Name,Category,Description,Format", [report.id, report.name, report.category, report.description, report.format].map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")].join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a"); a.href = url; a.download = `${report.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.csv`; a.click(); URL.revokeObjectURL(url);
    setNotice(`${report.name}: demo export downloaded. Connect your report API for full report data.`);
  }

  return <main className="reports-page">
    <style>{`
      .reports-page{min-height:100%;box-sizing:border-box;padding:30px clamp(14px,2.2vw,34px) 38px;background:#f3f6fc;color:#172b4d;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}
      .rp-wrap{max-width:1600px;margin:0 auto}.rp-eyebrow{display:flex;align-items:center;gap:8px;color:#2864dc;font-size:10px;font-weight:850;letter-spacing:.18em;text-transform:uppercase}.rp-eyebrow:before{content:"";width:22px;height:2px;border-radius:4px;background:#3478f6}
      .rp-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:18px;margin:10px 0 25px}.rp-title{margin:0;font-size:clamp(28px,2.5vw,36px);line-height:1.12;letter-spacing:-.045em;font-weight:850;color:#142b50}.rp-subtitle{margin:9px 0 0;color:#7a8aa6;font-size:13px}.rp-head-actions{display:flex;gap:9px;flex-wrap:wrap}.rp-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:1px solid #dce6f5;border-radius:11px;padding:11px 15px;background:#fff;color:#456080;font-size:12px;font-weight:750;cursor:pointer;white-space:nowrap}.rp-btn.primary{border-color:transparent;background:linear-gradient(135deg,#3478f6,#215bd5);color:#fff;box-shadow:0 8px 18px #2d6ce52b}.rp-btn:hover{transform:translateY(-1px);filter:brightness(1.02)}
      .rp-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:15px;margin-bottom:22px}.rp-stat{display:flex;align-items:center;gap:14px;padding:18px;background:#fff;border:1px solid #e4eaf4;border-radius:17px;box-shadow:0 7px 24px #1c3f7508}.rp-stat-icon{width:43px;height:43px;display:grid;place-items:center;border-radius:13px;flex-shrink:0}.rp-stat-icon.blue{background:#edf4ff;color:#2d6ce8}.rp-stat-icon.green{background:#eaf8f1;color:#16976b}.rp-stat-icon.purple{background:#f2edff;color:#7652d7}.rp-stat-icon.orange{background:#fff4e7;color:#d88628}.rp-stat-label{font-size:10px;color:#8190a8;font-weight:750;letter-spacing:.04em}.rp-stat-value{font-size:23px;line-height:1.25;margin-top:4px;font-weight:850;letter-spacing:-.04em;color:#1b3154}.rp-stat-note{font-size:10px;color:#97a4b7;margin-top:3px}
      .rp-panel{background:#fff;border:1px solid #e3eaf5;border-radius:20px;box-shadow:0 8px 30px #1c3f7510;overflow:hidden}.rp-panel-head{padding:22px 24px 18px;border-bottom:1px solid #edf1f7;display:flex;align-items:center;justify-content:space-between;gap:16px}.rp-panel-head h2{font-size:15px;margin:0;font-weight:850;color:#1a3155}.rp-panel-head p{font-size:11px;color:#8b9ab1;margin:5px 0 0}.rp-count{font-size:11px;color:#6c7e9a;background:#f4f7fc;border:1px solid #e9eef7;padding:7px 10px;border-radius:9px;white-space:nowrap}
      .rp-toolbar{display:flex;justify-content:space-between;align-items:center;gap:15px;padding:17px 24px;border-bottom:1px solid #edf1f7}.rp-tabs{display:flex;align-items:center;gap:5px;flex-wrap:wrap}.rp-tab{border:1px solid transparent;background:transparent;color:#7b8ba4;font-size:11px;font-weight:750;padding:9px 12px;border-radius:9px;cursor:pointer}.rp-tab.active{background:#edf4ff;border-color:#dce9ff;color:#2864dc}.rp-tools{display:flex;align-items:center;gap:10px}.rp-select{height:39px;border:1px solid #dfe7f2;border-radius:10px;padding:0 10px;background:#fff;color:#465d7b;font-size:11px;outline:none}.rp-searchbox{position:relative;width:220px}.rp-searchbox:before{content:"⌕";position:absolute;left:12px;top:4px;color:#91a0b8;font-size:22px}.rp-search{box-sizing:border-box;width:100%;height:39px;border:1px solid #dfe7f2;border-radius:10px;padding:0 10px 0 34px;background:#fbfcff;color:#263d5e;font-size:11px;outline:none}
      .rp-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:15px;padding:22px 24px 24px}.rp-report{display:flex;flex-direction:column;min-width:0;padding:18px;border:1px solid #e5ebf4;border-radius:15px;background:linear-gradient(145deg,#fff,#fcfdff);transition:border-color .18s,box-shadow .18s,transform .18s}.rp-report:hover{border-color:#c9dafb;box-shadow:0 10px 24px #254b8510;transform:translateY(-2px)}.rp-report-top{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}.rp-report-icon{width:43px;height:43px;display:grid;place-items:center;background:#edf4ff;color:#2d6ce8;border-radius:13px}.rp-check{width:17px;height:17px;accent-color:#2864dc;cursor:pointer}.rp-report h3{font-size:13px;color:#203858;margin:17px 0 7px;font-weight:850}.rp-report p{font-size:11px;line-height:1.65;color:#8190a7;margin:0;min-height:38px}.rp-meta{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:17px}.rp-category{font-size:10px;color:#547095;background:#f1f5fb;border-radius:7px;padding:5px 8px;font-weight:750}.rp-format{font-size:10px;color:#16835e;font-weight:850}.rp-report-bottom{display:flex;justify-content:space-between;align-items:center;gap:10px;border-top:1px solid #edf1f7;margin-top:17px;padding-top:14px}.rp-updated{font-size:10px;color:#98a5b7}.rp-open{border:0;background:transparent;color:#2c68dc;font-size:11px;font-weight:800;cursor:pointer;padding:5px 0}.rp-open:hover{text-decoration:underline}.rp-empty{grid-column:1/-1;text-align:center;padding:48px 16px;color:#8594aa}.rp-empty strong{display:block;color:#3c5272;font-size:13px;margin-bottom:5px}.rp-empty span{font-size:11px}
      .rp-bulk{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 24px;background:#f6f9ff;border-top:1px solid #e7eef9}.rp-bulk span{font-size:11px;color:#617693}.rp-notice{margin:0 24px 20px;padding:11px 13px;background:#eff7ff;border:1px solid #d8e9ff;border-radius:10px;color:#2b5e9d;font-size:11px;line-height:1.5}.rp-footer{text-align:center;color:#9aa8bd;font-size:10px;padding:23px 0 0}
      .rp-search:focus,.rp-select:focus{border-color:#7ca6ff;box-shadow:0 0 0 3px #3478f61a}.rp-btn:focus-visible,.rp-tab:focus-visible,.rp-open:focus-visible{outline:3px solid #9bbcff;outline-offset:2px}
      @media(max-width:1100px){.rp-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.rp-toolbar{align-items:flex-start;flex-direction:column}.rp-tools{width:100%;justify-content:flex-end}}@media(max-width:760px){.rp-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.rp-heading{align-items:flex-start;flex-direction:column}.rp-grid{padding:16px;gap:12px}.rp-toolbar,.rp-panel-head{padding:16px}.rp-tools{flex-direction:column;align-items:stretch}.rp-searchbox{width:100%}.rp-select{width:100%}}@media(max-width:520px){.rp-grid{grid-template-columns:1fr}.rp-stat{padding:13px;gap:10px}.rp-stat-icon{width:37px;height:37px}.rp-stat-value{font-size:20px}.rp-head-actions{width:100%}.rp-head-actions .rp-btn{flex:1}.rp-tabs{width:100%}.rp-tab{padding:8px 9px}.rp-bulk{padding:12px 16px;align-items:flex-start;flex-direction:column}}
    `}</style>
    <div className="rp-wrap">
      <div className="rp-eyebrow">CityOps · Management</div>
      <header className="rp-heading"><div><h1 className="rp-title">Reports</h1><p className="rp-subtitle">Explore property, tenant, financial and operational insights in one place.</p></div><div className="rp-head-actions"><button className="rp-btn" onClick={() => { setQuery(""); setCategory("All reports"); setFormat("All formats"); setSelected([]); setNotice(""); }}>Reset filters</button><button className="rp-btn primary" onClick={() => setNotice("Choose a report below to export it. Connect your report API to generate complete report files.")}><Icon name="chart" size={16}/> Generate report</button></div></header>
      <section className="rp-stats">
        <div className="rp-stat"><div className="rp-stat-icon blue"><Icon name="list" size={21}/></div><div><div className="rp-stat-label">AVAILABLE REPORTS</div><div className="rp-stat-value">{reports.length}</div><div className="rp-stat-note">Across all categories</div></div></div>
        <div className="rp-stat"><div className="rp-stat-icon green"><Icon name="chart" size={21}/></div><div><div className="rp-stat-label">FINANCIAL</div><div className="rp-stat-value">{reports.filter(r=>r.category==="Financial").length}</div><div className="rp-stat-note">Income, expenses & banking</div></div></div>
        <div className="rp-stat"><div className="rp-stat-icon purple"><Icon name="building" size={21}/></div><div><div className="rp-stat-label">PROPERTY & TENANT</div><div className="rp-stat-value">{reports.filter(r=>r.category==="Property"||r.category==="Tenant").length}</div><div className="rp-stat-note">Assets, occupancy & leases</div></div></div>
        <div className="rp-stat"><div className="rp-stat-icon orange"><Icon name="calendar" size={21}/></div><div><div className="rp-stat-label">OPERATIONS</div><div className="rp-stat-value">{reports.filter(r=>r.category==="Operations").length}</div><div className="rp-stat-note">Maintenance & activity</div></div></div>
      </section>
      <section className="rp-panel">
        <div className="rp-panel-head"><div><h2>Report library</h2><p>Find a report and export it in your preferred format.</p></div><span className="rp-count">{visible.length} {visible.length===1?"report":"reports"}</span></div>
        <div className="rp-toolbar"><div className="rp-tabs" role="tablist" aria-label="Report categories">{categories.map(c=><button key={c} role="tab" aria-selected={category===c} className={`rp-tab ${category===c?"active":""}`} onClick={()=>setCategory(c)}>{c}</button>)}</div><div className="rp-tools"><select className="rp-select" aria-label="Filter by format" value={format} onChange={e=>setFormat(e.target.value)}><option>All formats</option><option>PDF</option><option>Excel</option><option>CSV</option></select><div className="rp-searchbox"><input className="rp-search" aria-label="Search reports" placeholder="Search reports..." value={query} onChange={e=>setQuery(e.target.value)}/></div></div></div>
        <div className="rp-grid">{visible.length ? visible.map(r=><article className="rp-report" key={r.id}><div className="rp-report-top"><div className="rp-report-icon"><Icon name={r.icon}/></div><input className="rp-check" type="checkbox" aria-label={`Select ${r.name}`} checked={selected.includes(r.id)} onChange={e=>setSelected(prev=>e.target.checked?[...prev,r.id]:prev.filter(id=>id!==r.id))}/></div><h3>{r.name}</h3><p>{r.description}</p><div className="rp-meta"><span className="rp-category">{r.category}</span><span className="rp-format">{r.format==="PDF"?"▤":r.format==="Excel"?"▦":"≡"} {r.format}</span></div><div className="rp-report-bottom"><span className="rp-updated">Updated: {r.updated}</span><button className="rp-open" onClick={()=>downloadReport(r)}>Export report ↗</button></div></article>) : <div className="rp-empty"><strong>No reports found</strong><span>Try another search term or change the selected filters.</span></div>}</div>
        {selected.length>0 && <div className="rp-bulk"><span>{selected.length} report{selected.length===1?"":"s"} selected</span><button className="rp-btn primary" onClick={()=>{const chosen=reports.filter(r=>selected.includes(r.id));chosen.forEach(downloadReport);setNotice(`Started demo exports for ${chosen.length} selected reports. Connect your report API for complete report data.`);}}>Export selected</button></div>}
        {notice && <p className="rp-notice" role="status">{notice}</p>}
      </section>
      <footer className="rp-footer">© 2026 CityOps · Property Management Suite</footer>
    </div>
  </main>;
}
