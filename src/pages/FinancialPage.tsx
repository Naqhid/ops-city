import React, { useEffect, useMemo, useState } from "react";
import { getResource } from "../api/client";

type Transaction = {
  id: string; source: string; description: string; postedBy: string;
  amount: number; direction: "DB" | "CR"; currency: string; bankDetails: string;
  organization?: string; year?: string; month?: string; method?: string;
};
type DbRow = Record<string, unknown>;
function text(v: unknown, fallback = "") { return v == null ? fallback : String(v); }
function number(v: unknown) { const n = Number(v); return Number.isFinite(n) ? n : 0; }
function exportCsv(rows: Transaction[]) {
  const header = ["Source", "Description", "Post/Pay by", "Amount", "DB/CR", "Currency", "Bank details"];
  const data = rows.map(r => [r.source, r.description, r.postedBy, r.amount.toFixed(2), r.direction, r.currency, r.bankDetails]);
  const csv = [header, ...data].map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  const a = document.createElement("a"); a.href = url; a.download = "financial-transactions.csv"; a.click(); URL.revokeObjectURL(url);
}
export default function Financial() {
  const [organization, setOrganization] = useState("All organizations");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [month, setMonth] = useState("All months");
  const [method, setMethod] = useState("All methods");
  const [bank, setBank] = useState("All bank accounts");
  const [search, setSearch] = useState("");
  const [direction, setDirection] = useState<"all" | "DB" | "CR">("all");
  const [rows, setRows] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState<keyof Transaction | "">("");
  useEffect(() => {
    let active = true;
    setLoading(true); setError("");
    Promise.all([
      getResource<DbRow>("costs", "?limit=100"),
      getResource<DbRow>("rentals", "?limit=100"),
      getResource<DbRow>("investments", "?limit=100"),
    ]).then(([costs, rentals, investments]) => {
      const mapped: Transaction[] = [
        ...costs.map((r, i) => ({ id: `cost-${text(r.CostID, i)}`, source: "Costing", description: text(r.Type, "Cost"), postedBy: text(r.Comments, "—"), amount: number(r.Amount), direction: "DB" as const, currency: "QAR", bankDetails: "—", organization: text(r.OrganizationName, "All organizations"), year: text(r.Date).slice(0,4), month: text(r.Date).slice(5,7), method: "—" })),
        ...rentals.map((r, i) => ({ id: `rent-${text(r.RentalID, i)}`, source: "Rental", description: text(r.BillType, "Rental"), postedBy: text(r.Comments, "—"), amount: number(r.PayingAmount ?? r.RentalAmount), direction: "CR" as const, currency: "QAR", bankDetails: "—", organization: text(r.OrganizationName, "All organizations"), year: text(r.Date).slice(0,4) || text(r.Year), month: text(r.Date).slice(5,7) || text(r.Month), method: "—" })),
        ...investments.map((r, i) => ({ id: `investment-${text(r.RelationID, i)}`, source: "Investment", description: text(r.Sattlement, "Investment"), postedBy: text(r.Comments, "—"), amount: number(r.InvestmentAmount), direction: "CR" as const, currency: "QAR", bankDetails: "—", organization: text(r.OrganizationName, "All organizations"), year: text(r.Date).slice(0,4), month: text(r.Date).slice(5,7), method: "—" })),
      ];
      if (active) setRows(mapped);
    }).catch(e => { if (active) setError(e instanceof Error ? e.message : "Unable to load financial data"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const result = rows.filter(r =>
      (!q || [r.source, r.description, r.postedBy, r.bankDetails].some(v => v.toLowerCase().includes(q))) &&
      (direction === "all" || r.direction === direction) &&
      (bank === "All bank accounts" || r.bankDetails === bank) &&
      (organization === "All organizations" || r.organization === organization) &&
      (year === "All years" || !r.year || r.year === year) &&
      (month === "All months" || !r.month || r.month === String(["January","February","March","April","May","June","July","August","September","October","November","December"].indexOf(month)+1).padStart(2,"0")) &&
      (method === "All methods" || r.method === method));
    if (sort) result.sort((a, b) => typeof a[sort] === "number" && typeof b[sort] === "number" ? Number(a[sort])-Number(b[sort]) : String(a[sort] ?? "").localeCompare(String(b[sort] ?? "")));
    return result;
  }, [rows, search, direction, bank, organization, year, month, method, sort]);
  const credit = filtered.filter(r => r.direction === "CR").reduce((n, r) => n + r.amount, 0);
  const debit = filtered.filter(r => r.direction === "DB").reduce((n, r) => n + r.amount, 0);
  const currency = filtered[0]?.currency ?? "QAR";
  const fmt = (n: number) => `${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
  const select = (label: string, value: string, options: string[], change: (v: string) => void) => (
    <label className="fin-filter" key={label}><span>{label}</span><select value={value} onChange={e => change(e.target.value)}>{options.map(o => <option key={o}>{o}</option>)}</select></label>
  );
  return <main className="financial-page">
    <style>{`.financial-page{min-height:100%;padding:30px clamp(14px,2.2vw,34px) 38px;background:#f3f6fc;color:#172b4d;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}.fin-wrap{max-width:1600px;margin:auto}.fin-eyebrow{display:flex;align-items:center;gap:8px;color:#2864dc;font-size:10px;font-weight:850;letter-spacing:.18em;text-transform:uppercase}.fin-eyebrow:before{content:"";width:22px;height:2px;border-radius:4px;background:#3478f6}.fin-heading{display:flex;justify-content:space-between;align-items:flex-end;gap:18px;margin:10px 0 24px}.fin-title{margin:0;font-size:clamp(28px,2.5vw,36px);line-height:1.12;letter-spacing:-.045em;font-weight:850;color:#142b50}.fin-subtitle{margin:9px 0 0;color:#7a8aa6;font-size:13px}.fin-btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;border:0;border-radius:11px;padding:12px 17px;background:linear-gradient(135deg,#3478f6,#215bd5);color:#fff;font-size:12px;font-weight:750;cursor:pointer;white-space:nowrap}.fin-card{background:#fff;border:1px solid #e3eaf5;border-radius:20px;box-shadow:0 8px 30px #1c3f7510;overflow:hidden}.fin-card-head{padding:22px 24px 19px;border-bottom:1px solid #edf1f7;display:flex;justify-content:space-between;align-items:center;gap:16px}.fin-card-head h2{font-size:15px;margin:0;font-weight:800;color:#1a3155}.fin-card-head p{font-size:11px;color:#8b9ab1;margin:5px 0 0}.fin-count{font-size:11px;color:#6c7e9a;background:#f4f7fc;border:1px solid #e9eef7;padding:7px 10px;border-radius:9px}.fin-filters{display:grid;grid-template-columns:repeat(5,minmax(125px,1fr));gap:14px;padding:20px 24px 18px;background:#fbfcff;border-bottom:1px solid #edf1f7}.fin-filter{display:flex;flex-direction:column;gap:8px;min-width:0}.fin-filter span{font-size:10px;color:#8090aa;font-weight:800;text-transform:uppercase}.fin-filter select{height:42px;border:1px solid #dfe7f2;border-radius:10px;background:#fff;color:#334969;padding:0 10px;font-size:12px}.fin-toolbar{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:18px 24px 13px}.fin-muted{font-size:11px;color:#7c8ca5}.fin-search{width:270px;max-width:100%;height:39px;box-sizing:border-box;border:1px solid #dfe7f2;border-radius:10px;padding:0 12px;background:#fbfcff;color:#263d5e;font-size:12px}.fin-tablewrap{overflow-x:auto;padding:0 24px}.fin-table{width:100%;border-collapse:separate;border-spacing:0;min-width:790px;text-align:left}.fin-table th{background:#f3f6fb;border-bottom:1px solid #e4eaf4;padding:13px;color:#60728f;font-size:10px;white-space:nowrap}.fin-table th button{border:0;background:none;color:inherit;cursor:pointer}.fin-table td{padding:15px 13px;border-bottom:1px solid #edf1f7;font-size:12px;color:#465b79}.fin-source{font-weight:800;color:#315fba!important}.fin-desc{font-weight:650;color:#253c5d!important}.fin-amount{font-weight:800;color:#243b5b!important;white-space:nowrap}.fin-pill{display:inline-flex;padding:5px 8px;border-radius:7px;font-size:10px;font-weight:850}.fin-credit{color:#16835e;background:#e9f8f1}.fin-debit{color:#cf4d58;background:#fff0f0}.fin-empty{padding:44px 20px!important;text-align:center!important;color:#8493aa!important}.fin-summary{display:flex;justify-content:space-between;gap:18px;padding:19px 24px 23px}.fin-summaryitems{display:flex;gap:26px}.fin-summaryitem span{display:block;font-size:10px;color:#8796ad;margin-bottom:6px}.fin-summaryitem strong{font-size:14px;color:#243b5b}.fin-summaryitem.credit strong{color:#16835e}.fin-summaryitem.debit strong{color:#d2525d}@media(max-width:900px){.fin-filters{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:600px){.fin-heading,.fin-toolbar,.fin-summary{align-items:flex-start;flex-direction:column}.fin-filters{grid-template-columns:repeat(2,minmax(0,1fr));padding:16px}.fin-tablewrap{padding:0 12px}.fin-summaryitems{width:100%;justify-content:space-between;gap:10px}}`}</style>
    <div className="fin-wrap">
      <div className="fin-eyebrow">CityOps · Management</div>
      <header className="fin-heading"><div><h1 className="fin-title">Financial</h1><p className="fin-subtitle">Track monthly receipts, payments and account balances.</p></div><button className="fin-btn" onClick={() => exportCsv(filtered)}>Export CSV</button></header>
      <section className="fin-card">
        <div className="fin-card-head"><div><h2>Financial transactions</h2><p>Review and export your organization's activity</p></div><span className="fin-count">{filtered.length} records</span></div>
        <div className="fin-filters">
          {select("Organization", organization, ["All organizations", ...Array.from(new Set(rows.map(r=>r.organization).filter((v):v is string=>!!v)))], setOrganization)}
          {select("Financial year", year, ["All years", ...Array.from(new Set([String(new Date().getFullYear()), ...rows.map(r=>r.year||"")].filter(Boolean)))], setYear)}
          {select("Month", month, ["All months","January","February","March","April","May","June","July","August","September","October","November","December"], setMonth)}
          {select("Payment method", method, ["All methods", ...Array.from(new Set(rows.map(r=>r.method).filter((v):v is string=>!!v)))], setMethod)}
          {select("Bank details", bank, ["All bank accounts", ...Array.from(new Set(rows.map(r=>r.bankDetails).filter(v=>v && v!=="—")))], setBank)}
        </div>
        <div className="fin-toolbar"><div className="fin-muted">Showing <strong>{filtered.length}</strong> transactions for {month} {year}</div><input className="fin-search" aria-label="Search transactions" placeholder="Search transactions..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        {error && <p role="alert" style={{padding:'0 24px',color:'#b42318'}}>{error}</p>}{loading && <p style={{padding:'0 24px'}}>Loading financial records…</p>}
        <div className="fin-tablewrap"><table className="fin-table"><thead><tr>{([["source","Source"],["description","Description"],["postedBy","Post / Pay by"],["amount","Amount"]] as [keyof Transaction,string][]).map(([key,label])=><th key={key}><button onClick={()=>setSort(sort===key?"":key)}>{label} ↕</button></th>)}<th><button onClick={()=>setDirection(direction==="all"?"CR":direction==="CR"?"DB":"all")}>DB / CR ↕</button></th><th>Currency</th><th>Bank details</th></tr></thead><tbody>
          {filtered.map(r=><tr key={r.id}><td className="fin-source">{r.source}</td><td className="fin-desc">{r.description}</td><td>{r.postedBy}</td><td className="fin-amount">{r.amount.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})} {r.currency}</td><td><span className={`fin-pill ${r.direction==="CR"?"fin-credit":"fin-debit"}`}>{r.direction}</span></td><td>{r.currency}</td><td>{r.bankDetails}</td></tr>)}
          {!loading && !filtered.length && <tr><td className="fin-empty" colSpan={7}>{error ? "Could not load records." : "No transactions to display."}</td></tr>}
          <tr><td colSpan={3} className="fin-desc">Net balance</td><td className="fin-amount">{(credit-debit).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})} {currency}</td><td>—</td><td>{currency}</td><td>—</td></tr>
        </tbody></table></div>
        <div className="fin-summary"><div className="fin-muted">Totals reflect the currently displayed records.</div><div className="fin-summaryitems"><div className="fin-summaryitem credit"><span>Total credit</span><strong>{fmt(credit)}</strong></div><div className="fin-summaryitem debit"><span>Total debit</span><strong>{fmt(debit)}</strong></div><div className="fin-summaryitem"><span>Net balance</span><strong>{fmt(credit-debit)}</strong></div></div></div>
      </section>
    </div>
  </main>;
}
