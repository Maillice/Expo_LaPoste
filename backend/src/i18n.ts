export const LANGS = ['fr', 'mo', 'en'] as const
export type Lang = (typeof LANGS)[number]
export type Translated<T = string> = Partial<Record<Lang, T>>

const isLang = (v: string): v is Lang => (LANGS as readonly string[]).includes(v)

/** Langue demandée : paramètre ?lang=, sinon premier code reconnu de l'en-tête Accept-Language, sinon français. */
export function parseLang(queryLang?: string, header?: string): Lang {
  const q = queryLang?.toLowerCase().slice(0, 2)
  if (q && isLang(q)) return q
  for (const part of (header ?? '').split(',')) {
    const code = part.trim().split(';')[0].toLowerCase().slice(0, 2)
    if (isLang(code)) return code
  }
  return 'fr'
}

/** Texte dans la langue demandée, avec repli sur le français puis sur la première valeur disponible. */
export function pick(value: Translated | null | undefined, lang: Lang): string {
  if (!value) return ''
  return value[lang] || value.fr || Object.values(value).find(Boolean) || ''
}

export function pickList(value: Translated<string[]> | null | undefined, lang: Lang): string[] {
  if (!value) return []
  const list = value[lang]?.length ? value[lang] : value.fr?.length ? value.fr : Object.values(value).find((v) => v?.length)
  return list ?? []
}

/** Minuscules sans accents : sert à la recherche, côté écriture comme côté requête. */
export function normalize(text: string): string {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim()
}
