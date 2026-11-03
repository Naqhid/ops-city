/** CityOps API client. Configure VITE_API_URL in .env.local. */
const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:4000/api").replace(/\/$/, "");
export class ApiError extends Error { status: number; constructor(message: string, status: number) { super(message); this.status = status; } }
export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path.startsWith("/") ? path : `/${path}`}`, {
    ...init, headers: { Accept: "application/json", ...(init.body ? { "Content-Type": "application/json" } : {}), ...(localStorage.getItem("cityops_token") ? { Authorization: `Bearer ${localStorage.getItem("cityops_token")}` } : {}), ...init.headers },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(body.error || body.message || `Request failed (${response.status})`, response.status);
  return body as T;
}
export const api = {
  health: () => apiRequest<{status:string;database:string;service:string}>("/health"),
  list: <T>(resource: string, query: Record<string,string|number|undefined> = {}) => { const qs = new URLSearchParams(); Object.entries(query).forEach(([k,v])=>{if(v!==undefined&&v!=="")qs.set(k,String(v))}); return apiRequest<{data:T[];pagination?:{page:number;limit:number;total:number;totalPages:number}}>(`/${encodeURIComponent(resource)}${qs.size?`?${qs}`:""}`); },
  get: <T>(resource:string,id:string|number) => apiRequest<{data:T}>(`/${encodeURIComponent(resource)}/${encodeURIComponent(String(id))}`),
  create: <T>(resource:string,data:unknown) => apiRequest<{data:T}>(`/${encodeURIComponent(resource)}`,{method:"POST",body:JSON.stringify(data)}),
  update: <T>(resource:string,id:string|number,data:unknown) => apiRequest<{data:T}>(`/${encodeURIComponent(resource)}/${encodeURIComponent(String(id))}`,{method:"PUT",body:JSON.stringify(data)}),
  remove: (resource:string,id:string|number) => apiRequest<{success:boolean}>(`/${encodeURIComponent(resource)}/${encodeURIComponent(String(id))}`,{method:"DELETE"}),
};

export async function listResource<T>(resource: string): Promise<T[]> {
  const response = await api.list<T>(resource);
  return response.data || [];
}

export async function createResource<T>(resource: string, data: unknown): Promise<T> {
  const response = await api.create<T>(resource, data);
  return response.data || (response as T);
}

export async function updateResource<T>(resource: string, id: string | number, data: unknown): Promise<T> {
  const response = await api.update<T>(resource, id, data);
  return response.data || (response as T);
}

export async function deleteResource(resource: string, id: string | number): Promise<void> {
  await api.remove(resource, id);
}
