import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Download, FileText, Pencil, Plus, RefreshCw, Search } from 'lucide-react'
import { PageHeader, TableWrap, TableHead, Th, Pagination } from '../shared'
import { api } from '../lib/api'

type AgreementTemplate = {
  AgreementID: number
  TemplateName: string
  TemplateContent: string
  UpdatedAt?: string | null
  CreatedAt?: string | null
}

export function AgreementsPage({ onDraft }: { onDraft: (name: string) => void }) {
  const [rows, setRows] = useState<AgreementTemplate[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await api.list<AgreementTemplate>('agreements', { limit: 100, q: query })
      setRows(response.data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load agreement templates.')
    } finally {
      setLoading(false)
    }
  }, [query])

  useEffect(() => { void load() }, [load])

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(row => row.TemplateName?.toLowerCase().includes(q))
  }, [rows, query])

  const exportCsv = () => {
    const csv = [['Agreement type', 'Last updated'], ...filteredRows.map(r => [r.TemplateName, r.UpdatedAt || r.CreatedAt || ''])]
      .map(line => line.map(value => `"${String(value ?? '').replace(/"/g, '""')}"`).join(',')).join('\r\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url; anchor.download = 'agreement-templates.csv'; anchor.click()
    URL.revokeObjectURL(url)
  }

  return <div className="page-stack">
    <PageHeader title="Contract Agreements" subtitle="Create, maintain and generate agreement templates."
      action={<div className="flex gap-2"><button className="secondary-btn" onClick={exportCsv}><Download size={16}/> Export</button><button className="secondary-btn" onClick={() => void load()}><RefreshCw size={16}/> Refresh</button><button className="primary-btn" onClick={() => onDraft('Building Agreement')}><Plus size={16}/> New template</button></div>} />
    <div className="panel">
      <div className="p-4"><label className="relative block max-w-sm"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60"/><input className="input pl-9" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search agreement templates" /></label></div>
      {error && <div role="alert" className="m-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}<button className="ml-3 underline" onClick={() => void load()}>Retry</button></div>}
      <TableWrap><TableHead><Th>Agreement type</Th><Th>Template status</Th><Th>Last updated</Th><Th>Actions</Th></TableHead><tbody>
        {loading ? <tr><td colSpan={4} className="p-8 text-center">Loading templates…</td></tr> : filteredRows.length === 0 ? <tr><td colSpan={4} className="p-8 text-center">{error ? 'Templates could not be loaded.' : 'No templates found. Create a template to get started.'}</td></tr> : filteredRows.map(row => <tr key={row.AgreementID}>
          <td><div className="table-title"><span className="doc-icon"><FileText size={16}/></span><div><b>{row.TemplateName}</b><small>Saved agreement template</small></div></div></td>
          <td><span className="badge green">Saved</span></td><td>{row.UpdatedAt || row.CreatedAt ? new Date(row.UpdatedAt || row.CreatedAt || '').toLocaleDateString() : '—'}</td>
          <td><button className="template-btn" onClick={() => onDraft(row.TemplateName)}><Pencil size={14}/> Edit Template</button></td>
        </tr>)}
      </tbody></TableWrap><Pagination total={filteredRows.length}/>
    </div>
  </div>
}

const DEFAULT_TEMPLATE = `AGREEMENT\n\nParty 1: [OrganizationName]\nParty 2: [OwnerName]\n\nSubject: Agreement of tenancy contract between [OrganizationName] and [OwnerName] as per the details provided below.\n\nContract start date: [ContractStartDate]\nContract end date: [ContractEndDate]\n\nContract term:\nYear: [ContractYear]\nMonth: [ContractMonth]\nDays: [ContractDays]\n\nDeposit Type:\nMonthly Rent amount: [MonthlyRent]\nSecurity Deposit: [SecurityDeposit]\nW&E Deposit: [W&E_Deposit]\nMaintenance Deposit: [MaintenanceDeposit]\nMiscellaneous: [Miscellaneous]\nOthers: [Others]\n\nThis is a tenancy contract obliged by both the parties.\n\nName: [OrganizationName]                         Name: [OwnerName]\nDate: [CurrentDate]                              Date: [CurrentDate]\nSignature:                                      Signature:`

export function AgreementEditor({ name, onBack }: { name: string; onBack: () => void }) {
  const tags = ['[OrganizationName]', '[TenantName]', '[OwnerName]', '[ContractStartDate]', '[ContractEndDate]', '[ContractYear]', '[ContractMonth]', '[ContractDays]', '[MonthlyRent]', '[SecurityDeposit]', '[W&E_Deposit]', '[MaintenanceDeposit]', '[Miscellaneous]', '[Others]', '[CurrentDate]']
  const [content, setContent] = useState(DEFAULT_TEMPLATE)
  const [templateId, setTemplateId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true); setError(''); setMessage('')
    api.list<AgreementTemplate>('agreements', { limit: 100, q: name })
      .then(response => {
        if (!active) return
        const existing = response.data.find(row => row.TemplateName?.toLowerCase() === name.toLowerCase())
        if (existing) { setTemplateId(existing.AgreementID); setContent(existing.TemplateContent || DEFAULT_TEMPLATE) }
        else { setTemplateId(null); setContent(DEFAULT_TEMPLATE) }
      })
      .catch(e => { if (active) setError(e instanceof Error ? e.message : 'Could not load template from API.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [name])

  const save = async () => {
    setSaving(true); setError(''); setMessage('')
    try {
      const payload = { TemplateName: name, TemplateContent: content }
      if (templateId !== null) await api.update<AgreementTemplate>('agreements', templateId, payload)
      else {
        const response = await api.create<AgreementTemplate>('agreements', payload)
        setTemplateId(response.data.AgreementID)
      }
      setMessage('Template saved to the database.')
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not save template.') }
    finally { setSaving(false) }
  }

  return <div className="page-stack">
    <div className="editor-top"><button className="back-btn" onClick={onBack}>← Back to agreements</button><div><span className="badge blue">{templateId ? 'Saved template' : 'New draft'}</span><b>{name}</b></div><button className="primary-btn" onClick={() => void save()} disabled={saving || loading}><span>✓</span> {saving ? 'Saving…' : 'Save template'}</button></div>
    {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    {message && <div role="status" className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">{message}</div>}
    <div className="editor-layout"><section className="panel editor-panel"><div className="editor-title"><div><div className="eyebrow">TEMPLATE BUILDER</div><h2>{name}</h2></div><span className="badge blue">{loading ? 'Loading…' : templateId ? 'Connected to API' : 'Unsaved draft'}</span></div>
      <div className="editor-toolbar"><button type="button"><b>B</b></button><button type="button"><u>U</u></button><button type="button"><i>I</i></button><span/><button type="button">• List</button><button type="button">1. List</button><button type="button">≡ Align</button><button type="button">↗ Link</button><button type="button">▦ Table</button></div>
      <textarea className="agreement-editor" value={content} onChange={e => setContent(e.target.value)} disabled={loading}/><div className="editor-foot"><span>{message ? 'Saved to backend' : 'Save to persist changes'}</span><span>{content.length} characters</span></div>
    </section><aside className="panel tag-panel"><div className="tag-header"><div><h2>Agreement Tags</h2><p>Click a tag to insert it into the template.</p></div></div><div className="tag-list">{tags.map(tag => <button key={tag} type="button" onClick={() => setContent(c => `${c}${c.endsWith('\n') ? '' : ' '}${tag}`)}>{tag}<Plus size={13}/></button>)}</div><div className="tip"><div><b>Smart placeholders</b><p>Tags are stored as text. Replacing them with real tenant, owner, or contract data requires a separate agreement-generation workflow.</p></div></div></aside></div>
  </div>
}
