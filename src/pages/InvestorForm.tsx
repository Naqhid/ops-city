import React, { useState } from 'react'
import { ArrowLeft, Building2, Save, UserRound } from 'lucide-react'
import { Investor } from '../types'
import { PageHeader } from '../shared'

export function InvestorForm({ value, onBack, onSave }: { value?: Investor; onBack: () => void; onSave: (investor: Investor) => void }) {
  const editing = Boolean(value)
  const [form, setForm] = useState<Investor>(value || {
    id: '', name: '', type: 'Owner', address1: '', address2: '', city: '', phone: '', buildings: 0, status: 'Active'
  })
  const set = (key: keyof Investor, value: string | number) => setForm(prev => ({ ...prev, [key]: value }))
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const next = { ...form, id: form.id || `INV${String(Date.now()).slice(-6)}` }
    onSave(next)
  }

  return <div className="page-stack">
    <PageHeader
      title={editing ? 'Edit Investor / Owner' : 'Create Investor / Owner'}
      subtitle={editing ? `Update ${value?.name || 'investor'} details.` : 'Create a new property owner or investor.'}
      action={<button className="secondary-btn" onClick={onBack}><ArrowLeft size={16}/> Back</button>}
    />
    <form className="form-stack" onSubmit={submit}>
      <section className="form-card">
        <div className="form-card-head"><span><UserRound size={17}/></span><div><h2>Investor / Owner Details</h2><p>Basic contact and portfolio information.</p></div></div>
        <div className="form-grid three">
          <label className="field-wrap"><span>Investor ID</span><input value={form.id} onChange={e => set('id', e.target.value)} placeholder="INV000001" disabled={editing}/></label>
          <label className="field-wrap"><span><em>*</em>Name</span><input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Name"/></label>
          <label className="field-wrap"><span>Type</span><select value={form.type} onChange={e => set('type', e.target.value)}><option>Investor, Owner</option><option>Investor</option><option>Owner</option></select></label>
          <label className="field-wrap"><span>Phone</span><input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+974 5550 1122"/></label>
          <label className="field-wrap"><span>City</span><input value={form.city} onChange={e => set('city', e.target.value)} placeholder="Doha"/></label>
          <label className="field-wrap"><span>Status</span><select value={form.status} onChange={e => set('status', e.target.value)}><option>Active</option><option>Inactive</option></select></label>
          <label className="field-wrap"><span>Address Line 1</span><input value={form.address1} onChange={e => set('address1', e.target.value)} placeholder="Street / building address"/></label>
          <label className="field-wrap"><span>Address Line 2</span><input value={form.address2} onChange={e => set('address2', e.target.value)} placeholder="Apartment / area / additional address"/></label>
          <label className="field-wrap"><span>Properties</span><input type="number" min="0" value={form.buildings} onChange={e => set('buildings', Number(e.target.value) || 0)}/></label>
        </div>
      </section>
      <div className="inline-actions bottom-actions"><button type="button" className="secondary-btn" onClick={onBack}>Cancel</button><button type="submit" className="primary-btn"><Save size={16}/> {editing ? 'Save changes' : 'Create investor'}</button></div>
    </form>
  </div>
}
