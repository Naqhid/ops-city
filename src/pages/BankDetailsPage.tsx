import React, { useMemo, useState, useEffect, useCallback } from "react";
import { banksApi, Bank } from "../api/client";
import { PageHeader, TableWrap, TableHead, Th, Pagination, PageLoader } from "../shared";
import { Plus, Search, Pencil, Eye, Trash2, ArrowLeft, Save } from "lucide-react";

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

type Mode = "list" | "create" | "details" | "edit";

export default function BankDetailsPage() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("list");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState<BankForm>(blankForm);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");

  // Fetch banks from API
  const fetchBanks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await banksApi.list({ q: search, limit: 100 });
      setBanks(response.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch banks';
      setError(/unknown resource|doesn't exist|does not exist|no such table|table .* doesn't exist/i.test(message)
        ? 'The backend/database does not currently provide the Bank table required by this page. Add the Bank table migration, then retry.'
        : message);
      console.error('Error fetching banks:', err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  // Fetch single bank by ID
  const fetchBankById = useCallback(async (id: number) => {
    try {
      const response = await banksApi.get(id);
      return response.data;
    } catch (err) {
      console.error('Error fetching bank:', err);
      return null;
    }
  }, []);

  useEffect(() => {
    fetchBanks();
  }, [fetchBanks]);

  const selected = useMemo(() => {
    if (selectedId === null) return null;
    return banks.find((bank) => bank.id === selectedId) ?? null;
  }, [banks, selectedId]);

  const filteredBanks = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return banks;
    return banks.filter((bank) =>
      [bank.itemCode, bank.itemType, bank.description, bank.bankName]
        .some((value) => value?.toLowerCase().includes(term))
    );
  }, [banks, search]);

  const setField = useCallback((field: keyof BankForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  }, []);

  const openCreate = useCallback(() => {
    setForm({ ...blankForm, bankCode: `BNK${String(banks.length + 1).padStart(6, "0")}` });
    setMode("create");
    setNotice("");
  }, [banks.length]);

  const openEdit = useCallback(async (bank: Bank) => {
    setSelectedId(bank.id);
    const { id: _id, ...rest } = bank;
    setForm(rest);
    setMode("edit");
    setNotice("");
  }, []);

  const openDetails = useCallback((bank: Bank) => {
    setSelectedId(bank.id);
    setMode("details");
    setNotice("");
  }, []);

  const saveForm = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (mode === "edit" && selectedId !== null) {
        const updatedBank = await banksApi.update(selectedId, form);
        setNotice("Bank details updated.");
        setMode("details");
        // Refresh the list
        await fetchBanks();
        return;
      }
      // Create new bank
      const createdBank = await banksApi.create(form);
      setSelectedId(createdBank.data.id);
      setNotice("Bank details created.");
      setMode("details");
      // Refresh the list
      await fetchBanks();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Failed to save bank');
      console.error('Error saving bank:', err);
    }
  }, [mode, selectedId, form, fetchBanks]);

  const deleteBank = useCallback(async (bank: Bank) => {
    if (!window.confirm(`Delete ${bank.itemCode}?`)) return;
    try {
      await banksApi.delete(bank.id);
      setNotice(`${bank.itemCode} deleted.`);
      // Refresh the list
      await fetchBanks();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Failed to delete bank');
      console.error('Error deleting bank:', err);
    }
  }, [fetchBanks]);

  const returnToList = useCallback(() => {
    setMode("list");
    setNotice("");
    setSelectedId(null);
  }, []);

  const refreshList = useCallback(() => {
    fetchBanks();
  }, [fetchBanks]);

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
    <label className="field-wrap">
      <span>{required && <em>*</em>}{label}</span>
      {multiline ? (
        <textarea
          value={form[field]}
          onChange={(event) => setField(field, event.target.value)}
          disabled={disabled}
          rows={2}
        />
      ) : (
        <input
          type={type}
          value={form[field]}
          onChange={(event) => setField(field, event.target.value)}
          disabled={disabled}
          required={required}
        />
      )}
    </label>
  );

  if (loading && mode === "list" && banks.length === 0) {
    return <div className="page-stack"><PageLoader /></div>;
  }

  if (error) {
    return (
      <div className="page-stack">
        <PageHeader title="Bank Details" subtitle="Maintain bank accounts and settlement information." />
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <strong>Error:</strong> {error}{" "}
          <button type="button" className="ml-3 underline" onClick={refreshList}>Retry</button>
        </div>
      </div>
    );
  }

  const titles: Record<Mode, { title: string; subtitle: string }> = {
    list: { title: "Banks", subtitle: "Maintain bank accounts and settlement information." },
    details: { title: "Item Type Details", subtitle: "View saved bank account information." },
    create: { title: "Bank Details", subtitle: "Add a bank account and settlement information." },
    edit: { title: "Bank Details", subtitle: "Update bank account information." },
  };

  const detailFields: [string, string][] = selected ? [
    ["Organization", selected.organization],
    ["Item Code", selected.itemCode],
    ["Item Type", selected.description],
    ["Account Number", selected.accountNumber],
    ["IBAN Code", selected.ibanCode],
    ["Account Name", selected.accountName],
    ["Account Type", selected.accountType],
    ["Bank Name", selected.bankName],
    ["IFSC Code", selected.ifscCode],
    ["MICR Code", selected.micrCode],
    ["Branch", selected.branch],
    ["Address", selected.address],
    ["Country", selected.country],
    ["Contact Name", selected.contactName],
    ["Contact Number", selected.contactNumber],
    ["Contact Email", selected.contactEmail],
  ] : [];

  return (
    <div className="page-stack">
      <PageHeader
        title={titles[mode].title}
        subtitle={titles[mode].subtitle}
        action={mode === "list"
          ? <button className="primary-btn" onClick={openCreate} disabled={loading}><Plus size={16}/> Create New</button>
          : <button className="secondary-btn" onClick={returnToList} disabled={loading}><ArrowLeft size={16}/> Back</button>}
      />

      {notice && (
        <div role="status" className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {notice}
          <button type="button" className="ml-4 text-lg leading-none" onClick={() => setNotice("")} aria-label="Dismiss">×</button>
        </div>
      )}

      {mode === "list" ? (
        <section className="panel">
          <div className="panel-head" style={{ marginBottom: 14 }}>
            <div><h2>Bank accounts</h2><p>Registered banks available for settlements and payments.</p></div>
            <label className="search"><Search size={15}/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search banks" disabled={loading}/></label>
          </div>
          <TableWrap>
            <TableHead><Th>Item Code</Th><Th>Item Type</Th><Th>Description</Th><Th>Bank Name</Th><Th>Action</Th></TableHead>
            <tbody>
              {filteredBanks.map((bank) => (
                <tr key={bank.id}>
                  <td><b style={{ color: '#293b57' }}>{bank.itemCode}</b></td>
                  <td>{bank.itemType}</td>
                  <td>{bank.description}</td>
                  <td>{bank.bankName}</td>
                  <td>
                    <div className="row-actions">
                      <button title="Edit bank" aria-label={`Edit ${bank.itemCode}`} onClick={() => openEdit(bank)} disabled={loading}><Pencil size={14}/></button>
                      <button title="View bank details" aria-label={`View ${bank.itemCode}`} onClick={() => openDetails(bank)} disabled={loading}><Eye size={14}/></button>
                      <button title="Delete bank" aria-label={`Delete ${bank.itemCode}`} onClick={() => deleteBank(bank)} style={{ color: '#d64545' }} disabled={loading}><Trash2 size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBanks.length === 0 && <tr><td className="empty-row" colSpan={5}>No banks found.{search ? ' Try clearing your search.' : ''}</td></tr>}
            </tbody>
          </TableWrap>
          <Pagination total={filteredBanks.length} />
        </section>
      ) : mode === "details" && selected ? (
        <section className="panel">
          <div className="panel-head" style={{ marginBottom: 18 }}>
            <div><h2>{selected.itemCode}</h2><p>{selected.bankName} · {selected.accountName}</p></div>
            <span className="badge blue">{selected.itemType || 'Bank'}</span>
          </div>
          <div className="form-grid three">
            {detailFields.map(([label, value]) => (
              <label className="field-wrap" key={label}><span>{label}</span><input readOnly value={value || ''}/></label>
            ))}
          </div>
          <div className="inline-actions" style={{ justifyContent: 'flex-end', marginTop: 18 }}>
            <button className="secondary-btn" onClick={returnToList} disabled={loading}><ArrowLeft size={15}/> Return</button>
            <button className="primary-btn" onClick={() => openEdit(selected)} disabled={loading}><Pencil size={15}/> Edit</button>
          </div>
        </section>
      ) : (
        <section className="panel">
          <form onSubmit={saveForm}>
            <div className="panel-head" style={{ marginBottom: 18 }}>
              <div><h2>{mode === "edit" ? "Edit bank account" : "New bank account"}</h2><p>{mode === "edit" ? `Updating ${selected?.itemCode || 'bank'} details.` : "Fill in the bank and settlement information."}</p></div>
            </div>
            <div className="form-grid three">
              <FormField label="Organization" field="organization" required />
              <FormField label="Account Number" field="accountNumber" required />
              <FormField label="Account Name" field="accountName" required />
              <label className="field-wrap"><span><em>*</em>Account Type</span>
                <select value={form.accountType} onChange={(event) => setField("accountType", event.target.value)} required disabled={loading}>
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
              <label className="field-wrap"><span>Country</span>
                <select value={form.country} onChange={(event) => setField("country", event.target.value)} disabled={loading}>
                  <option>Qatar</option><option>India</option><option>United Arab Emirates</option><option>Saudi Arabia</option><option>United Kingdom</option><option>United States</option>
                </select>
              </label>
              <FormField label="Contact Name" field="contactName" />
              <FormField label="Contact Number" field="contactNumber" />
              <FormField label="Contact Email" field="contactEmail" type="email" />
            </div>
            <div className="inline-actions" style={{ justifyContent: 'flex-end', marginTop: 18 }}>
              <button type="button" className="secondary-btn" onClick={returnToList} disabled={loading}><ArrowLeft size={15}/> Cancel</button>
              <button type="submit" className="primary-btn" disabled={loading}><Save size={15}/> {loading ? 'Saving…' : 'Save'}</button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
