import { useLang, useT } from '../../hooks/useLang'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getPieces, searchPieces } from '../../services/api'
import type { Piece } from '../../types'
import PieceCard from '../../components/PieceCard/PieceCard'
import SearchBar from '../../components/SearchBar/SearchBar'
const fields: [string, string][] = [['tout', 'search.all'], ['titre', 'f.titre'], ['annee', 'f.annee'], ['theme', 'f.theme'], ['valeur', 'f.valeur'], ['motsCles', 'f.motsCles'], ['collection', 'f.collection']]
const pick = (p: Piece, f: string) => f === 'motsCles' ? p.motsCles.join(' ') : String(p[f as keyof Piece] ?? '')
export default function Search() {
  const [params, setParams] = useSearchParams()
  const t = useT()
  const { lang } = useLang()
  const q = params.get('q') ?? ''
  const [field, setField] = useState('tout')
  const [found, setFound] = useState<Piece[]>([])
  const [themes, setThemes] = useState<string[]>([])
  const [error, setError] = useState(false)
  useEffect(() => {
    let live = true
    const timer = setTimeout(() => { // anti-rebond : évite une requête par frappe
      const req = field === 'tout' ? searchPieces(q, lang) : getPieces(lang).then((all) => all.filter((p) => pick(p, field).toLowerCase().includes(q.toLowerCase())))
      req.then((r) => { if (live) { setFound(r); setError(false) } }).catch(() => { if (live) setError(true) })
    }, 250)
    return () => { live = false; clearTimeout(timer) }
  }, [q, field, lang])
  const options = useMemo(() => [...new Set(found.map((p) => p.theme))], [found])
  const results = themes.length ? found.filter((p) => themes.includes(p.theme)) : found
  const toggle = (t: string) => setThemes(themes.includes(t) ? themes.filter((x) => x !== t) : [...themes, t])
  return (
    <main className="mx-auto max-w-7xl px-5 py-8">
      <div className="grid gap-3 md:grid-cols-[1fr_200px]">
        <SearchBar value={q} onChange={(v) => setParams(v ? { q: v } : {})} />
        <label><span className="sr-only">{t('search.by')}</span>
          <select value={field} onChange={(e) => setField(e.target.value)} className="w-full rounded-lg border border-encre/15 bg-white px-3 py-3">
            {fields.map(([v, l]) => <option key={v} value={v}>{t(l)}</option>)}
          </select></label>
      </div>
      <h1 className="mt-8 font-display text-3xl">{t('search.title')}</h1>
      <p aria-live="polite" className="text-sm text-encre/70">{t(results.length > 1 ? 'search.many' : 'search.one', { n: results.length })}{q && ` « ${q} »`}</p>
      <div className="mt-6 grid gap-8 md:grid-cols-[200px_1fr]">
        <aside><fieldset className="rounded-lg border border-encre/10 bg-white p-4">
          <legend className="px-1 font-semibold">{t('filter.theme')}</legend>
          {options.map((t) => <label key={t} className="mt-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={themes.includes(t)} onChange={() => toggle(t)} className="accent-[#175FA7]" />{t}</label>)}
          <button onClick={() => setThemes([])} className="mt-4 text-sm text-terre hover:underline">{t('filter.reset')}</button>
        </fieldset></aside>
        {error && <p role="alert" className="py-8 text-center text-terre">{t('common.error')}</p>}
        {results.length === 0 && !error ? <p className="py-16 text-center">{t('search.none')}</p> :
          <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{results.map((p) => <li key={p.id}><PieceCard piece={p} /></li>)}</ul>}
      </div>
    </main>
  )
}
