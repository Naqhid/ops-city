/** CityApp API client. Configure VITE_API_URL in .env.local. */
const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:4000/api").replace(/\/$/, "");
export const authHeaders = (): Record<string,string> => { const tk = localStorage.getItem("cityapp_token"); return tk ? { Authorization: `Bearer ${tk}` } : {}; };
/** A 401 on any request except login means the session is invalid or expired: tell the app to sign out. */
export const UNAUTHORIZED_EVENT = "cityapp:unauthorized";
export function notifyIfUnauthorized(status: number, path: string) {
  if (status === 401 && !path.includes("/auth/login") && localStorage.getItem("cityapp_token")) window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
}
export async function apiUpload<T>(path: string, form: FormData): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { method: "POST", headers: { Accept: "application/json", ...authHeaders() }, body: form });
  const body = await response.json().catch(() => ({}));
  notifyIfUnauthorized(response.status, path);
  if (!response.ok) throw new ApiError(body.error || `Upload failed (${response.status})`, response.status);
  return body as T;
}
export async function apiBlob(path: string): Promise<Blob> {
  const response = await fetch(`${API_BASE}${path}`, { headers: authHeaders() });
  notifyIfUnauthorized(response.status, path);
  if (!response.ok) throw new ApiError(`Could not load file (${response.status})`, response.status);
  return response.blob();
}
export class ApiError extends Error { status: number; body: any; constructor(message: string, status: number, body: any = {}) { super(message); this.status = status; this.body = body; } }
export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path.startsWith("/") ? path : `/${path}`}`, {
    ...init, headers: { Accept: "application/json", ...(init.body ? { "Content-Type": "application/json" } : {}), ...(localStorage.getItem("cityapp_token") ? { Authorization: `Bearer ${localStorage.getItem("cityapp_token")}` } : {}), ...init.headers },
  });
  const body = await response.json().catch(() => ({}));
  notifyIfUnauthorized(response.status, path);
  if (!response.ok) throw new ApiError(body.error || body.message || `Request failed (${response.status})`, response.status, body);
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

export async function listAll<T>(resource: string): Promise<T[]> {
  const out: T[] = [];
  for (let page = 1; page <= 200; page++) {
    const r = await api.list<T>(resource, { page, limit: 100 });
    out.push(...(r.data || []));
    if (!r.pagination || page >= r.pagination.totalPages) break;
  }
  return out;
}
