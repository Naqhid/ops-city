import React, { useCallback, useEffect, useState } from 'react'
import { Pencil, Plus, Trash2, X } from 'lucide-react'
import { apiRequest } from '../lib/api'
import { TableWrap, TableHead, Th } from '../shared'

export type AuthUser = { id: number | string; email: string; username: string; name: string; role: string; organizationId?: number | null; organizationName?: string | null }

type Org = { OrganizationID: number; Name: string; OrgCode?: string; City?: string; Country?: string; Phone?: string; Email?: string; Status?: number; Currency?: string; PayFreq?: string; AddLine1?: string; AddLine2?: string; Website?: string; pContactName?: string; pContactEmail?: string; pContactPhone?: string; sContactName?: string; sContactEmail?: string; sContactPhone?: string }
type Role = { id: number; name: string; description: string | null; is_system: number }
type User = { id: number; email: string; username: string; display_name: string | null; role: string; organization_id: number | null; is_active: number }

const master = {
  list: <T,>(r: string) => apiRequest<{ data: T[] }>(`/master/${r}`).then(x => x.data),
  save: (r: string, id: number | null, body: unknown) => apiRequest(`/master/${r}${id ? `/${id}` : ''}`, { method: id ? 'PUT' : 'POST', body: JSON.stringify(body) }),
  remove: (r: string, id: number) => apiRequest(`/master/${r}/${id}`, { method: 'DELETE' }),
}

function useList<T>(resource: string) {
  const [rows, setRows] = useState<T[]>([]); const [error, setError] = useState(''); const [loading, setLoading] = useState(true)
  const reload = useCallback(() => { setLoading(true); master.list<T>(resource).then(r => { setRows(r); setError('') }).catch(e => setError(e.message)).finally(() => setLoading(false)) }, [resource])
  useEffect(reload, [reload])
  return { rows, error, setError, loading, reload }
}

function Modal({ title, onClose, onSave, saving, error, children }: { title: string; onClose: () => void; onSave: () => void; saving: boolean; error: string; children: React.ReactNode }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
    <div className="modal" role="dialog" aria-modal="true" aria-label={title} style={{ width: 'min(640px,100%)', maxHeight: '90vh', overflow: 'auto' }}>
      <div className="modal-head"><h2>{title}</h2><button type="button" onClick={onClose} aria-label="Close"><X size={20} /></button></div>
      <div className="modal-body" style={{ display: 'grid', gap: 12 }}>{error && <div role="alert" style={{ color: '#b91c1c', fontSize: 14 }}>{error}</div>}{children}</div>
      <div className="modal-foot"><button type="button" className="secondary-btn" onClick={onClose}>Cancel</button><button type="button" className="primary-btn" onClick={onSave} disabled={saving}>{saving ? 'Savingâ€¦' : 'Save'}</button></div>
    </div></div>
}
function Input({ label, value, onChange, type = 'text', disabled = false, required = false }: { label: string; value: string | number | null | undefined; onChange?: (v: string) => void; type?: string; disabled?: boolean; required?: boolean }) {
  return <label style={{ display: 'grid', gap: 4, fontSize: 13, fontWeight: 600, color: '#344256' }}>{label}{required && <span style={{ color: '#d14343' }}> *</span>}
    <input type={type} value={value ?? ''} disabled={disabled} onChange={e => onChange?.(e.target.value)} style={{ padding: '9px 10px', border: '1px solid #cfd8e6', borderRadius: 6, fontWeight: 400 }} /></label>
}
function Select({ label, value, onChange, options, disabled = false }: { label: string; value: string | number | null | undefined; onChange: (v: string) => void; options: [string | number, string][]; disabled?: boolean }) {
  return <label style={{ display: 'grid', gap: 4, fontSize: 13, fontWeight: 600, color: '#344256' }}>{label}
    <select value={value ?? ''} disabled={disabled} onChange={e => onChange(e.target.value)} style={{ padding: '9px 10px', border: '1px solid #cfd8e6', borderRadius: 6, fontWeight: 400 }}>{options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
}
const Head = ({ title, onAdd, addLabel }: { title: string; onAdd?: () => void; addLabel: string }) =>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}><h2 style={{ color: '#b91c1c', fontSize: 17, fontWeight: 600, margin: 0 }}>{title}</h2>{onAdd && <button className="primary-btn" onClick={onAdd}><Plus size={15} /> {addLabel}</button>}</div>

function useSave(resource: string, close: () => void, reload: () => void) {
  const [saving, setSaving] = useState(false); const [error, setError] = useState('')
  const run = async (id: number | null, body: unknown) => { setSaving(true); setError(''); try { await master.save(resource, id, body); close(); reload() } catch (e) { setError(e instanceof Error ? e.message : 'Could not save') } finally { setSaving(false) } }
  return { saving, error, run }
}
async function confirmDelete(resource: string, id: number, what: string, setError: (m: string) => void, reload: () => void) {
  if (!window.confirm(`Delete ${what}? This cannot be undone.`)) return
  try { await master.remove(resource, id); reload() } catch (e) { setError(e instanceof Error ? e.message : 'Could not delete') }
}

