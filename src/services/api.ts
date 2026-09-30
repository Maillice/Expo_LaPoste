// Seul point d'accès aux données. Les composants n'appellent jamais fetch directement.
// Contrat attendu du backend : voir docs/API.md
import type { Collection, Lang, Piece } from '../types'
import { mockPieces } from '../data/mockPieces'
import { mockCollections } from '../data/mockCollections'
import { ApiError, http, useMock } from './http'
const delay = <T,>(v: T, ms = 150) => new Promise<T>((r) => setTimeout(() => r(v), ms))
// Adaptateurs : à ajuster ici si les champs du backend diffèrent des types du frontend.
const toPiece = (d: Piece): Piece => d
const toCollection = (d: Collection): Collection => d
const orUndefined = (e: unknown) => { if (e instanceof ApiError && e.status === 404) return undefined; throw e }

export async function getPieces(lang: Lang = 'fr'): Promise<Piece[]> {
  if (useMock) return delay(mockPieces)
  return (await http<Piece[]>('/pieces', lang)).map(toPiece)
}
export async function getPieceById(id: string, lang: Lang = 'fr'): Promise<Piece | undefined> {
  if (useMock) return delay(mockPieces.find((p) => p.id === id))
  return http<Piece>(`/pieces/${encodeURIComponent(id)}`, lang).then(toPiece).catch(orUndefined)
}
export async function getPiecesByCollection(collectionId: string, lang: Lang = 'fr'): Promise<Piece[]> {
  if (useMock) return delay(mockPieces.filter((p) => p.collection === collectionId))
  return (await http<Piece[]>('/pieces', lang, { collection: collectionId })).map(toPiece)
}
export async function searchPieces(query: string, lang: Lang = 'fr'): Promise<Piece[]> {
  if (useMock) {
    const q = query.trim().toLowerCase()
    return delay(mockPieces.filter((p) => [p.titre, p.theme, String(p.annee), ...p.motsCles].join(' ').toLowerCase().includes(q)))
  }
  return (await http<Piece[]>('/pieces', lang, { q: query.trim() })).map(toPiece)
}
export async function getCollections(lang: Lang = 'fr'): Promise<Collection[]> {
  if (useMock) return delay(mockCollections)
  return (await http<Collection[]>('/collections', lang)).map(toCollection)
}
export async function getCollectionById(id: string, lang: Lang = 'fr'): Promise<Collection | undefined> {
  if (useMock) return delay(mockCollections.find((c) => c.id === id))
  return http<Collection>(`/collections/${encodeURIComponent(id)}`, lang).then(toCollection).catch(orUndefined)
}

// ---- Catalogue : filtres et pagination côté serveur ----
export interface PieceQuery { q?: string; theme?: string; collection?: string; anneeMin?: number; anneeMax?: number; valeurMin?: number; valeurMax?: number; page?: number; limit?: number }
export interface Page<T> { items: T[]; total: number }
export async function queryPieces(query: PieceQuery, lang: Lang = 'fr'): Promise<Page<Piece>> {
  const { page = 1, limit = 8 } = query
  if (useMock) {
    const q = (query.q ?? '').trim().toLowerCase()
    const all = mockPieces.filter((p) =>
      (!q || [p.titre, p.theme, String(p.annee), ...p.motsCles].join(' ').toLowerCase().includes(q)) &&
      (!query.theme || p.theme === query.theme) && (!query.collection || p.collection === query.collection) &&
      (query.anneeMin === undefined || p.annee >= query.anneeMin) && (query.anneeMax === undefined || p.annee <= query.anneeMax) &&
      (query.valeurMin === undefined || p.valeur >= query.valeurMin) && (query.valeurMax === undefined || p.valeur <= query.valeurMax))
    return delay({ items: all.slice((page - 1) * limit, page * limit), total: all.length })
  }
  const params: Record<string, string | undefined> = {}
  for (const [k, v] of Object.entries({ ...query, page, limit })) if (v !== undefined && v !== '') params[k] = String(v)
  const r = await http<Piece[] | Page<Piece>>('/pieces', lang, params)
  // Réponse préférée : { items, total }. Un simple tableau est accepté (sans pagination serveur).
  return Array.isArray(r) ? { items: r.map(toPiece), total: r.length } : { items: r.items.map(toPiece), total: r.total }
}
export async function getThemes(lang: Lang = 'fr'): Promise<string[]> {
  if (useMock) return delay([...new Set(mockPieces.map((p) => p.theme))])
  return http<string[]>('/themes', lang)
}
