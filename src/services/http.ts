import type { Lang } from '../types'
const BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '')
/** Sans VITE_API_URL, l'application utilise les données mockées. */
export const useMock = !BASE
export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message) }
}
export async function http<T>(path: string, lang: Lang, params: Record<string, string | undefined> = {}): Promise<T> {
  const url = new URL(`${BASE}${path}`, window.location.origin)
  for (const [k, v] of Object.entries(params)) if (v) url.searchParams.set(k, v)
  const res = await fetch(url, { headers: { Accept: 'application/json', 'Accept-Language': lang } })
  if (!res.ok) throw new ApiError(res.status, `${res.status} ${res.statusText}`)
  return res.json() as Promise<T>
}
