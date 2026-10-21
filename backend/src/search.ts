import { normalize, type Lang, type Translated } from './i18n.js'

/** Texte de recherche d'une pièce : toutes les langues, sans accents, en minuscules. */
export function buildSearchText(parts: {
  titre: Translated; annee: number; theme?: Translated | null; collection?: Translated | null; motsCles?: Translated<string[]>
}): string {
  const all: string[] = []
  const add = (t?: Translated | null) => t && (Object.keys(t) as Lang[]).forEach((l) => t[l] && all.push(t[l] as string))
  add(parts.titre); add(parts.theme); add(parts.collection)
  all.push(String(parts.annee))
  for (const list of Object.values(parts.motsCles ?? {})) all.push(...(list ?? []))
  return normalize(all.join(' '))
}
