/**
 * Shared API adapters for CityOps pages. All calls go to the configured backend
 * and never silently fall back to demo data. Resource names must match backend/src/resources.js.
 */
import { api } from './client';

export type ApiRecord = Record<string, unknown> & { [key: string]: unknown };
export const cityOpsResources = {
  investors: 'investors', buildings: 'buildings', owners: 'owners',
  organizations: 'organizations', floors: 'floors', units: 'units',
  tenants: 'tenants', rentals: 'rentals', investorRelations: 'investor-relations',
  buildingPortfolios: 'building-portfolios', costs: 'costs', unitPricing: 'unit-pricing',
  sources: 'sources', banks: 'banks', investments: 'investments',
} as const;

export async function listRecords<T extends ApiRecord = ApiRecord>(resource: string, q = ''): Promise<T[]> {
  const result = await api.list<T>(resource, { limit: 100, ...(q ? { q } : {}) });
  return result.data;
}
export async function createRecord<T extends ApiRecord = ApiRecord>(resource: string, values: Record<string, unknown>): Promise<T> {
  const result = await api.create<T, Record<string, unknown>>(resource, values);
  return result.data;
}
export async function updateRecord<T extends ApiRecord = ApiRecord>(resource: string, id: string | number, values: Record<string, unknown>): Promise<T> {
  const result = await api.update<T, Record<string, unknown>>(resource, id, values);
  return result.data;
}
export async function deleteRecord(resource: string, id: string | number): Promise<void> {
  await api.delete(resource, id);
}
export async function getDashboardSummary() {
  return apiRequest<{ data: { investors:number; buildings:number; tenants:number; investorRelations:number; costEntries:number; rentalEntries:number; totalInvestment:number; totalRent:number; totalCost:number } }>('/dashboard/summary');
}
import { apiRequest } from '../lib/api';
