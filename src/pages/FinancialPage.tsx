import React, { useMemo, useState } from "react";

type Transaction = {
  id: number; source: string; description: string; postedBy: string;
  amount: number; direction: "DB" | "CR"; currency: string; bankDetails: string;
};

const demoRows: Transaction[] = [];

function exportCsv(rows: Transaction[]) {
  const header = ["Source", "Description", "Post/Pay by", "Amount", "DB/CR", "Currency", "Bank details"];
  const data = rows.map(r => [r.source, r.description, r.postedBy, r.amount.toFixed(2), r.direction, r.currency, r.bankDetails]);
  const csv = [header, ...data].map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  const a = document.createElement("a"); a.href = url; a.download = "financial-transactions.csv"; a.click(); URL.revokeObjectURL(url);
}

export default function Financial() {
  const [organization, setOrganization] = useState("Axiom");
  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("October");
  const [method, setMethod] = useState("All methods");
  const [bank, setBank] = useState("All bank accounts");
  const [search, setSearch] = useState("");
  const [direction, setDirection] = useState<"all" | "DB" | "CR">("all");
  const [rows] = useState<Transaction[]>(demoRows);
  const [sort, setSort] = useState<keyof Transaction | "">("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const result = rows.filter(r =>
      (!q || [r.source, r.description, r.postedBy, r.bankDetails].some(v => v.toLowerCase().includes(q))) &&
      (direction === "all" || r.direction === direction) &&
      (bank === "All bank accounts" || r.bankDetails === bank)
    );
    if (sort) result.sort((a, b) => {
      const av = a[sort], bv = b[sort];
      return typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
    });
    return result;
  }, [rows, search, direction, bank, sort]);

  const credit = filtered.filter(r => r.direction === "CR").reduce((n, r) => n + r.amount, 0);
  const debit = filtered.filter(r => r.direction === "DB").reduce((n, r) => n + r.amount, 0);
  const currency = filtered[0]?.currency ?? "QAR";
  const fmt = (n: number) => `${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
  const select = (label: string, value: string, options: string[], change: (v: string) => void) => (
    <label className="fin-filter" key={label}><span>{label}</span><select value={value} onChange={e => change(e.target.value)}>
      {options.map(o => <option key={o}>{o}</option>)}
    </select></label>
  );

  return <main className="financial-page">
    <style>{`
      .financial-page{min-height:100%;padding:30px clamp(14px,2.2vw,34px) 38px;background:#f3f6fc;color:#172b4d;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}
      .fin-wrap{max-width:1600px;margin:auto}.fin-eyebrow{display:flex;align-items:center;gap:8px;color:#2864dc;font-size:10px;font-weight:850;letter-spacing:.18em;text-transform:uppercase}.fin-eyebrow:before{content:"";width:22px;height:2px;border-radius:4px;background:#3478f6}
      .fin-heading{display:flex;justify-content:space-between;align-items:flex-end;gap:18px;margin:10px 0 24px}.fin-title{margin:0;font-size:clamp(28px,2.5vw,36px);line-height:1.12;letter-spacing:-.045em;font-weight:850;color:#142b50}.fin-subtitle{margin:9px 0 0;color:#7a8aa6;font-size:13px}
      .fin-btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;border:0;border-radius:11px;padding:12px 17px;background:linear-gradient(135deg,#3478f6,#215bd5);color:#fff;font-size:12px;font-weight:750;box-shadow:0 8px 18px #2d6ce52b;cursor:pointer;white-space:nowrap}.fin-btn:hover{filter:brightness(1.04);transform:translateY(-1px)}
      .fin-card{background:#fff;border:1px solid #e3eaf5;border-radius:20px;box-shadow:0 8px 30px #1c3f7510;overflow:hidden}.fin-card-head{padding:22px 24px 19px;border-bottom:1px solid #edf1f7;display:flex;justify-content:space-between;align-items:center;gap:16px}.fin-titleblock{display:flex;align-items:center;gap:12px}.fin-icon{width:42px;height:42px;display:grid;place-items:center;border-radius:13px;background:#edf4ff;color:#2b67dc}.fin-card-head h2{font-size:15px;margin:0;font-weight:800;color:#1a3155}.fin-card-head p{font-size:11px;color:#8b9ab1;margin:5px 0 0}.fin-count{font-size:11px;color:#6c7e9a;background:#f4f7fc;border:1px solid #e9eef7;padding:7px 10px;border-radius:9px;white-space:nowrap}
      .fin-filters{display:grid;grid-template-columns:repeat(5,minmax(125px,1fr));gap:14px;padding:20px 24px 18px;background:linear-gradient(180deg,#fbfcff,#fff);border-bottom:1px solid #edf1f7}.fin-filter{display:flex;flex-direction:column;gap:8px;min-width:0}.fin-filter span{font-size:10px;color:#8090aa;font-weight:800;letter-spacing:.07em;text-transform:uppercase}.fin-filter select{width:100%;height:42px;border:1px solid #dfe7f2;border-radius:10px;background:#fff;color:#334969;padding:0 10px;font-size:12px;font-weight:600;outline:none}
      .fin-toolbar{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:18px 24px 13px}.fin-muted{font-size:11px;color:#7c8ca5}.fin-searchwrap{position:relative;width:min(100%,270px)}.fin-search{width:100%;height:39px;box-sizing:border-box;border:1px solid #dfe7f2;border-radius:10px;padding:0 12px 0 36px;background:#fbfcff;color:#263d5e;font-size:12px;outline:none}.fin-searchwrap:before{content:"⌕";position:absolute;left:13px;top:5px;color:#91a0b8;font-size:23px}
      .fin-tablewrap{overflow-x:auto;padding:0 24px}.fin-table{width:100%;border-collapse:separate;border-spacing:0;min-width:790px;text-align:left}.fin-table th{background:#f3f6fb;border-top:1px solid #e8edf5;border-bottom:1px solid #e4eaf4;padding:13px;color:#60728f;font-size:10px;font-weight:850;letter-spacing:.035em;white-space:nowrap}.fin-table th:first-child{border-radius:9px 0 0 9px}.fin-table th:last-child{border-radius:0 9px 9px 0}.fin-table th button{border:0;background:none;color:inherit;font:inherit;cursor:pointer;padding:0}.fin-table td{padding:15px 13px;border-bottom:1px solid #edf1f7;font-size:12px;color:#465b79;vertical-align:middle}.fin-table tbody tr:hover td{background:#fafcff}.fin-source{font-weight:800;color:#315fba!important}.fin-desc{font-weight:650;color:#253c5d!important}.fin-amount{font-variant-numeric:tabular-nums;font-weight:800;color:#243b5b!important;white-space:nowrap}.fin-pill{display:inline-flex;align-items:center;padding:5px 8px;border-radius:7px;font-size:10px;font-weight:850}.fin-credit{color:#16835e;background:#e9f8f1}.fin-debit{color:#cf4d58;background:#fff0f0}.fin-currency{font-size:10px;font-weight:800;color:#6f819c;background:#f2f5fa;border-radius:6px;padding:5px 7px}
      .fin-empty{padding:44px 20px!important;text-align:center!important;color:#8493aa!important}.fin-empty strong{display:block;color:#3c5272;font-size:13px;margin-bottom:5px}.fin-empty span{font-size:11px}.fin-total td{background:#fbfcff;font-weight:800}.fin-summary{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:19px 24px 23px}.fin-summaryitems{display:flex;align-items:center;gap:26px}.fin-summaryitem span{display:block;font-size:10px;color:#8796ad;margin-bottom:6px}.fin-summaryitem strong{font-size:14px;color:#243b5b;font-variant-numeric:tabular-nums}.fin-summaryitem.credit strong{color:#16835e}.fin-summaryitem.debit strong{color:#d2525d}.fin-footer{padding:23px 0 0;text-align:center;color:#9aa8bd;font-size:10px}
      .fin-filter select:focus,.fin-search:focus{border-color:#7ca6ff;box-shadow:0 0 0 3px #3478f61a}.fin-btn:focus-visible,.fin-table th button:focus-visible{outline:3px solid #9bbcff;outline-offset:2px}
      @media(max-width:900px){.fin-filters{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:600px){.financial-page{padding:22px 12px 28px}.fin-heading{flex-direction:column;align-items:stretch}.fin-btn{align-self:flex-start}.fin-card-head{padding:18px 16px}.fin-filters{grid-template-columns:repeat(2,minmax(0,1fr));padding:16px}.fin-toolbar{padding:16px;align-items:flex-start;flex-direction:column}.fin-searchwrap{width:100%}.fin-tablewrap{padding:0 12px}.fin-summary{padding:16px;align-items:flex-start;flex-direction:column}.fin-summaryitems{width:100%;justify-content:space-between;gap:10px}.fin-summaryitem strong{font-size:12px}}
    `}</style>
    <div className="fin-wrap">
      <div className="fin-eyebrow">CityOps · Management</div>
      <header className="fin-heading"><div><h1 className="fin-title">Financial</h1><p className="fin-subtitle">Track monthly receipts, payments and account balances.</p></div>
        <button className="fin-btn" onClick={() => exportCsv(filtered)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 16v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>Export CSV</button>
      </header>
      <section className="fin-card">
        <div className="fin-card-head"><div className="fin-titleblock"><div className="fin-icon"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 10h18M5 10V20h14V10M4 7l8-4 8 4v3H4V7Zm4 7v3m4-3v3m4-3v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg></div><div><h2>Financial transactions</h2><p>Review and export your organization's activity</p></div></div><span className="fin-count">{filtered.length} {filtered.length === 1 ? "record" : "records"}</span></div>
        <div className="fin-filters">
          {select("Organization", organization, ["Axiom", "All organizations"], setOrganization)}
          {select("Financial year", year, ["2026", "2025", "2024", "2023"], setYear)}
          {select("Month", month, ["January","February","March","April","May","June","July","August","September","October","November","December"], setMonth)}
          {select("Payment method", method, ["All methods","Cash","Bank Transfer","Card","Cheque"], setMethod)}
          {select("Bank details", bank, ["All bank accounts","Standard Chartered •••• 3252","CBQ •••• 6542","Cash Transaction"], setBank)}
        </div>
        <div className="fin-toolbar"><div className="fin-muted">Showing <strong>{filtered.length}</strong> transactions for {month} {year}</div><div className="fin-searchwrap"><input className="fin-search" aria-label="Search transactions" placeholder="Search transactions..." value={search} onChange={e => setSearch(e.target.value)} /></div></div>
        <div className="fin-tablewrap"><table className="fin-table"><thead><tr>
          {([["source","Source"],["description","Description"],["postedBy","Post / Pay by"],["amount","Amount"]] as [keyof Transaction,string][]).map(([key,label])=><th key={key}><button onClick={()=>setSort(sort===key?"":key)}>{label} ↕</button></th>)}
          <th><button onClick={()=>setDirection(direction==="all"?"CR":direction==="CR"?"DB":"all")}>DB / CR ↕</button></th><th>Currency</th><th>Bank details</th>
        </tr></thead><tbody>
          {filtered.length ? filtered.map(r=><tr key={r.id}><td className="fin-source">{r.source}</td><td className="fin-desc">{r.description}</td><td>{r.postedBy}</td><td className="fin-amount">{r.amount.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})} {r.currency}</td><td><span className={`fin-pill ${r.direction==="CR"?"fin-credit":"fin-debit"}`}>{r.direction==="CR"?"↙":"↗"} {r.direction}</span></td><td><span className="fin-currency">{r.currency}</span></td><td>{r.bankDetails}</td></tr>) : <tr><td className="fin-empty" colSpan={7}><strong>No transactions to display</strong><span>Transactions matching these filters will appear here.</span></td></tr>}
          <tr className="fin-total"><td colSpan={3} className="fin-desc">Total balance</td><td className="fin-amount">{(credit-debit).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})} {currency}</td><td>—</td><td><span className="fin-currency">{currency}</span></td><td>—</td></tr>
        </tbody></table></div>
        <div className="fin-summary"><div className="fin-muted">Totals reflect the currently displayed transactions.</div><div className="fin-summaryitems"><div className="fin-summaryitem credit"><span>Total credit</span><strong>{fmt(credit)}</strong></div><div className="fin-summaryitem debit"><span>Total debit</span><strong>{fmt(debit)}</strong></div><div className="fin-summaryitem"><span>Net balance</span><strong>{fmt(credit-debit)}</strong></div></div></div>
      </section>
      <footer className="fin-footer">© 2026 CityOps · Property Management Suite</footer>
    </div>
  </main>;
}
