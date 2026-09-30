import { useLang } from '../../hooks/useLang'
import type { Lang } from '../../types'
const items: [Lang, string][] = [['fr', 'FR'], ['mo', 'MO'], ['en', 'EN']]
export default function LanguageSelector() {
  const { lang, setLang } = useLang()
  return (
    <div role="group" aria-label="Langue" className="flex gap-1 text-sm">
      {items.map(([code, label], i) => (
        <span key={code} className="flex items-center gap-1">
          {i > 0 && <span aria-hidden className="opacity-40">|</span>}
          <button onClick={() => setLang(code)} aria-pressed={lang === code} className={lang === code ? 'font-semibold underline decoration-or decoration-2 underline-offset-4' : 'opacity-80 hover:opacity-100'}>{label}</button>
        </span>
      ))}
    </div>
  )
}
