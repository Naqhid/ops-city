import { useCallback, useEffect, useMemo, useState } from 'react'
import { Download, RefreshCw } from 'lucide-react'
import { PageHeader, TableWrap, TableHead, Th } from '../shared'
import { api } from '../api/client'

type DbRow = Record<string, unknown>

type BuildingRow = {
  id: string
  name: string
  code: string
  floors: number
  totalUnits: number
  availableUnits: number
  unitNumbers: string
}

const text = (value: unknown) => value == null ? '' : String(value)
const num = (value: unknown) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function exportCsv(rows: BuildingRow[]) {
  const header = ['Name', 'Building Code', 'Total Floors', 'Total Units', 'Available Units', 'Unit Numbers']
  const csvRows = rows.map(row => [
    row.name, row.code, String(row.floors), String(row.totalUnits),
    String(row.availableUnits), row.unitNumbers
  ])
  const csv = [header, ...csvRows]
    .map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(','))
    .join('\r\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'available-buildings.csv'
  link.click()
  URL.revokeObjectURL(url)
}

export function AvailablePage() {
  const [buildings, setBuildings] = useState<DbRow[]>([])
  const [units, setUnits] = useState<DbRow[]>([])
  const [tenants, setTenants] = useState<DbRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [buildingResponse, unitResponse, tenantResponse] = await Promise.all([
        api.list<DbRow>('buildings', { limit: 100 }),
        api.list<DbRow>('units', { limit: 100 }),
        api.list<DbRow>('tenants', { limit: 100 }),
      ])
      setBuildings(buildingResponse.data ?? [])
      setUnits(unitResponse.data ?? [])
      setTenants(tenantResponse.data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load available buildings from the API.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load() }, [load, refreshKey])

  const rows = useMemo<BuildingRow[]>(() => {
    return buildings.map((building, index) => {
      const buildingId = text(building.BuildingID ?? building.id)
      const buildingName = text(building.BuildingName ?? building.Name ?? building.name) || `Building ${index + 1}`
      const buildingCode = text(building.BlCode ?? building.BuildingCode ?? building.code)
      const relatedUnits = units.filter(unit => {
        const unitBuildingId = text(unit.BuildingID ?? unit.Building_BuildingID)
        const unitBuildingName = text(unit.BuildingName)
        const unitBuildingCode = text(unit.BuildingCode)
        return (buildingId && unitBuildingId && unitBuildingId === buildingId)
          || (buildingName && unitBuildingName && unitBuildingName.toLowerCase() === buildingName.toLowerCase())
          || (buildingCode && unitBuildingCode && unitBuildingCode.toLowerCase() === buildingCode.toLowerCase())
      })
      const occupiedUnitIds = new Set(
        tenants
          .filter(tenant => {
            const status = text(tenant.Status).toLowerCase()
            return status !== 'inactive' && status !== 'cancelled' && status !== 'vacant'
          })
          .map(tenant => text(tenant.UnitID))
          .filter(Boolean)
      )
      const available = relatedUnits.filter(unit => {
        const unitId = text(unit.UnitID ?? unit.id)
        return !unitId || !occupiedUnitIds.has(unitId)
      })
      return {
        id: buildingId || buildingCode || `${index}`,
        name: buildingName,
        code: buildingCode || '—',
        floors: num(building.NoofFloors ?? building.TotalFloors),
        totalUnits: relatedUnits.length,
        availableUnits: available.length,
        unitNumbers: available.map(unit => text(unit.UnitName ?? unit.UnitCode ?? unit.UnitID)).filter(Boolean).join(', ') || '—',
      }
    })
  }, [buildings, units, tenants])

  const filteredRows = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return rows
    return rows.filter(row => [row.name, row.code, row.unitNumbers].some(value => value.toLowerCase().includes(term)))
  }, [rows, query])

  return <div className="page-stack">
    <PageHeader
      title="Available Buildings"
      subtitle="A live view of units available across the portfolio."
      action={<div className="flex gap-2">
        <button className="secondary-btn" onClick={() => setRefreshKey(value => value + 1)} disabled={loading}>
          <RefreshCw size={16} /> Refresh
        </button>
        <button className="secondary-btn" onClick={() => exportCsv(filteredRows)} disabled={loading || filteredRows.length === 0}>
          <Download size={16} /> Export
        </button>
      </div>}
    />
    <div className="panel">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4">
        <label className="text-sm">Search buildings
          <input
            className="ml-3 rounded border border-slate-200 px-3 py-2 text-sm"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Name, code or unit"
          />
        </label>
        <span className="text-sm text-slate-500">{filteredRows.length} building(s)</span>
      </div>
      {error && <div role="alert" className="mx-4 mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
        <p>{error}</p>
        <button className="mt-2 underline" onClick={() => setRefreshKey(value => value + 1)}>Try again</button>
      </div>}
      <TableWrap>
        <TableHead>{['Name', 'Building Code', 'Total Floors', 'Total Units', 'Available Units', 'Unit Numbers'].map(header => <Th key={header}>{header}</Th>)}</TableHead>
        <tbody>
          {loading ? <tr><td colSpan={6} className="p-8 text-center text-slate-500">Loading buildings from the server…</td></tr>
            : filteredRows.length === 0 ? <tr><td colSpan={6} className="p-8 text-center text-slate-500">No buildings found.</td></tr>
            : filteredRows.map(row => <tr key={row.id}>
              <td><b>{row.name}</b></td>
              <td>{row.code}</td>
              <td>{row.floors}</td>
              <td>{row.totalUnits}</td>
              <td><span className={row.availableUnits > 0 ? 'badge green' : 'badge'}>{row.availableUnits}</span></td>
              <td>{row.unitNumbers}</td>
            </tr>)}
        </tbody>
      </TableWrap>
    </div>
  </div>
}

export const AvailableBuildingsPage = AvailablePage
export default AvailablePage
