// API Client for CityOps Frontend
// Connects to backend API at /api/{resource}

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/$/, '');

// Helper to build query string from params object
const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  }
  const query = searchParams.toString();
  return query ? `?${query}` : '';
};

// Generic fetch wrapper with error handling
const apiFetch = async <T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(localStorage.getItem('cityops_token') ? { Authorization: `Bearer ${localStorage.getItem('cityops_token')}` } : {}),
      ...options?.headers,
    },
    credentials: 'include', // For cookies/auth
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || errorData.message || `HTTP ${response.status}`
    );
  }

  return response.json() as Promise<T>;
};

// API Response types
export interface ApiResponse<T> {
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  q?: string; // search query
  sort?: string;
  order?: 'ASC' | 'DESC';
}

// Generic CRUD operations for any resource
export const api = {
  // List all items of a resource
  list: async <T>(
    resource: string,
    params: PaginationParams = {},
    additionalParams: Record<string, any> = {}
  ): Promise<ApiResponse<T[]>> => {
    const query = buildQueryString({ ...params, ...additionalParams });
    return apiFetch<ApiResponse<T[]>>(`/${resource}${query}`);
  },

  // Get a single item by ID
  get: async <T>(resource: string, id: number | string): Promise<ApiResponse<T>> => {
    return apiFetch<ApiResponse<T>>(`/${resource}/${id}`);
  },

  // Create a new item
  create: async <T, U>(
    resource: string,
    data: U
  ): Promise<ApiResponse<T>> => {
    return apiFetch<ApiResponse<T>>(`/${resource}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update an item
  update: async <T, U>(
    resource: string,
    id: number | string,
    data: U
  ): Promise<ApiResponse<T>> => {
    return apiFetch<ApiResponse<T>>(`/${resource}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete an item
  delete: async (resource: string, id: number | string): Promise<{ success: boolean }> => {
    return apiFetch<{ success: boolean }>(`/${resource}/${id}`, {
      method: 'DELETE',
    });
  },

  // Health check
  health: async (): Promise<{ status: string; database: string; service: string }> => {
    return apiFetch<{ status: string; database: string; service: string }>('/health');
  },
};

// Legacy helper functions for backward compatibility
export const apiGet = async <T>(resource: string, params?: Record<string, any>): Promise<T[]> => {
  const response = await api.list<any>(resource, {}, params || {});
  return response.data || [];
};

export const getResource = async <T>(resource: string, params?: Record<string, any>): Promise<T[]> => {
  const response = await api.list<any>(resource, {}, params || {});
  return response.data || [];
};

// Resource-specific clients for type safety
export const banksApi = {
  list: async (params?: PaginationParams): Promise<ApiResponse<Bank[]>> => {
    const response = await api.list<any>('banks', params);
    return {
      ...response,
      data: response.data.map(transformBank),
    };
  },
  get: async (id: number): Promise<ApiResponse<Bank>> => {
    const response = await api.get<any>('banks', id);
    return {
      ...response,
      data: transformBank(response.data),
    };
  },
  create: async (data: Omit<Bank, 'id'>): Promise<ApiResponse<Bank>> => {
    const dbData = transformBankToDb({ ...data, id: 0 });
    const response = await api.create<any, any>('banks', dbData);
    return {
      ...response,
      data: transformBank(response.data),
    };
  },
  update: async (id: number, data: Partial<Omit<Bank, 'id'>>): Promise<ApiResponse<Bank>> => {
    const dbData = transformBankToDb({ ...data, id } as Bank);
    const response = await api.update<any, any>('banks', id, dbData);
    return {
      ...response,
      data: transformBank(response.data),
    };
  },
  delete: (id: number) => api.delete('banks', id),
};

export const investorsApi = {
  list: (params?: PaginationParams) => api.list<any>('investors', params),
  get: (id: string) => api.get<any>('investors', id),
  create: (data: any) => api.create<any, any>('investors', data),
  update: (id: string, data: any) => api.update<any, any>('investors', id, data),
  delete: (id: string) => api.delete('investors', id),
};

export const buildingsApi = {
  list: (params?: PaginationParams) => api.list<any>('buildings', params),
  get: (id: number) => api.get<any>('buildings', id),
  create: (data: any) => api.create<any, any>('buildings', data),
  update: (id: number, data: any) => api.update<any, any>('buildings', id, data),
  delete: (id: number) => api.delete('buildings', id),
};

export const tenantsApi = {
  list: (params?: PaginationParams) => api.list<any>('tenants', params),
  get: (id: number) => api.get<any>('tenants', id),
  create: (data: any) => api.create<any, any>('tenants', data),
  update: (id: number, data: any) => api.update<any, any>('tenants', id, data),
  delete: (id: number) => api.delete('tenants', id),
};

export const organizationsApi = {
  list: (params?: PaginationParams) => api.list<any>('organizations', params),
  get: (id: number) => api.get<any>('organizations', id),
  create: (data: any) => api.create<any, any>('organizations', data),
  update: (id: number, data: any) => api.update<any, any>('organizations', id, data),
  delete: (id: number) => api.delete('organizations', id),
};

export const sourcesApi = {
  list: (params?: PaginationParams) => api.list<any>('sources', params),
  get: (id: string) => api.get<any>('sources', id),
  create: (data: any) => api.create<any, any>('sources', data),
  update: (id: string, data: any) => api.update<any, any>('sources', id, data),
  delete: (id: string) => api.delete('sources', id),
};

// Bank type definition (matches frontend Bank type)
// Maps database columns (PascalCase) to frontend type (camelCase)
export interface Bank {
  id: number;  // Maps to BankID
  itemCode: string;  // Maps to ItemCode
  itemType: string;  // Maps to ItemType
  description: string;  // Maps to Description
  bankName: string;  // Maps to BankName
  organization: string;  // Maps to Organization
  accountNumber: string;  // Maps to AccountNumber
  accountName: string;  // Maps to AccountName
  accountType: string;  // Maps to AccountType
  ibanCode: string;  // Maps to IBANCode
  swiftCode: string;  // Maps to SwiftCode
  branch: string;  // Maps to Branch
  bankCode: string;  // Maps to BankCode
  ifscCode: string;  // Maps to IFSCCode
  micrCode: string;  // Maps to MICRCode
  address: string;  // Maps to Address
  country: string;  // Maps to Country
  contactName: string;  // Maps to ContactName
  contactNumber: string;  // Maps to ContactNumber
  contactEmail: string;  // Maps to ContactEmail
}

// Helper to transform database Bank to frontend Bank (map BankID -> id, etc.)
export const transformBank = (dbBank: any): Bank => {
  return {
    id: dbBank.BankID,
    itemCode: dbBank.ItemCode || '',
    itemType: dbBank.ItemType || '',
    description: dbBank.Description || '',
    bankName: dbBank.BankName || '',
    organization: dbBank.Organization || '',
    accountNumber: dbBank.AccountNumber || '',
    accountName: dbBank.AccountName || '',
    accountType: dbBank.AccountType || '',
    ibanCode: dbBank.IBANCode || '',
    swiftCode: dbBank.SwiftCode || '',
    branch: dbBank.Branch || '',
    bankCode: dbBank.BankCode || '',
    ifscCode: dbBank.IFSCCode || '',
    micrCode: dbBank.MICRCode || '',
    address: dbBank.Address || '',
    country: dbBank.Country || '',
    contactName: dbBank.ContactName || '',
    contactNumber: dbBank.ContactNumber || '',
    contactEmail: dbBank.ContactEmail || '',
  };
};

// Helper to transform frontend Bank to database format
export const transformBankToDb = (bank: Bank): any => {
  return {
    ItemCode: bank.itemCode,
    ItemType: bank.itemType,
    Description: bank.description,
    BankName: bank.bankName,
    Organization: bank.organization,
    AccountNumber: bank.accountNumber,
    AccountName: bank.accountName,
    AccountType: bank.accountType,
    IBANCode: bank.ibanCode,
    SwiftCode: bank.swiftCode,
    Branch: bank.branch,
    BankCode: bank.bankCode,
    IFSCCode: bank.ifscCode,
    MICRCode: bank.micrCode,
    Address: bank.address,
    Country: bank.country,
    ContactName: bank.contactName,
    ContactNumber: bank.contactNumber,
    ContactEmail: bank.contactEmail,
  };
};
