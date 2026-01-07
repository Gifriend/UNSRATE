import { PUBLIC_API_BASE_URL } from "$env/static/public";

// Helper untuk mengambil cookie di client-side (browser)
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

type FetchOptions = RequestInit & {
  params?: Record<string, string>;
};

// Fungsi pengganti 'api.get', 'api.post', dll
async function customFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, headers, ...rest } = options;
  
  // 1. Handle URL & Query Params
  const url = new URL(`${PUBLIC_API_BASE_URL}/${endpoint}`.replace(/([^:]\/)\/+/g, "$1"));
  if (params) {
    Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
  }

  // 2. Handle Auth Token (Pengganti Interceptor)
  const token = getCookie("access_token");
  const authHeaders: Record<string, string> = token 
    ? { Authorization: `Bearer ${token}` } 
    : {};

  // 3. Eksekusi Request
  const response = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...(headers as Record<string, string>),
    },
    ...rest,
  });

  // 4. Handle Error (Axios otomatis throw error jika status != 2xx, fetch tidak)
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `HTTP Error ${response.status}`);
  }

  // 5. Return Data
  return response.json() as Promise<T>;
}

// Export object yang mirip dengan struktur Axios Anda sebelumnya
export const api = {
  get: <T>(endpoint: string, params?: Record<string, string>) => 
    customFetch<T>(endpoint, { method: "GET", params }),
    
  post: <T>(endpoint: string, body: any) => 
    customFetch<T>(endpoint, { method: "POST", body: JSON.stringify(body) }),
    
  put: <T>(endpoint: string, body: any) => 
    customFetch<T>(endpoint, { method: "PUT", body: JSON.stringify(body) }),
    
  delete: <T>(endpoint: string) => 
    customFetch<T>(endpoint, { method: "DELETE" }),
};