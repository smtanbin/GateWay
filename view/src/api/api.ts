const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  })
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText)
    throw new Error(msg || `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Domain {
  domain_id: string
  domain_name: string
  domain_source: string
  domain_target: string
  auth_type: string | null
  auth_header: string | null
  auth_token: string | null
  active: boolean
  created_at: string
  created_by: string
  updated_at: string
  updated_by: string
}

export interface Endpoint {
  id: string
  request_type: string
  endpoint: string
  domain_name: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  user_id: number
  domain_id: string
  auth_token: string
  created_at: string
  last_login: string
  updated_at: string
}

export type CreateDomainInput = Omit<Domain, 'domain_id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>
export type UpdateDomainInput = Partial<CreateDomainInput>

export type CreateEndpointInput = Omit<Endpoint, 'id' | 'created_at' | 'updated_at'>
export type UpdateEndpointInput = Partial<CreateEndpointInput>

// ─── Domains ─────────────────────────────────────────────────────────────────

export const domainsApi = {
  list: () =>
    request<Domain[]>('/admin/domains'),

  get: (id: string) =>
    request<Domain>(`/admin/domains/${id}`),

  create: (data: CreateDomainInput) =>
    request<Domain>('/admin/domains', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateDomainInput) =>
    request<Domain>(`/admin/domains/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  remove: (id: string) =>
    request<void>(`/admin/domains/${id}`, { method: 'DELETE' }),
}

// ─── Endpoints ────────────────────────────────────────────────────────────────

export const endpointsApi = {
  list: () =>
    request<Endpoint[]>('/admin/endpoints'),

  listByDomain: (domainName: string) =>
    request<Endpoint[]>(`/admin/endpoints?domain=${encodeURIComponent(domainName)}`),

  get: (id: string) =>
    request<Endpoint>(`/admin/endpoints/${id}`),

  create: (data: CreateEndpointInput) =>
    request<Endpoint>('/admin/endpoints', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateEndpointInput) =>
    request<Endpoint>(`/admin/endpoints/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  remove: (id: string) =>
    request<void>(`/admin/endpoints/${id}`, { method: 'DELETE' }),
}

// ─── Stats ───────────────────────────────────────────────────────────────────

export interface ServerStats {
  uptime_seconds: number
  goroutines: number
  heap_alloc_mb: number
  heap_sys_mb: number
  gc_runs: number
  domain_count: number
  endpoint_count: number
  user_count: number
}

export const statsApi = {
  get: () => request<ServerStats>('/admin/stats'),
}

// ─── Users ────────────────────────────────────────────────────────────────────

export const usersApi = {
  list: () =>
    request<User[]>('/admin/users'),

  get: (id: string) =>
    request<User>(`/admin/users/${id}`),

  remove: (id: string) =>
    request<void>(`/admin/users/${id}`, { method: 'DELETE' }),
}
