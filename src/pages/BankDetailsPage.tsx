import React, { useMemo, useState } from "react";

type Bank = {
  id: number;
  itemCode: string;
  itemType: string;
  description: string;
  bankName: string;
  organization: string;
  accountNumber: string;
  accountName: string;
  accountType: string;
  ibanCode: string;
  swiftCode: string;
  branch: string;
  bankCode: string;
  ifscCode: string;
  micrCode: string;
  address: string;
  country: string;
  contactName: string;
  contactNumber: string;
  contactEmail: string;
};

type BankForm = Omit<Bank, "id">;

const blankForm: BankForm = {
  itemCode: "",
  itemType: "Bank",
  description: "",
  bankName: "",
  organization: "Axiom",
  accountNumber: "",
  accountName: "",
  accountType: "Current Account",
  ibanCode: "",
  swiftCode: "",
  branch: "",
  bankCode: "",
  ifscCode: "",
  micrCode: "",
  address: "",
  country: "Qatar",
  contactName: "",
  contactNumber: "",
  contactEmail: "",
};

const initialBanks: Bank[] = [
  {
    id: 145,
    itemCode: "BNK000001",
    itemType: "Bank",
    description: "Standard Chartered",
    bankName: "Standard Chartered",
    organization: "Axiom",
    accountNumber: "54543243252",
    accountName: "Standard Chartered",
    accountType: "Current Account",
    ibanCode: "",
    swiftCode: "",
    branch: "Doha",
    bankCode: "BNK000001",
    ifscCode: "",
    micrCode: "",
    address: "",
    country: "Qatar",
    contactName: "",
    contactNumber: "",
    contactEmail: "",
  },
  {
    id: 146,
    itemCode: "BNK000002",
    itemType: "Bank",
    description: "Central Bank",
    bankName: "CBQ",
    organization: "Axiom",
    accountNumber: "343253465423",
    accountName: "Central Bank",
    accountType: "Current Account",
    ibanCode: "",
    swiftCode: "",
    branch: "Doha",
    bankCode: "BNK000002",
    ifscCode: "",
    micrCode: "",
    address: "",
    country: "Qatar",
    contactName: "",
    contactNumber: "",
    contactEmail: "",
  },
  {
    id: 147,
    itemCode: "CASHTRNSCTN",
    itemType: "",
    description: "Cash Transaction",
    bankName: "Axiom",
    organization: "Axiom",
    accountNumber: "",
    accountName: "",
    accountType: "Current Account",
    ibanCode: "",
    swiftCode: "",
    branch: "",
    bankCode: "CASHTRNSCTN",
    ifscCode: "",
    micrCode: "",
    address: "",
    country: "Qatar",
    contactName: "",
    contactNumber: "",
    contactEmail: "",
  },
];

type Mode = "list" | "create" | "details" | "edit";

