import React, { useMemo, useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";

type Building = {
  id: string; name: string; type: string; category: string; categoryName: string;
  address: string; latitude: string; longitude: string; status: string; electricity: string; water: string;
};
type Tenant = {
  id: number; name: string; type: string; status: string; floor: string; floorCode: string;
  unit: string; unitCode: string; buildingId: string;
};
type RentRow = {
  id: number; year: number; month: string; date: string; type: string; method: string;
  description: string; currency: string; total: number; paid: number; balance: number;
  posted?: boolean;
};

const initialBuildings: Building[] = [
  { id: "BLD000001", name: "South End", type: "Residential", category: "Gated Community", categoryName: "", address: "South End District", latitude: "3345.776", longitude: "4453.998", status: "Active", electricity: "", water: "" },
  { id: "BLD000002", name: "West End", type: "Commercial", category: "Commercial", categoryName: "Office", address: "West End District", latitude: "", longitude: "", status: "Active", electricity: "", water: "" },
];
const initialTenants: Tenant[] = [
  { id: 271, name: "Jacob Andrews", type: "Personal", status: "Active", floor: "1st Floor", floorCode: "FLR000250", unit: "F1", unitCode: "UNT000353", buildingId: "BLD000001" },
  { id: 272, name: "kd sjkdsah", type: "Personal", status: "Active", floor: "Ground Floor", floorCode: "FLR000222", unit: "G1", unitCode: "UNT000304", buildingId: "BLD000001" },
  { id: 273, name: "Suleman", type: "Personal", status: "InActive", floor: "Ground Floor", floorCode: "FLR000222", unit: "G1", unitCode: "UNT000304", buildingId: "BLD000001" },
];
const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const inputClass = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100";
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500";
const cardClass = "rounded-2xl border border-slate-200 bg-white shadow-sm";

function Field({ label, value, onChange, required, type = "text", disabled, options, placeholder }: {
  label: string; value?: string; onChange?: (v: string) => void; required?: boolean; type?: string;
  disabled?: boolean; options?: string[]; placeholder?: string;
}) {
  return <label className="block min-w-0">
    <span className={labelClass}>{label}{required && <span className="ml-1 text-rose-500">*</span>}</span>
    {options ? <select className={inputClass} value={value ?? ""} disabled={disabled} onChange={e => onChange?.(e.target.value)}>
      {options.map(o => <option key={o}>{o}</option>)}
    </select> : <input className={`${inputClass} ${disabled ? "bg-slate-100 text-slate-400" : ""}`} type={type} value={value ?? ""} placeholder={placeholder} disabled={disabled} onChange={e => onChange?.(e.target.value)} />}
  </label>;
}
function Section({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return <section className={`${cardClass} ${className}`}>
    <div className="border-b border-slate-100 px-5 py-4"><h3 className="font-semibold text-slate-800">{title}</h3></div>
    <div className="p-5">{children}</div>
  </section>;
}
function Button({ children, onClick, tone = "primary", type = "button" }: { children: React.ReactNode; onClick?: () => void; tone?: "primary" | "dark" | "success" | "warning" | "danger" | "light"; type?: "button" | "submit" }) {
  const tones = {
    primary: "bg-sky-600 text-white hover:bg-sky-700",
    dark: "bg-slate-800 text-white hover:bg-slate-900",
    success: "bg-emerald-600 text-white hover:bg-emerald-700",
    warning: "bg-amber-500 text-white hover:bg-amber-600",
    danger: "bg-rose-600 text-white hover:bg-rose-700",
    light: "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
  };
  return <button type={type} onClick={onClick} className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm transition ${tones[tone]}`}>{children}</button>;
}
function IconButton({ children, onClick, tone = "success", title }: { children: React.ReactNode; onClick?: () => void; tone?: "success" | "danger" | "primary"; title?: string }) {
  const tones = {
    primary: "bg-sky-600 text-white hover:bg-sky-700",
    success: "bg-emerald-500 text-white hover:bg-emerald-600",
    danger: "bg-rose-500 text-white hover:bg-rose-600",
  };
  return <button type="button" title={title} onClick={onClick} className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-sm shadow-sm transition ${tones[tone]}`}>{children}</button>;
}
function DataTable({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return <div className="overflow-x-auto rounded-xl border border-slate-200"><table className="w-full min-w-[760px] border-collapse text-left text-sm">
    <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600"><tr>{headers.map(h => <th key={h} className="whitespace-nowrap px-4 py-3 font-semibold">{h}</th>)}</tr></thead>
    <tbody className="divide-y divide-slate-100">{children}</tbody>
  </table></div>;
}

export default function TenantsAndRentalsPage(_props: { query?: string; setQuery?: (v: string) => void } = {}) {
  const [buildings] = useState(initialBuildings);
  const [tenants, setTenants] = useState(initialTenants);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [tab, setTab] = useState<"Tenant" | "Other Details" | "Transactions">("Tenant");
  const [buildingSearch, setBuildingSearch] = useState("");
  const [tenantSearch, setTenantSearch] = useState("");
  const [form, setForm] = useState<Record<string, string>>({});
  const [rentRows, setRentRows] = useState<RentRow[]>([]);
  const [showRentModal, setShowRentModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [activeRentId, setActiveRentId] = useState<number | null>(null);
  const [toast, setToast] = useState("");
  const [rentForm, setRentForm] = useState({ year: "2026", month: "OCT", date: "15/10/2026", paymentFor: "Monthly Rent", currency: "QAR", amount: "4500", payingAmount: "4500" });
  const [paymentForm, setPaymentForm] = useState({ method: "Cheque", itemType: "", bank: "", debitCredit: "DR000001 - Monthly Rent", reference: "", date: "15/10/2026" });
  const [schedule, setSchedule] = useState({ years: "1", months: "0", days: "0", start: "01/04/2026", end: "31/03/2027", status: "Active", noticePeriod: "1", noticeUnit: "Months", noticeDate: "03/03/2027", monthlyRent: "4500", method: "Cheque" });
  const [paymentRows, setPaymentRows] = useState([{ id: 1, type: "Monthly Rent", description: "Monthly Rent", amount: "4500", date: "02/04/2026", method: "Cheque" }]);
  const [attachments, setAttachments] = useState<{ name: string; type: string; title: string }[]>([]);
  const [attachmentTitle, setAttachmentTitle] = useState("");
  const [attachmentType, setAttachmentType] = useState("Identification");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

  const filteredBuildings = useMemo(() => buildings.filter(b => `${b.id} ${b.name} ${b.type} ${b.category} ${b.status}`.toLowerCase().includes(buildingSearch.toLowerCase())), [buildings, buildingSearch]);
  const filteredTenants = useMemo(() => tenants.filter(t => t.buildingId === selectedBuilding?.id && `${t.name} ${t.type} ${t.status} ${t.floor} ${t.unit}`.toLowerCase().includes(tenantSearch.toLowerCase())), [tenants, selectedBuilding, tenantSearch]);

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2800); };
  const updateForm = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));
  const openTenant = (tenant: Tenant) => {
    setSelectedTenant(tenant); setTab("Tenant");
    setForm({
      organization: "Axiom", building: selectedBuilding?.name ?? "South End", buildingNumber: "8074", zone: "91", street: "187", address1: "", address2: "", city: "",
      unit: tenant.unit, status: tenant.status === "InActive" ? "InActive" : "Active", type: tenant.type, tenantName: tenant.name, idType: "Identification (ID)", idNumber: "76534534231", idExpiry: "31/12/2026",
      nationality: "Qatar", contactNo: "66654556", contactEmail: "jandrews@gmail.com", natureOfWork: "Employed", company: "", companyContact: "", rent: "Yes", utilities: "Personal", maintenance: "Active",
      gender: "Male", dateOfBirth: "05/11/1997", maritalStatus: "Single", passportNo: "", passportExpiry: "", visaNo: "", visaExpiry: "",
      referenceName: "", referenceAddress: "", referenceId: "", referencePhone: "", referenceCompany: "", referenceEmail: "", referenceComments: "",
      previousBuilding: selectedBuilding?.name ?? "South End", previousAddress: "", previousStart: "", previousEnd: "", previousComments: "",
      brokerName: "", brokerPaymentMethod: "Cheque", brokerId: "", brokerPayDate: "", brokerCost: "", brokerReference: "",
    });
    setSchedule({ years: "1", months: "0", days: "0", start: "01/04/2026", end: "31/03/2027", status: "Active", noticePeriod: "1", noticeUnit: "Months", noticeDate: "03/03/2027", monthlyRent: "4500", method: "Cheque" });
    setPaymentRows([{ id: 1, type: "Monthly Rent", description: "Monthly Rent", amount: "4500", date: "02/04/2026", method: "Cheque" }]);
    setRentRows(Array.from({ length: 12 }, (_, i) => {
      const d = new Date(2026, 3 + i, 2);
      return { id: i + 1, year: d.getFullYear(), month: months[d.getMonth()], date: `02/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`, type: "Monthly Rent", method: "Cheque", description: "Monthly Rent", currency: "QAR", total: 4500, paid: i < 2 ? 4500 : 0, balance: i < 2 ? 0 : 4500, posted: i < 2 };
    }));
    setAttachments([]);
  };
  const saveTenant = () => {
    if (!form.tenantName?.trim()) { notify("Please enter a tenant name."); return; }
    if (selectedTenant) setTenants(prev => prev.map(t => t.id === selectedTenant.id ? { ...t, name: form.tenantName, type: form.type || "Personal", status: form.status || "Active", unit: form.unit || t.unit } : t));
    notify("Tenant details saved locally.");
  };
  const addRental = () => {
    const amount = Number(rentForm.amount) || 0;
    const paid = Number(rentForm.payingAmount) || 0;
    setRentRows(prev => [...prev, { id: Math.max(0, ...prev.map(r => r.id)) + 1, year: Number(rentForm.year), month: rentForm.month, date: rentForm.date, type: rentForm.paymentFor, method: "Cheque", description: rentForm.paymentFor, currency: rentForm.currency, total: amount, paid, balance: Math.max(0, amount - paid), posted: paid >= amount }]);
    setShowRentModal(false); notify("Rental added to this page.");
  };
  const postPayment = () => {
    setRentRows(prev => prev.map(r => r.id === activeRentId ? { ...r, paid: r.total, balance: 0, posted: true, method: paymentForm.method } : r));
    setShowPaymentModal(false); notify("Payment posted locally.");
  };
  const uploadAttachment = () => {
    if (!attachmentFile) { notify("Choose a file first."); return; }
    setAttachments(prev => [...prev, { name: attachmentFile.name, title: attachmentTitle || attachmentFile.name, type: attachmentType }]);
    setAttachmentFile(null); setAttachmentTitle(""); notify("Attachment added to the page.");
  };
  const showForm = (key: string, label: string, required = false, options?: string[], disabled = false) => <Field label={label} value={form[key] ?? ""} onChange={v => updateForm(key, v)} required={required} options={options} disabled={disabled} />;
  const showSchedule = (key: keyof typeof schedule, label: string, options?: string[]) => <Field label={label} value={schedule[key]} onChange={v => setSchedule(p => ({ ...p, [key]: v }))} options={options} />;

  return <div className="min-h-screen bg-slate-100 text-slate-800">
    <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-slate-200 bg-white px-5 shadow-sm">
      <div className="flex items-center gap-4"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-lg font-black text-white">CO</div><div><div className="text-sm font-bold tracking-wide text-slate-800">CITYOPS</div><div className="text-[11px] text-slate-400">Property Management</div></div></div>
      <div className="hidden text-sm text-slate-500 md:block">Tenant Management <span className="mx-2 text-slate-300">/</span> <span className="font-semibold text-slate-700">Tenants and Rentals</span></div>
      <button onClick={() => { setSelectedBuilding(null); setSelectedTenant(null); }} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200">MN <span className="hidden sm:inline"> Admin</span></button>
    </header>

    <div className="mx-auto max-w-[1600px] px-4 py-6 lg:px-8">
      {!selectedBuilding ? <>
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-sky-600">Tenant Management</div><h1 className="text-2xl font-bold tracking-tight text-slate-900">Tenants and Rentals</h1><p className="mt-1 text-sm text-slate-500">Choose a building to view its tenants, rental agreements, and transactions.</p></div>
          <div className="flex gap-3"><div className="rounded-xl border border-slate-200 bg-white px-4 py-3"><div className="text-xs text-slate-500">Buildings</div><div className="text-xl font-bold">{buildings.length}</div></div><div className="rounded-xl border border-slate-200 bg-white px-4 py-3"><div className="text-xs text-slate-500">Tenants</div><div className="text-xl font-bold">{tenants.length}</div></div></div>
        </div>
        <div className={cardClass}>
          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-semibold text-slate-800">Buildings</h2><p className="mt-1 text-xs text-slate-500">Select a building code to open its tenant list.</p></div><input className={`${inputClass} sm:max-w-xs`} placeholder="Search buildings..." value={buildingSearch} onChange={e => setBuildingSearch(e.target.value)} /></div>
          <DataTable headers={["Building", "Building Name", "Building Type", "Category", "Category Name", "Address", "Latitude", "Longitude", "Status", "Electricity Number", "Water Number"]}>
            {filteredBuildings.map(b => <tr key={b.id} className="hover:bg-sky-50/60">
              <td className="px-4 py-4"><button className="font-semibold text-sky-700 underline-offset-4 hover:underline" onClick={() => { setSelectedBuilding(b); setTenantSearch(""); }}>{b.id}</button></td>
              <td className="whitespace-nowrap px-4 py-4 font-medium">{b.name}</td><td className="px-4 py-4">{b.type}</td><td className="px-4 py-4">{b.category}</td><td className="px-4 py-4">{b.categoryName || "—"}</td><td className="px-4 py-4">{b.address || "—"}</td><td className="px-4 py-4">{b.latitude || "—"}</td><td className="px-4 py-4">{b.longitude || "—"}</td><td className="px-4 py-4"><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">{b.status}</span></td><td className="px-4 py-4">{b.electricity || "—"}</td><td className="px-4 py-4">{b.water || "—"}</td>
            </tr>)}
          </DataTable>
          <div className="flex items-center justify-between p-5 text-xs text-slate-500"><span>Showing {filteredBuildings.length} of {buildings.length} buildings</span><span>Click a building code to continue →</span></div>
        </div>
      </> : !selectedTenant ? <>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4"><div><button onClick={() => setSelectedBuilding(null)} className="mb-3 text-sm font-semibold text-sky-700 hover:underline">← All buildings</button><h1 className="text-2xl font-bold text-slate-900">Tenants</h1><p className="mt-1 text-sm text-slate-500">{selectedBuilding.name} <span className="mx-2">•</span>{selectedBuilding.id}</p></div><Button onClick={() => { const t: Tenant = { id: Date.now(), name: "New Tenant", type: "Personal", status: "Active", floor: "Ground Floor", floorCode: "FLR000222", unit: "G1", unitCode: "UNT000304", buildingId: selectedBuilding.id }; setTenants(p => [...p, t]); openTenant(t); }}>＋ Create New</Button></div>
        <div className={cardClass}><div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-semibold">Tenant directory</h2><p className="mt-1 text-xs text-slate-500">Click a tenant name to open the tenant setup tabs.</p></div><input className={`${inputClass} sm:max-w-xs`} placeholder="Search tenants..." value={tenantSearch} onChange={e => setTenantSearch(e.target.value)} /></div>
          <DataTable headers={["Tenant Name", "Tenant Type", "Status", "Floor Name", "Floor Code", "Unit", "Unit Code"]}>
            {filteredTenants.map(t => <tr key={t.id} className="hover:bg-sky-50/60"><td className="px-4 py-4"><button className="font-semibold text-sky-700 hover:underline" onClick={() => openTenant(t)}>{t.name}</button></td><td className="px-4 py-4">{t.type}</td><td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${t.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{t.status}</span></td><td className="px-4 py-4">{t.floor}</td><td className="px-4 py-4">{t.floorCode}</td><td className="px-4 py-4">{t.unit}</td><td className="px-4 py-4">{t.unitCode}</td></tr>)}
          </DataTable><div className="p-5 text-xs text-slate-500">Showing {filteredTenants.length} tenant(s)</div>
        </div>
      </> : <>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><button onClick={() => setSelectedTenant(null)} className="mb-2 text-sm font-semibold text-sky-700 hover:underline">← Back to tenants</button><h1 className="text-2xl font-bold text-slate-900">{selectedTenant.name}</h1><p className="mt-1 text-sm text-slate-500">{selectedBuilding.name} / {selectedTenant.floor} / Unit {selectedTenant.unit}</p></div><div className="flex gap-2"><Button tone="light" onClick={() => { setSelectedTenant(null); }}>Close</Button><Button onClick={saveTenant}>Save changes</Button></div></div>
        <div className="mb-5 flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
          {(["Tenant", "Other Details", "Transactions"] as const).map(t => <button key={t} onClick={() => setTab(t)} className={`rounded-lg px-5 py-3 text-sm font-semibold transition ${tab === t ? "bg-slate-900 text-white shadow" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"}`}>{t}</button>)}
        </div>

        {tab === "Tenant" && <div className="space-y-5">
          <Section title="Building">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {showForm("organization", "Organization", true, ["Axiom", "CityOps"])}
              {showForm("building", "Building", true, buildings.map(b => b.name))}
              {showForm("buildingNumber", "Building Number", false, undefined, true)}
              {showForm("zone", "Zone", false, undefined, true)}
              {showForm("street", "Street", false, undefined, true)}
              {showForm("address1", "Address 1")}
              {showForm("address2", "Address 2")}
              {showForm("city", "City")}
              {showForm("unit", "Unit", true, ["F1", "G1", "F2", "G2"])}
            </div>
          </Section>
          <Section title="Tenant Details">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {showForm("status", "Status", true, ["Active", "InActive"])}
              {showForm("type", "Type", true, ["Personal", "Company"])}
              {showForm("tenantName", "Tenant Name", true)}
              {showForm("idType", "ID Type", true, ["Identification (ID)", "Passport", "Residence Permit"])}
              {showForm("idNumber", "ID / Reg Number", true)}
              {showForm("idExpiry", "ID Expiry Date", true)}
              {showForm("gender", "Gender", false, ["Male", "Female", "Other"])}
              {showForm("dateOfBirth", "Date of Birth")}
              {showForm("maritalStatus", "Marital Status", false, ["Single", "Married", "Divorced", "Widowed"])}
              {showForm("nationality", "Nationality", true, ["Qatar", "India", "United Arab Emirates", "Other"])}
              {showForm("contactNo", "Contact No")}
              {showForm("contactEmail", "Contact Email", true)}
              {showForm("natureOfWork", "Nature of Work", true, ["Employed", "Self Employed", "Business", "Other"])}
              {showForm("company", "Company")}
              {showForm("companyContact", "Company Contact")}
              {showForm("rent", "Tenant Type — Rent", false, ["Yes", "No"])}
              {showForm("utilities", "E & W", false, ["Personal", "Company", "Included"])}
              {showForm("maintenance", "Maintenance", false, ["Active", "InActive"])}
            </div>
          </Section>
          <Section title="Rent Details">
            <div className="mb-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {showSchedule("years", "Contract Term — Years")}
              {showSchedule("months", "Contract Term — Months")}
              {showSchedule("days", "Contract Term — Days")}
              {showSchedule("start", "Start Date")}
              {showSchedule("end", "End Date")}
              {showSchedule("status", "Rent Status", ["Active", "Pending", "Expired", "Closed"])}
              {showSchedule("noticePeriod", "Notice Period")}
              {showSchedule("noticeUnit", "Notice Period Unit", ["Days", "Months", "Years"])}
              {showSchedule("noticeDate", "Notice Date")}
            </div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><h4 className="font-semibold text-slate-700">Rental payment schedule</h4><div className="flex gap-2"><Button tone="light" onClick={() => setPaymentRows(p => [...p, { id: Date.now(), type: "Monthly Rent", description: "Monthly Rent", amount: "4500", date: "02/05/2026", method: "Cheque" }])}>＋ Add row</Button><Button tone="light" onClick={() => notify("Schedule refreshed.")}>↻ Refresh</Button></div></div>
            <DataTable headers={["Type", "Description", "Amount", "Pay Date", "Payment Method", ""]}>
              {paymentRows.map((r, i) => <tr key={r.id}><td className="min-w-40 px-3 py-2"><select className={inputClass} value={r.type} onChange={e => setPaymentRows(p => p.map(x => x.id === r.id ? { ...x, type: e.target.value } : x))}><option>Monthly Rent</option><option>Security Deposit</option><option>Utilities</option><option>Other</option></select></td><td className="min-w-40 px-3 py-2"><input className={inputClass} value={r.description} onChange={e => setPaymentRows(p => p.map(x => x.id === r.id ? { ...x, description: e.target.value } : x))} /></td><td className="min-w-28 px-3 py-2"><input className={inputClass} value={r.amount} onChange={e => setPaymentRows(p => p.map(x => x.id === r.id ? { ...x, amount: e.target.value } : x))} /></td><td className="min-w-36 px-3 py-2"><input className={inputClass} value={r.date} onChange={e => setPaymentRows(p => p.map(x => x.id === r.id ? { ...x, date: e.target.value } : x))} /></td><td className="min-w-36 px-3 py-2"><select className={inputClass} value={r.method} onChange={e => setPaymentRows(p => p.map(x => x.id === r.id ? { ...x, method: e.target.value } : x))}><option>Cheque</option><option>Cash</option><option>Bank Transfer</option><option>Card</option></select></td><td className="px-3 py-2"><Button tone="danger" onClick={() => setPaymentRows(p => p.filter(x => x.id !== r.id))}>−</Button></td></tr>)}
            </DataTable>
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              <div className="rounded-xl border border-dashed border-slate-300 p-4">
                <h4 className="mb-4 font-semibold text-slate-700">Supporting Documents</h4>
                <div className="grid gap-3 sm:grid-cols-2"><Field label="Type" value={attachmentType} onChange={setAttachmentType} options={["Identification", "Contract", "Receipt", "Other"]}/><Field label="Title" value={attachmentTitle} onChange={setAttachmentTitle}/></div>
                <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center hover:border-sky-400"><span className="text-2xl text-slate-400">⇧</span><span className="mt-2 text-sm font-medium text-slate-600">{attachmentFile ? attachmentFile.name : "Drag and drop a file or click to browse"}</span><input type="file" className="hidden" onChange={e => setAttachmentFile(e.target.files?.[0] ?? null)} /></label>
                <Button onClick={uploadAttachment} >Upload</Button>
                {attachments.length > 0 && <div className="mt-3 space-y-2">{attachments.map((a, i) => <div key={i} className="flex items-center justify-between rounded-lg bg-slate-50 p-2 text-xs"><span>{a.title} <span className="text-slate-400">({a.type})</span></span><button className="text-rose-600" onClick={() => setAttachments(p => p.filter((_, j) => i !== j))}>Remove</button></div>)}</div>}
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <h4 className="mb-4 font-semibold text-slate-700">Rent actions</h4><p className="mb-4 text-sm leading-6 text-slate-500">Generate the rent schedule for the contract period or create a rental contract document. This UI demo keeps changes in page state only.</p>
                <div className="flex flex-wrap gap-2"><Button tone="success" onClick={() => { setRentRows(Array.from({ length: 12 }, (_, i) => { const d = new Date(2026, 3 + i, 2); return { id: i + 1, year: d.getFullYear(), month: months[d.getMonth()], date: `02/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`, type: "Monthly Rent", method: schedule.method, description: "Monthly Rent", currency: "QAR", total: Number(schedule.monthlyRent) || 4500, paid: 0, balance: Number(schedule.monthlyRent) || 4500 }; })); notify("12 rent entries generated."); }}>Generate Rents</Button><Button tone="warning" onClick={() => notify("Contract preview is not connected in this UI-only demo.")}>Generate Contract</Button></div>
              </div>
            </div>
          </Section>
          <Section title="Reference">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{showForm("referenceName", "Name")}{showForm("referenceAddress", "Address")}{showForm("referenceId", "ID")}{showForm("referencePhone", "Phone")}{showForm("referenceCompany", "Company")}{showForm("referenceEmail", "Email")}<div className="md:col-span-2 xl:col-span-3">{showForm("referenceComments", "Comments")}</div></div>
          </Section>
          <Section title="Previous Tenancy Detail">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{showForm("previousBuilding", "Building")}{showForm("previousAddress", "Address")}{showForm("previousStart", "Start Date")}{showForm("previousEnd", "End Date")}{showForm("previousComments", "Comments")}</div>
          </Section>
          <Section title="Broker Details">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{showForm("brokerName", "Name")}{showForm("brokerPaymentMethod", "Payment Method", false, ["Cheque", "Cash", "Bank Transfer"])}{showForm("brokerId", "ID")}{showForm("brokerPayDate", "Pay Date")}{showForm("brokerCost", "Cost")}{showForm("brokerReference", "Reference")}</div>
          </Section>
          <div className="flex flex-wrap justify-end gap-2"><Button tone="light" onClick={() => setSelectedTenant(null)}>Return</Button><Button tone="dark" onClick={() => notify("Tenant closed locally.")}>Close Out</Button><Button tone="warning" onClick={() => notify("Renewal action selected.")}>Renew</Button><Button onClick={saveTenant}>Save</Button></div>
        </div>}

        {tab === "Other Details" && <div className="space-y-5">
          <Section title="Reference"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{showForm("referenceName", "Name")}{showForm("referenceAddress", "Address")}{showForm("referenceId", "ID")}{showForm("referencePhone", "Phone")}{showForm("referenceCompany", "Company")}{showForm("referenceEmail", "Email")}<div className="md:col-span-2 xl:col-span-3">{showForm("referenceComments", "Comments")}</div></div></Section>
          <Section title="Previous Tenancy Detail"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{showForm("previousBuilding", "Building")}{showForm("previousAddress", "Address")}{showForm("previousStart", "Start Date")}{showForm("previousEnd", "End Date")}<div className="md:col-span-2 xl:col-span-3">{showForm("previousComments", "Comments")}</div></div></Section>
          <Section title="Broker Details"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{showForm("brokerName", "Name")}{showForm("brokerPaymentMethod", "Payment Method", false, ["Cheque", "Cash", "Bank Transfer"])}{showForm("brokerId", "ID")}{showForm("brokerPayDate", "Pay Date")}{showForm("brokerCost", "Cost")}{showForm("brokerReference", "Reference")}</div></Section>
          <Section title="Attachment Files">
            <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
              <div className="space-y-4">
                <Field label="Type" value={attachmentType} onChange={setAttachmentType} options={["Please select", "ID", "Registration", "General Documents", "Building Documents", "Electricity and Water", "Contracts/Agreements", "Others", "Passport Copy", "Invoice", "Payment Receipt", "Purchase Order", "Work Order", "Miscellaneous", "Cheque", "Security Cheque"]}/>
                <Field label="Title" value={attachmentTitle} onChange={setAttachmentTitle}/>
                <Button onClick={uploadAttachment}>Upload</Button>
              </div>
              <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center hover:border-sky-400">
                <span className="text-3xl text-slate-400">⇧</span><span className="mt-2 text-sm text-slate-600">{attachmentFile ? attachmentFile.name : "Drag and drop a file here or click"}</span>
                <input type="file" className="hidden" onChange={e => setAttachmentFile(e.target.files?.[0] ?? null)} />
              </label>
            </div>
            <div className="mt-5"><DataTable headers={["Attachment", "Title", "Type", ""]}>
              {attachments.map((a, i) => <tr key={`${a.name}-${i}`}><td className="px-4 py-3">{a.name}</td><td className="px-4 py-3">{a.title}</td><td className="px-4 py-3">{a.type}</td><td className="px-4 py-3"><Button tone="danger" onClick={() => setAttachments(prev => prev.filter((_, j) => j !== i))}>Remove</Button></td></tr>)}
            </DataTable>{attachments.length === 0 && <p className="px-3 py-3 text-sm text-slate-500">No documents attached.</p>}</div>
          </Section>
          <div className="flex justify-end"><Button onClick={saveTenant}>Save changes</Button></div>
        </div>}

        {tab === "Transactions" && <div className={cardClass}>
          <div className="border-b border-slate-100 p-5"><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">{[["Organization", "Axiom"], ["Building", selectedBuilding.name], ["Floor", selectedTenant.floor], ["Unit", selectedTenant.unit], ["Tenant", selectedTenant.name]].map(([k, v]) => <div key={k}><div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{k}</div><div className="mt-1 font-semibold text-slate-800">{v}</div></div>)}</div></div>
          <div className="flex flex-wrap items-center justify-between gap-3 p-5"><div className="flex flex-wrap items-center gap-2"><Field label="From" value="01/04/2026" onChange={() => {}}/><Field label="To" value="31/03/2027" onChange={() => {}}/><Button onClick={() => notify("Transaction filter applied.")}>Search</Button></div><div className="flex flex-wrap gap-2"><Button tone="success" onClick={() => setShowRentModal(true)}>＋ Add Rental</Button><button type="button" onClick={() => setShowReceiptModal(true)} style={{ backgroundColor: "#0284c7", color: "#ffffff" }} className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:brightness-110">Receipt</button><Button tone="dark" onClick={() => notify("Email action selected.")}>Email</Button></div></div>
          <div className="px-5 pb-5"><div className="mb-3 flex flex-wrap items-center justify-between gap-3"><div className="text-sm text-slate-500">{rentRows.length} rent entries</div><input className={`${inputClass} sm:max-w-xs`} placeholder="Search transactions..." onChange={e => { const value = e.target.value.toLowerCase(); const rows = document.querySelectorAll("[data-rent-row]"); rows.forEach(row => { (row as HTMLElement).style.display = row.textContent?.toLowerCase().includes(value) ? "" : "none"; }); }} /></div>
            <DataTable headers={["", "Year", "Month", "Date", "Rent Type", "Payment Method", "Description", "Currency", "Total Amount", "Paying Amount", "Balance", "Actions"]}>
              {rentRows.map(r => <tr key={r.id} data-rent-row><td className="px-4 py-3"><input type="checkbox" /></td><td className="px-4 py-3">{r.year}</td><td className="px-4 py-3">{r.month}</td><td className="whitespace-nowrap px-4 py-3">{r.date}</td><td className="px-4 py-3">{r.type}</td><td className="px-4 py-3">{r.method}</td><td className="px-4 py-3">{r.description}</td><td className="px-4 py-3">{r.currency}</td><td className="px-4 py-3 font-semibold">{r.total.toLocaleString()}</td><td className="px-4 py-3">{r.paid.toLocaleString()}</td><td className="px-4 py-3">{r.balance.toLocaleString()}</td><td className="whitespace-nowrap px-4 py-3"><div className="flex items-center gap-1.5">{r.posted ? <IconButton tone="success" title="View receipt" onClick={() => { setActiveRentId(r.id); setShowReceiptModal(true); }}><Eye size={16} /></IconButton> : <><button type="button" onClick={() => { setActiveRentId(r.id); setShowPaymentModal(true); }} style={{ backgroundColor: "#0284c7", color: "#ffffff" }} className="inline-flex items-center whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold shadow-sm transition hover:brightness-110">Pay/Post</button><IconButton tone="success" title="Edit rent" onClick={() => { setActiveRentId(r.id); setRentForm({ year: String(r.year), month: r.month, date: r.date, paymentFor: r.type, currency: r.currency, amount: String(r.total), payingAmount: String(r.paid) }); setShowRentModal(true); }}><Pencil size={16} /></IconButton><IconButton tone="danger" title="Delete rent" onClick={() => setRentRows(p => p.filter(x => x.id !== r.id))}><Trash2 size={16} /></IconButton></>}</div></td></tr>)}
            </DataTable>
          </div>
        </div>}
      </>}
    </div>

    <footer className="mt-8 border-t border-slate-200 bg-white px-5 py-5 text-center text-xs text-slate-400">Copyright © 2026 — CityApp UI demo. All rights reserved.</footer>

    {toast && <div className="fixed bottom-5 right-5 z-50 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-xl">{toast}</div>}

    {(showRentModal || showPaymentModal || showReceiptModal) && <div className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4" onClick={() => { setShowRentModal(false); setShowPaymentModal(false); setShowReceiptModal(false); }}>
      <div className="my-8 w-full max-w-xl rounded-2xl bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4"><h3 className="text-lg font-bold">{showRentModal ? "Rent Setup" : showPaymentModal ? "Pay Details" : "Receipt"}</h3><button className="text-2xl text-slate-400 hover:text-slate-700" onClick={() => { setShowRentModal(false); setShowPaymentModal(false); setShowReceiptModal(false); }}>×</button></div>
        {showRentModal && <div className="grid gap-4 p-6 sm:grid-cols-2"><Field label="Year" value={rentForm.year} onChange={v => setRentForm(p => ({ ...p, year: v }))} options={["2025", "2026", "2027", "2028"]}/><Field label="Month" value={rentForm.month} onChange={v => setRentForm(p => ({ ...p, month: v }))} options={months}/><Field label="Date" value={rentForm.date} onChange={v => setRentForm(p => ({ ...p, date: v }))} required/><Field label="Payment for" value={rentForm.paymentFor} onChange={v => setRentForm(p => ({ ...p, paymentFor: v }))} options={["Monthly Rent", "Security Deposit", "Utilities", "Other"]} required/><Field label="Currency" value={rentForm.currency} onChange={v => setRentForm(p => ({ ...p, currency: v }))} options={["QAR", "INR", "USD", "AED"]}/><Field label="Amount" value={rentForm.amount} onChange={v => setRentForm(p => ({ ...p, amount: v }))} required/><Field label="Paying Amount" value={rentForm.payingAmount} onChange={v => setRentForm(p => ({ ...p, payingAmount: v }))} required/><div className="flex items-end justify-end gap-2 sm:col-span-2"><Button tone="light" onClick={() => setShowRentModal(false)}>Close</Button><Button onClick={addRental}>Save rental</Button></div></div>}
        {showPaymentModal && <div className="grid gap-4 p-6">
          <Field label="Payment Method" value={paymentForm.method} onChange={v => setPaymentForm(p => ({ ...p, method: v }))} options={["Please Select", "Bank Transfer", "Cash", "Online", "Credit Card", "Debit Card", "Cheque"]} required/>
          <Field label="Item Type" value={paymentForm.itemType} onChange={v => setPaymentForm(p => ({ ...p, itemType: v }))} options={["Please Select", "BNK000001", "BNK000002"]} required/>
          <Field label="Bank Details" value={paymentForm.bank} onChange={v => setPaymentForm(p => ({ ...p, bank: v }))}/>
          <Field label="Debit/Credit" value={paymentForm.debitCredit} onChange={v => setPaymentForm(p => ({ ...p, debitCredit: v }))} required/>
          <Field label="Reference" value={paymentForm.reference} onChange={v => setPaymentForm(p => ({ ...p, reference: v }))}/>
          <Field label="Payment Date" value={paymentForm.date} onChange={v => setPaymentForm(p => ({ ...p, date: v }))} required/>
          <div className="flex justify-end gap-2"><Button tone="light" onClick={() => setShowPaymentModal(false)}>Close</Button><Button onClick={postPayment}>Yes</Button></div>
        </div>}
        {showReceiptModal && <div className="p-6"><p className="mb-5 text-sm text-slate-600">Select a posted rent entry from the Transactions tab to view receipt details. This demo shows sample receipt actions only.</p><div className="flex justify-end gap-2"><Button tone="light" onClick={() => setShowReceiptModal(false)}>Close</Button><Button onClick={() => { setShowReceiptModal(false); notify("Receipt preview is not connected in this UI-only demo."); }}>Continue</Button></div></div>}
      </div>
    </div>}
  </div>;
}
