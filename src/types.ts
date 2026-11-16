export type Page =
  | 'dashboard' | 'investors' | 'investor-form' | 'agreements' | 'agreement-editor' | 'buildings' | 'building-form'
  | 'investor-relation' | 'tenants' | 'building-rents' | 'building-expenses'
  | 'sources' | 'banks' | 'financial' | 'available' | 'building-cost' | 'owners' | 'investments'
  | 'master-organizations' | 'master-roles' | 'master-users'

export type NavGroup = 'assets' | 'tenant' | 'expenses' | 'financials' | 'reports' | 'master'

export type Investor = { id:string; name:string; type:string; address1:string; address2:string; city:string; phone:string; buildings:number; status:string }
