import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Lang } from '../types'
import { fr } from '../i18n/fr'
import { en } from '../i18n/en'
import { mo } from '../i18n/mo'
const dict: Record<Lang, Record<string, string>> = { fr, en, mo }
const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: 'fr', setLang: () => {} })
export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem('lang') as Lang) || 'fr')
  const setLang = (l: Lang) => { localStorage.setItem('lang', l); setLangState(l) }
  useEffect(() => { document.documentElement.lang = lang === 'mo' ? 'mos' : lang }, [lang])
  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>
}
export const useLang = () => useContext(Ctx)
// Traduit une clé ; repli sur le français, puis sur la clé elle-même (valeurs neutres comme « 1914 – 2025 »).
export function useT() {
  const { lang } = useLang()
  return (key: string, vars?: Record<string, string | number>) => {
    let s = dict[lang][key] || fr[key] || key
    for (const k in vars) s = s.replace(`{${k}}`, String(vars[k]))
    return s
  }
}
