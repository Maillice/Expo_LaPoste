import { useEffect, useState } from 'react'
import { LayoutGrid, List } from 'lucide-react'
import { getCollections, getThemes, queryPieces } from '../../services/api'
import type { Collection, Piece } from '../../types'
import { useLang, useT } from '../../hooks/useLang'
import PieceCard from '../../components/PieceCard/PieceCard'
import SearchBar from '../../components/SearchBar/SearchBar'
import Filters, { emptyFilters, periodRange, valueRange, type FilterState } from '../../components/Filters/Filters'
const PAGE = 8
export default function Catalogue() {
  const t = useT()
  const { lang } = useLang()
  const [items, setItems] = useState<Piece[]>([])
  const [total, setTotal] = useState(0)
  const [themes, setThemes] = useState<string[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [q, setQ] = useState('')
  const [filters, setFilters] = useState<FilterState>(emptyFilters)
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')
  const [page, setPage] = useState(1)
  const [error, setError] = useState(false)
  useEffect(() => {
    Promise.all([getThemes(lang), getCollections(lang)]).then(([th, c]) => { setThemes(th); setCollections(c) }).catch(() => setError(true))
  }, [lang])
  // Filtres et pagination sont envoyés au serveur ; anti-rebond pour la saisie.
  useEffect(() => {
    let live = true
    const timer = setTimeout(() => {
      const [anneeMin, anneeMax] = filters.periode ? periodRange(filters.periode) : [undefined, undefined]
      const [valeurMin, valeurMax] = filters.valeur ? valueRange(filters.valeur) : [undefined, undefined]
      queryPieces({ q, theme: filters.theme || undefined, collection: filters.collection || undefined, anneeMin, anneeMax, valeurMin, valeurMax, page, limit: PAGE }, lang)
        .then((r) => { if (live) { setItems(r.items); setTotal(r.total); setError(false) } })
        .catch(() => { if (live) setError(true) })
    }, 250)
    return () => { live = false; clearTimeout(timer) }
  }, [q, filters, page, lang])
  const changeQ = (v: string) => { setQ(v); setPage(1) }
  const changeFilters = (f: FilterState) => { setFilters(f); setPage(1) }
  const pages = Math.ceil(total / PAGE)
  const tab = (l: 'grid' | 'list') => `rounded p-2 ${layout === l ? 'bg-nuit text-white' : 'hover:bg-encre/10'}`
  return (
    <main>
      <header className="px-5 pb-4 pt-10">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-display text-4xl">{t('cat.title')}</h1>
          <p className="mt-2 text-encre/70">{t('cat.subtitle')}</p>
        </div>
      </header>
      <div className="mx-auto max-w-7xl space-y-4 px-5 py-8">
        <SearchBar value={q} onChange={changeQ} />
        <Filters value={filters} onChange={changeFilters} themes={themes} collections={collections} />
        <div className="flex items-center justify-between">
          <p aria-live="polite" className="text-sm text-encre/70">{t(total > 1 ? 'cat.many' : 'cat.one', { n: total })}</p>
          <div className="flex gap-1">
            <button className={tab('grid')} onClick={() => setLayout('grid')} aria-label={t('cat.grid')} aria-pressed={layout === 'grid'}><LayoutGrid size={18} /></button>
            <button className={tab('list')} onClick={() => setLayout('list')} aria-label={t('cat.list')} aria-pressed={layout === 'list'}><List size={18} /></button>
          </div>
        </div>
        {error && <p role="alert" className="py-8 text-center text-terre">{t('common.error')}</p>}
        {!error && items.length === 0 && <p className="py-16 text-center">{t('cat.empty')}</p>}
        {items.length > 0 && (
          <ul className={layout === 'grid' ? 'grid gap-5 sm:grid-cols-2 lg:grid-cols-4' : 'space-y-3'}>
            {items.map((p) => <li key={p.id}><PieceCard piece={p} layout={layout} /></li>)}
          </ul>
        )}
        {pages > 1 && (
          <nav aria-label={t('cat.pagination')} className="flex justify-center gap-1 pt-4">
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <button key={n} onClick={() => setPage(n)} aria-current={n === page ? 'page' : undefined} className={`h-9 w-9 rounded ${n === page ? 'bg-or font-semibold text-nuit' : 'hover:bg-encre/10'}`}>{n}</button>
            ))}
          </nav>
        )}
      </div>
    </main>
  )
}