/* ---------------- Organizations ---------------- */
export function OrganizationsPage({ currentUser }: { currentUser: AuthUser | null }) {
  const isAdmin = currentUser?.role === 'admin'
  const { rows, error, setError, loading, reload } = useList<Org>('organizations')
  const [edit, setEdit] = useState<Partial<Org> | null>(null)
  const save = useSave('organizations', () => setEdit(null), reload)
  const set = (k: keyof Org) => (v: string) => setEdit(e => ({ ...e, [k]: v }))
  return <div className="page-stack"><section className="panel" style={{ padding: 24 }}>
    <Head title="Manage Organizations" addLabel="New Organization" onAdd={isAdmin ? () => setEdit({ Status: 1 }) : undefined} />
    {error && <div role="alert" style={{ color: '#b91c1c', marginBottom: 12 }}>{error}</div>}
    <TableWrap><TableHead><Th>Code</Th><Th>Name</Th><Th>City</Th><Th>Country</Th><Th>Pay Frequency</Th><Th>Status</Th>{isAdmin && <Th>Action</Th>}</TableHead>
      <tbody>{rows.map(o => <tr key={o.OrganizationID}><td>{o.OrgCode}</td><td>{o.Name}</td><td>{o.City}</td><td>{o.Country}</td><td>{o.PayFreq}</td><td>{o.Status === 0 ? 'Inactive' : 'Active'}</td>
        {isAdmin && <td style={{ whiteSpace: 'nowrap' }}><button className="edit-btn" onClick={() => setEdit(o)}><Pencil size={14} /> Edit</button> <button className="edit-btn" onClick={() => confirmDelete('organizations', o.OrganizationID, o.Name, setError, reload)}><Trash2 size={14} /> Delete</button></td>}</tr>)}
        {!rows.length && <tr><td colSpan={7}>{loading ? 'Loadingâ€¦' : 'No organizations found.'}</td></tr>}</tbody></TableWrap>
  </section>
    {edit && <Modal title={edit.OrganizationID ? 'Edit Organization' : 'New Organization'} onClose={() => setEdit(null)} saving={save.saving} error={save.error} onSave={() => save.run(edit.OrganizationID ?? null, edit)}>
      <Input label="Name" required value={edit.Name} onChange={set('Name')} /><Input label="Organization code" value={edit.OrgCode} onChange={set('OrgCode')} />
      <Input label="Address line 1" value={edit.AddLine1} onChange={set('AddLine1')} /><Input label="Address line 2" value={edit.AddLine2} onChange={set('AddLine2')} />
      <Input label="City" value={edit.City} onChange={set('City')} /><Input label="Country" value={edit.Country} onChange={set('Country')} />
      <Input label="Currency (e.g. QAR)" value={edit.Currency} onChange={set('Currency')} /><Input label="Phone" value={edit.Phone} onChange={set('Phone')} /><Input label="Email" value={edit.Email} onChange={set('Email')} /><Input label="Website" value={edit.Website} onChange={set('Website')} />
      <Select label="Payment frequency" value={edit.PayFreq ?? ''} onChange={set('PayFreq')} options={[['', 'â€”'], ['Monthly', 'Monthly'], ['Quarterly', 'Quarterly'], ['Half Yearly', 'Half Yearly'], ['Yearly', 'Yearly']]} />
      <Input label="Primary contact name" value={edit.pContactName} onChange={set('pContactName')} /><Input label="Primary contact email" value={edit.pContactEmail} onChange={set('pContactEmail')} /><Input label="Primary contact phone" value={edit.pContactPhone} onChange={set('pContactPhone')} />
      <Select label="Status" value={edit.Status ?? 1} onChange={set('Status')} options={[[1, 'Active'], [0, 'Inactive']]} />
    </Modal>}
  </div>
}

/* ---------------- Roles ---------------- */
export function RolesPage({ currentUser }: { currentUser: AuthUser | null }) {
  const isAdmin = currentUser?.role === 'admin'
  const { rows, error, setError, loading, reload } = useList<Role>('roles')
  const [edit, setEdit] = useState<Partial<Role> | null>(null)
  const save = useSave('roles', () => setEdit(null), reload)
  return <div className="page-stack"><section className="panel" style={{ padding: 24 }}>
    <Head title="Manage Roles" addLabel="New Role" onAdd={isAdmin ? () => setEdit({}) : undefined} />
    {error && <div role="alert" style={{ color: '#b91c1c', marginBottom: 12 }}>{error}</div>}
    <TableWrap><TableHead><Th>Role</Th><Th>Description</Th><Th>Type</Th>{isAdmin && <Th>Action</Th>}</TableHead>
      <tbody>{rows.map(r => <tr key={r.id}><td>{r.name}</td><td>{r.description}</td><td>{r.is_system ? 'System' : 'Custom'}</td>
        {isAdmin && <td style={{ whiteSpace: 'nowrap' }}>{!r.is_system && <><button className="edit-btn" onClick={() => setEdit(r)}><Pencil size={14} /> Edit</button> <button className="edit-btn" onClick={() => confirmDelete('roles', r.id, r.name, setError, reload)}><Trash2 size={14} /> Delete</button></>}</td>}</tr>)}
        {!rows.length && <tr><td colSpan={4}>{loading ? 'Loadingâ€¦' : 'No roles found.'}</td></tr>}</tbody></TableWrap>
    <p style={{ color: '#7a8799', fontSize: 12, marginTop: 14 }}>Access rules: admin sees all organizations; org_admin manages users and data of one organization; manager reads and writes one organization's data; viewer is read-only. Custom roles currently have manager-level data access.</p>
  </section>
    {edit && <Modal title={edit.id ? 'Edit Role' : 'New Role'} onClose={() => setEdit(null)} saving={save.saving} error={save.error} onSave={() => save.run(edit.id ?? null, { name: edit.name, description: edit.description })}>
      <Input label="Role name (lowercase, underscores)" required value={edit.name} onChange={v => setEdit(e => ({ ...e, name: v }))} /><Input label="Description" value={edit.description} onChange={v => setEdit(e => ({ ...e, description: v }))} />
    </Modal>}
  </div>
}

