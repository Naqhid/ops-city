export const buildings = [
  { code: 'BLD000001', name: 'South End', type: 'Residential', category: 'Gated Community', categoryName: '', address: 'Zone 4, Doha', floors: 2, units: 4, available: 1, status: 'Active', electricity: '', water: '' },
  { code: 'BLD000002', name: 'West End', type: 'Commercial', category: '', categoryName: '', address: '', floors: 0, units: 0, available: 0, status: 'Active', electricity: '', water: '' },
]
export const investors = [
  { id: 'INV000001', name: 'Suleman', type: 'Investor, Owner', address1: 'Test Axiom 988', address2: '', city: 'Waqah', phone: '+974 5550 1122', buildings: 1, status: 'Active' },
  { id: 'INV000002', name: 'Axiom Holdings', type: 'Owner', address1: 'Axiom Tower', address2: 'West Bay', city: 'Doha', phone: '+974 4440 2200', buildings: 2, status: 'Active' },
]
export const tenants = [
  { code: 'BLD000001', building: 'South End', type: 'Residential', category: 'Gated Community', address: 'Zone 4, Doha', status: 'Active', electricity: '' },
  { code: 'BLD000002', building: 'West End', type: 'Commercial', category: '', address: '', status: 'Active', electricity: '' },
]
export const rentRows = [
  { code: 'BLD000001', building: 'South End', type: 'Residential', category: 'Gated Community', address: 'Zone 4, Doha', lat: '3345.776', lng: '4453.998', status: 'Active', electricity: '', water: '' },
  { code: 'BLD000002', building: 'West End', type: 'Commercial', category: '', address: '', lat: '', lng: '', status: 'Active', electricity: '', water: '' },
]
export const sourceRows = [
  { code: 'DR000001', description: 'Rent from Tenant', status: 'Active', date: '11-12-2023' },
  { code: 'DR000002', description: 'E&W from Tenant', status: 'Active', date: '11-12-2023' },
  { code: 'DR000003', description: 'Maintenance cost from Tenant', status: 'Active', date: '11-12-2023' },
  { code: 'DR000004', description: 'General/Other', status: 'Active', date: '11-12-2023' },
  { code: 'DR000005', description: 'Investment', status: 'Active', date: '11-12-2023' },
]

export const renewalData = {
  buildings: [
    { building: 'South End', code: 'BLD000002', person: 'Suleman', date: '11/02/2024' },
    { building: 'South End', code: 'BLD000002', person: 'Suleman', date: '10/03/2026' },
    { building: 'West End', code: 'BLD000002', person: 'Suleman', date: '20/09/2026' },
  ],
  rents: [
    { building: 'South End', unit: 'G1', person: 'Suleman', date: '18/02/2026' },
    { building: 'South End', unit: 'G1', person: 'kdsjkdsa', date: '12/10/2023' },
    { building: 'South End', unit: 'F1', person: 'Jacob Andrews', date: '03/03/2026' },
    { building: 'South End', unit: 'F1', person: 'Jacob Andrews', date: '03/03/2027' },
  ],
  leases: [],
}