export default function BankDetails() {
  const [banks, setBanks] = useState<Bank[]>(initialBanks);
  const [mode, setMode] = useState<Mode>("list");
  const [selectedId, setSelectedId] = useState<number>(145);
  const [form, setForm] = useState<BankForm>(blankForm);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");

  const selected = banks.find((bank) => bank.id === selectedId) ?? banks[0];

  const filteredBanks = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return banks;
    return banks.filter((bank) =>
      [bank.itemCode, bank.itemType, bank.description, bank.bankName]
        .some((value) => value.toLowerCase().includes(term))
    );
  }, [banks, search]);

  const setField = (field: keyof BankForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const openCreate = () => {
    setForm({ ...blankForm, bankCode: `BNK${String(banks.length + 1).padStart(6, "0")}` });
    setMode("create");
    setNotice("");
  };

  const openEdit = (bank: Bank) => {
    setSelectedId(bank.id);
    const { id: _id, ...rest } = bank;
    setForm(rest);
    setMode("edit");
    setNotice("");
  };

  const openDetails = (bank: Bank) => {
    setSelectedId(bank.id);
    setMode("details");
    setNotice("");
  };

  const saveForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (mode === "edit") {
      setBanks((current) =>
        current.map((bank) => bank.id === selectedId ? { ...bank, ...form } : bank)
      );
      setNotice("Bank details updated.");
      setMode("details");
      return;
    }
    const nextId = Math.max(0, ...banks.map((bank) => bank.id)) + 1;
    const nextBank: Bank = {
      ...form,
      id: nextId,
      itemCode: form.bankCode.trim() || `BNK${String(nextId).padStart(6, "0")}`,
      bankCode: form.bankCode.trim() || `BNK${String(nextId).padStart(6, "0")}`,
    };
    setBanks((current) => [...current, nextBank]);
    setSelectedId(nextId);
    setNotice("Bank details created.");
    setMode("details");
  };

  const deleteBank = (bank: Bank) => {
    if (!window.confirm(`Delete ${bank.itemCode}?`)) return;
    setBanks((current) => current.filter((item) => item.id !== bank.id));
    setNotice(`${bank.itemCode} deleted.`);
  };

  const returnToList = () => {
    setMode("list");
    setNotice("");
  };

  const inputClass =
    "mt-2 block w-full rounded-[3px] border border-[#dce3ee] bg-white px-4 py-[10px] text-[15px] text-[#7caeaa] outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 disabled:bg-[#f0edf6]";
  const labelClass = "block text-[14px] font-normal text-[#151515]";
  const actionClass =
    "inline-flex h-10 items-center justify-center rounded-[3px] px-4 text-sm font-medium text-white transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-offset-1";
  const buttonBlue = `${actionClass} bg-[#08b4e5] focus:ring-sky-300`;
  const buttonDark = `${actionClass} bg-[#2c3e50] focus:ring-slate-300`;

  const FormField = ({
    label,
    field,
    required = false,
    disabled = false,
    multiline = false,
    type = "text",
  }: {
    label: string;
    field: keyof BankForm;
    required?: boolean;
    disabled?: boolean;
    multiline?: boolean;
    type?: string;
  }) => (
    <label className={labelClass}>
      {required && <span className="text-red-500">*</span>} {label}
      {multiline ? (
        <textarea
          className={`${inputClass} min-h-[62px] resize-y`}
          value={form[field]}
          onChange={(event) => setField(field, event.target.value)}
          disabled={disabled}
          rows={2}
        />
      ) : (
        <input
          className={inputClass}
          type={type}
          value={form[field]}
          onChange={(event) => setField(field, event.target.value)}
          disabled={disabled}
          required={required}
        />
      )}
    </label>
  );

  const DetailValue = ({ value }: { value: string }) => (
    <div className={`${inputClass} min-h-[39px]`}>{value || "\u00a0"}</div>
  );

  return (
    <div className="min-h-screen bg-[#f0eef7] text-[#111827]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600&display=swap');
        .bank-page, .bank-page * { font-family: Roboto, Arial, sans-serif; box-sizing: border-box; }
        .bank-table th { background:#aeb5bc; color:#111; font-weight:500; }
        .bank-table th, .bank-table td { border:1px solid #e0e5ee; }
        .bank-table tbody tr:nth-child(even) { background:#faf9fc; }
      `}</style>
      <div className="bank-page">
        <header className="flex h-[62px] items-center justify-between border-b border-[#e4e8ef] bg-white px-8">
          <div className="flex items-center gap-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef5ff] text-[#2875d9]">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 9h18M5 9V20h14V9M3 7l9-4 9 4M9 12v5m6-5v5" />
              </svg>
            </div>
            <span className="text-sm text-[#68758a]">CityOps <span className="mx-2 text-slate-300">›</span> Bank Details</span>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#b8bbc3] text-xs text-white">AK</div>
        </header>

        <main className="mx-auto w-full max-w-[1600px] px-6 py-5 md:px-8">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-2 text-[11px] font-semibold tracking-[0.18em] text-[#2875d9]">CITYOPS · MANAGEMENT</div>
              <h1 className="text-[26px] font-semibold text-[#263f59]">
                {mode === "list" ? "Banks" : mode === "details" ? "Item Type Details" : "Bank Details"}
              </h1>
              <p className="mt-1 text-sm text-[#7b8ba4]">
                {mode === "list" ? "Maintain bank accounts and settlement information." :
                  mode === "details" ? "View saved bank account information." :
                  mode === "edit" ? "Update bank account information." : "Add a bank account and settlement information."}
              </p>
            </div>
            {mode === "list" && (
              <button className={buttonBlue} onClick={openCreate}>+ Create New</button>
            )}
          </div>

          {notice && (
            <div className="mb-4 flex items-center justify-between rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {notice}
              <button className="ml-4 text-lg leading-none" onClick={() => setNotice("")} aria-label="Dismiss">×</button>
            </div>
          )}

          {mode === "list" ? (
            <section className="overflow-hidden rounded-[4px] border border-[#e2e7ef] bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e2e7ef] px-6 py-4">
                <h2 className="text-[17px] font-medium text-[#b12626]">Banks</h2>
                <label className="flex items-center gap-3 text-sm text-[#333]">
                  Search:
                  <input value={search} onChange={(event) => setSearch(event.target.value)} className="h-9 w-52 rounded-[3px] border border-[#dce3ee] px-3 outline-none focus:border-sky-400" />
                </label>
              </div>
              <div className="overflow-x-auto px-6 py-5">
                <div className="mb-3 text-sm text-[#333]">Show <select className="mx-1 rounded border border-[#dce3ee] bg-white px-3 py-1.5 text-[#7b8ba4]"><option>25</option><option>50</option><option>100</option></select> entries</div>
                <table className="bank-table w-full min-w-[780px] border-collapse text-left text-sm">
                  <thead><tr>
                    <th className="px-3 py-3">Item Code <span className="float-right text-slate-600">↕</span></th>
                    <th className="px-3 py-3">Item Type <span className="float-right text-slate-600">↕</span></th>
                    <th className="px-3 py-3">Description <span className="float-right text-slate-600">↕</span></th>
                    <th className="px-3 py-3">Bank Name <span className="float-right text-slate-600">↕</span></th>
                    <th className="w-[190px] px-3 py-3 text-center">Action</th>
                  </tr></thead>
                  <tbody>
                    {filteredBanks.map((bank) => (
                      <tr key={bank.id}>
                        <td className="px-3 py-3">{bank.itemCode}</td>
                        <td className="px-3 py-3">{bank.itemType}</td>
                        <td className="px-3 py-3">{bank.description}</td>
                        <td className="px-3 py-3">{bank.bankName}</td>
                        <td className="px-3 py-2">
                          <div className="flex justify-center gap-1.5">
                            <button title="Edit bank" aria-label={`Edit ${bank.itemCode}`} onClick={() => openEdit(bank)} className="flex h-[27px] w-[30px] items-center justify-center rounded bg-[#00d98b] text-white hover:bg-[#00c47d]">
                              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10M14 4l6 6M9 15l9-9 3 3-9 9-4 1z" /></svg>
                            </button>
                            <button title="View bank details" aria-label={`View ${bank.itemCode}`} onClick={() => openDetails(bank)} className="flex h-[27px] w-[30px] items-center justify-center rounded bg-[#08aee0] text-white hover:bg-[#079bc8]">
                              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 11v5m0-8h.01" /></svg>
                            </button>
                            <button title="Delete bank" aria-label={`Delete ${bank.itemCode}`} onClick={() => deleteBank(bank)} className="flex h-[27px] w-[30px] items-center justify-center rounded bg-[#ff3d3d] text-white hover:bg-[#e92d2d]">
                              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" /></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredBanks.length === 0 && <tr><td colSpan={5} className="px-3 py-8 text-center text-slate-500">No matching banks found.</td></tr>}
                  </tbody>
                </table>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-[#333]">
                  <span>Showing {filteredBanks.length ? 1 : 0} to {filteredBanks.length} of {filteredBanks.length} entries</span>
                  <div className="flex items-center gap-0.5"><button disabled className="rounded border border-[#dce3ee] px-3 py-2 text-slate-300">Previous</button><button className="bg-[#2c3e50] px-4 py-2 text-white">1</button><button disabled className="rounded border border-[#dce3ee] px-3 py-2 text-slate-300">Next</button></div>
                </div>
              </div>
            </section>
          ) : mode === "details" ? (
            <section className="rounded-[4px] border border-[#e2e7ef] bg-white p-6 shadow-sm md:p-8">
              <h2 className="border-b border-[#e1e5eb] pb-5 text-[23px] font-normal text-[#273b50]">Item Type Details</h2>
              <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-4 rounded-md border border-[#e2e7ef] p-5 md:grid-cols-2">
                <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-4"><span className={labelClass}>Organization</span><DetailValue value={selected.organization} /></div>
                <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-4"><span className={labelClass}>Item Code</span><DetailValue value={selected.itemCode} /></div>
                <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-4"><span className={labelClass}>Item Type</span><DetailValue value={selected.description} /></div>
                <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-4"><span className={labelClass}>Account Number</span><DetailValue value={selected.accountNumber} /></div>
                <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-4"><span className={labelClass}>IBAN Code</span><DetailValue value={selected.ibanCode} /></div>
                <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-4"><span className={labelClass}>Account Name</span><DetailValue value={selected.accountName} /></div>
                <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-4"><span className={labelClass}>Account Type</span><DetailValue value={selected.accountType} /></div>
                <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-4"><span className={labelClass}>Bank Name</span><DetailValue value={selected.bankName} /></div>
                <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-4"><span className={labelClass}>IFSC Code</span><DetailValue value={selected.ifscCode} /></div>
                <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-4"><span className={labelClass}>MICR Code</span><DetailValue value={selected.micrCode} /></div>
                <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-4"><span className={labelClass}>Branch</span><DetailValue value={selected.branch} /></div>
                <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-4"><span className={labelClass}>Address</span><DetailValue value={selected.address} /></div>
                <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-4"><span className={labelClass}>Country</span><DetailValue value={selected.country} /></div>
                <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-4"><span className={labelClass}>Contact Name</span><DetailValue value={selected.contactName} /></div>
                <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-4"><span className={labelClass}>Contact Number</span><DetailValue value={selected.contactNumber} /></div>
                <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-4"><span className={labelClass}>Contact Email</span><DetailValue value={selected.contactEmail} /></div>
              </div>
              <div className="mt-6 flex justify-center gap-2">
                <button className={buttonDark} onClick={returnToList}>Return</button>
                <button className={buttonBlue} onClick={() => openEdit(selected)}>Edit</button>
              </div>
            </section>
          ) : (
            <section className="rounded-[4px] border border-[#e2e7ef] bg-white p-6 shadow-sm md:p-8">
              <h2 className="mb-8 text-[17px] font-medium text-[#b12626]">Bank Details</h2>
              <form onSubmit={saveForm}>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-3">
                  <FormField label="Organization" field="organization" required />
                  <FormField label="Account Number" field="accountNumber" required />
                  <FormField label="Account Name" field="accountName" required />
                  <label className={labelClass}>* Account Type
                    <select className={inputClass} value={form.accountType} onChange={(event) => setField("accountType", event.target.value)} required>
                      <option>Current Account</option><option>Savings Account</option><option>Cash</option><option>Other</option>
                    </select>
                  </label>
                  <FormField label="IBAN Code" field="ibanCode" />
                  <FormField label="Swift Code" field="swiftCode" />
                  <FormField label="Bank Name" field="bankName" required />
                  <FormField label="Branch" field="branch" />
                  <FormField label="Bank Code" field="bankCode" disabled />
                  <FormField label="IFSC Code" field="ifscCode" />
                  <FormField label="MICR Code" field="micrCode" />
                  <FormField label="Address" field="address" multiline />
                  <label className={labelClass}>Country
                    <select className={inputClass} value={form.country} onChange={(event) => setField("country", event.target.value)}>
                      <option>Qatar</option><option>India</option><option>United Arab Emirates</option><option>Saudi Arabia</option><option>United Kingdom</option><option>United States</option>
                    </select>
                  </label>
                  <FormField label="Contact Name" field="contactName" />
                  <FormField label="Contact Number" field="contactNumber" />
                  <FormField label="Contact Email" field="contactEmail" type="email" />
                </div>
                <div className="mt-5 flex flex-wrap gap-1">
                  <button type="submit" className={buttonBlue}>Save</button>
                  <button type="button" className={buttonDark} onClick={returnToList}>Cancel</button>
                  <button type="button" className={buttonBlue} onClick={returnToList}>Return</button>
                </div>
              </form>
            </section>
          )}
        </main>
        <footer className="mt-6 bg-white py-6 text-center text-sm text-[#9aa8bc]">Copyright © 2026 - CityApp All rights reserved.</footer>
      </div>
    </div>
  );
}