/* ---------------- Users ---------------- */
export function UsersPage({ currentUser }: { currentUser: AuthUser | null }) {
  const isAdmin = currentUser?.role === 'admin'
  const users = useList<User>('users'); const roles = useList<Role>('roles'); const orgs = useList<Org>('organizations')
  const [edit, setEdit] = useState<(Partial<User> & { password?: string }) | null>(null)
  const save = useSave('users', () => setEdit(null), users.reload)
  const orgName = (id: number | null) => orgs.rows.find(o => o.OrganizationID === id)?.Name ?? (id ? `#${id}` : 'â€”')
  const roleOptions: [string, string][] = roles.rows.filter(r => isAdmin || r.name !== 'admin').map(r => [r.name, r.name])
  const set = (k: keyof User | 'password') => (v: string) => setEdit(e => ({ ...e, [k]: v }))
  const startNew = () => setEdit({ role: roleOptions.find(([n]) => n === 'viewer')?.[0] ?? roleOptions[0]?.[0] ?? '', organization_id: isAdmin ? null : currentUser?.organizationId ?? null, is_active: 1 })
  return <div className="page-stack"><section className="panel" style={{ padding: 24 }}>
    <Head title="Manage Users" addLabel="New User" onAdd={startNew} />
    {(users.error || roles.error) && <div role="alert" style={{ color: '#b91c1c', marginBottom: 12 }}>{users.error || roles.error}</div>}
    <TableWrap><TableHead><Th>Name</Th><Th>Email</Th><Th>Username</Th><Th>Organization</Th><Th>Role</Th><Th>Status</Th><Th>Action</Th></TableHead>
      <tbody>{users.rows.map(u => <tr key={u.id}><td>{u.display_name}</td><td>{u.email}</td><td>{u.username}</td><td>{orgName(u.organization_id)}</td><td>{u.role}</td><td>{u.is_active ? 'Active' : 'Inactive'}</td>
        <td style={{ whiteSpace: 'nowrap' }}><button className="edit-btn" onClick={() => setEdit({ ...u, password: '' })}><Pencil size={14} /> Edit</button>{String(u.id) !== String(currentUser?.id) && <> <button className="edit-btn" onClick={() => confirmDelete('users', u.id, u.email, users.setError, users.reload)}><Trash2 size={14} /> Delete</button></>}</td></tr>)}
        {!users.rows.length && <tr><td colSpan={7}>{users.loading ? 'Loadingâ€¦' : 'No users found.'}</td></tr>}</tbody></TableWrap>
  </section>
    {edit && <Modal title={edit.id ? 'Edit User' : 'New User'} onClose={() => setEdit(null)} saving={save.saving} error={save.error} onSave={() => save.run(edit.id ?? null, { ...edit, password: edit.password || undefined })}>
      <Input label="Display name" value={edit.display_name} onChange={set('display_name')} /><Input label="Email" required type="email" value={edit.email} onChange={set('email')} /><Input label="Username (defaults to email)" value={edit.username} onChange={set('username')} />
      <Input label={edit.id ? 'New password (leave blank to keep)' : 'Password (min 8 characters)'} required={!edit.id} type="password" value={edit.password} onChange={set('password')} />
      <Select label="Role" value={edit.role} onChange={set('role')} options={roleOptions} />
      {edit.role !== 'admin' && (isAdmin
        ? <Select label="Organization" value={edit.organization_id ?? ''} onChange={v => setEdit(e => ({ ...e, organization_id: v ? Number(v) : null }))} options={[['', 'Select organization'], ...orgs.rows.map<[number, string]>(o => [o.OrganizationID, o.Name])]} />
        : <Input label="Organization" disabled value={currentUser?.organizationName} />)}
      <Select label="Status" value={edit.is_active ?? 1} onChange={v => setEdit(e => ({ ...e, is_active: Number(v) }))} options={[[1, 'Active'], [0, 'Inactive']]} />
    </Modal>}
  </div>
}
