import React, { useState } from 'react'
import { Check, Pencil, Plus, X } from 'lucide-react'
import { sourceRows } from '../data'
import { PageHeader, TableWrap, TableHead, Th, Field } from '../shared'

type SourceRow = { code: string; description: string; status: string; date: string }

const initialCreditRows: SourceRow[] = [
  { code: 'CR000001', description: 'Rent to landlord / Owner', status: 'Active', date: '11-12-2023' },
  { code: 'CR000002', description: 'Electricity and Water Payment', status: 'Active', date: '11-12-2023' },
  { code: 'CR000003', description: 'Electricity Payment', status: 'Active', date: '11-12-2023' },
  { code: 'CR000004', description: 'Water Payment', status: 'Active', date: '11-12-2023' },
  { code: 'CR000005', description: 'Building Maintenance', status: 'Active', date: '11-12-2023' },
  { code: 'CR000006', description: 'Building Maintenance/ Electrical', status: 'Active', date: '11-12-2023' },
  { code: 'CR000007', description: 'Building Maintenance / Plumbing', status: 'Active', date: '11-12-2023' },
  { code: 'CR000008', description: 'Building Maintenance / Other', status: 'Active', date: '11-12-2023' },
  { code: 'CR000009', description: 'Insurance', status: 'Active', date: '11-12-2023' },
  { code: 'CR000010', description: 'Government Fees', status: 'Active', date: '11-12-2023' },
  { code: 'CR000011', description: 'Commission', status: 'Active', date: '11-12-2023' },
  { code: 'CR000012', description: 'Building Service Tax', status: 'Active', date: '11-12-2023' },
  { code: 'CR000013', description: 'Building Service Tax', status: 'Active', date: '11-12-2023' },
  { code: 'CR000014', description: 'General / Other', status: 'Active', date: '11-12-2023' },
]

function SourceSection({ title, prefix, initialRows, onEdit }: { title: string; prefix: 'CR' | 'DR'; initialRows: SourceRow[]; onEdit: (row: SourceRow) => void }) {
  const [rows, setRows] = useState<SourceRow[]>(initialRows)
  const [description, setDescription] = useState('')
  const [newStatus, setNewStatus] = useState('Active')
  const updateStatus = (code: string, status: string) => setRows(current => current.map(row => row.code === code ? { ...row, status } : row))
  const addRow = () => {
    const value = description.trim()
    if (!value) return
    const next = Math.max(0, ...rows.map(row => Number(row.code.slice(2)) || 0)) + 1
    setRows(current => [...current, { code: `${prefix}${String(next).padStart(6, '0')}`, description: value, status: newStatus, date: new Date().toLocaleDateString('en-GB').replaceAll('/', '-') }])
    setDescription('')
    setNewStatus('Active')
  }
  return <section className="panel" style={{ padding: 24, marginBottom: 24 }}>
    <h2 style={{ color: '#b91c1c', fontSize: 17, fontWeight: 600, margin: '0 0 28px' }}>{title}</h2>
    <TableWrap>
      <TableHead><Th>Source Code</Th><Th>Description</Th><Th>Status</Th><Th>Date</Th><Th>Action</Th></TableHead>
      <tbody>
        {rows.map(row => <tr key={row.code}>
          <td style={{ whiteSpace: 'nowrap' }}>{row.code}</td>
          <td>{row.description}</td>
          <td><select className="inline-select" aria-label={`Status for ${row.code}`} value={row.status} onChange={event => updateStatus(row.code, event.target.value)}><option>Active</option><option>Inactive</option></select></td>
          <td style={{ whiteSpace: 'nowrap' }}>{row.date}</td>
          <td><button className="edit-btn" onClick={() => onEdit(row)}><Pencil size={14} /> Edit</button></td>
        </tr>)}
        <tr>
          <td></td>
          <td><textarea aria-label={`New ${prefix} source description`} value={description} onChange={event => setDescription(event.target.value)} rows={4} style={{ width: '100%', minWidth: 220, border: '1px solid var(--border, #dfe5ef)', borderRadius: 3, padding: 10, resize: 'vertical', background: 'transparent' }} /></td>
          <td><select className="inline-select" value={newStatus} onChange={event => setNewStatus(event.target.value)}><option>Active</option><option>Inactive</option></select></td>
          <td></td>
          <td><button className="primary-btn" onClick={addRow}><Plus size={15} /> Add</button></td>
        </tr>
      </tbody>
    </TableWrap>
  </section>
}

export function SourcesPage({ onEdit, onAdd }: { onEdit: (r: any) => void; onAdd: () => void }) {
  return <div className="page-stack">
    <div className="panel" style={{ padding: 24 }}>
      <div style={{ maxWidth: 250 }}><Field label="Organization" type="select" value="Axiom" /></div>
    </div>
    <SourceSection title="Sources Of Credit" prefix="CR" initialRows={initialCreditRows} onEdit={onEdit} />
    <SourceSection title="Sources Of Debit" prefix="DR" initialRows={sourceRows as SourceRow[]} onEdit={onEdit} />
  </div>
}

export function SourceModal({ value, onClose, onSave }: { value: any; onClose: () => void; onSave: () => void }) {
  const [description, setDescription] = useState(value?.description || '')

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="source-modal-title"
        style={{ width: 'min(620px, 100%)', borderRadius: 12 }}
      >
        <div className="modal-head" style={{ alignItems: 'center', padding: '20px 24px' }}>
          <h2 id="source-modal-title" style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>
            {value?.code === 'NEW' ? 'Add Source' : 'Update Source'}
          </h2>
          <button type="button" onClick={onClose} aria-label="Close" style={{ padding: 4 }}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body" style={{ padding: '24px', gap: 10 }}>
          <label htmlFor="source-description" style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#344256' }}>
            Description <span style={{ color: '#d14343' }}>*</span>
          </label>
          <textarea
            id="source-description"
            value={description}
            onChange={event => setDescription(event.target.value)}
            rows={4}
            autoFocus
            placeholder="Enter source description"
            style={{
              display: 'block', width: '100%', minHeight: 130, boxSizing: 'border-box',
              padding: '13px 14px', border: '1px solid #cfd8e6', borderRadius: 8,
              background: '#fff', color: '#26364d', fontSize: 14, lineHeight: 1.5,
              resize: 'vertical', outlineOffset: 2
            }}
          />
          <p style={{ margin: 0, color: '#7a8799', fontSize: 12 }}>Update the description, then select Save.</p>
        </div>
        <div className="modal-foot" style={{ padding: '14px 24px', gap: 10 }}>
          <button type="button" className="primary-btn" onClick={onSave} disabled={!description.trim()}>
            <Check size={16} /> Save
          </button>
          <button type="button" className="secondary-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

export function ConfirmModal({ onClose }: { onClose: () => void }) {
  return <div className="modal-backdrop"><div className="modal small"><div className="modal-head"><h2>Delete record?</h2><button onClick={onClose} aria-label="Close"><X /></button></div><div className="modal-body"><p>This action cannot be undone. Please confirm that you want to continue.</p></div><div className="modal-foot"><button className="secondary-btn" onClick={onClose}>Cancel</button><button className="danger-btn" onClick={onClose}>Delete</button></div></div></div>
}
