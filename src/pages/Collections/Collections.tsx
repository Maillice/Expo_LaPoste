import { useLang, useT } from '../../hooks/useLang'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCollectionById, getCollections, getPiecesByCollection } from '../../services/api'
import type { Collection, Piece } from '../../types'
import PieceImage from '../../components/PieceCard/PieceImage'
import PieceCard from '../../components/PieceCard/PieceCard'
export default function Collections() {
  const { id } = useParams()
  const t = useT()
  const { lang } = useLang()
  const [items, setItems] = useState<Collection[]>([])
  const [current, setCurrent] = useState<Collection | undefined>()
  const [pieces, setPieces] = useState<Piece[]>([])
  const [error, setError] = useState(false)
  useEffect(() => {
    setError(false)
    if (!id) { setCurrent(undefined); getCollections(lang).then(setItems).catch(() => setError(true)); return }
    getCollectionById(id, lang).then(setCurrent).catch(() => setError(true))
    getPiecesByCollection(id, lang).then(setPieces).catch(() => setError(true))
  }, [id, lang])
  return (
    <main>
      <header className="px-5 pb-4 pt-10"><div className="mx-auto max-w-7xl">
        <h1 className="font-display text-4xl">{id ? current?.nom ?? t('coll.one') : t('coll.title')}</h1>
        <p className="mt-2 max-w-xl text-encre/70">{id ? current?.description : t('coll.subtitle')}</p>
      </div></header>
      <div className="mx-auto max-w-7xl px-5 py-10">
        {error && <p role="alert" className="py-8 text-center text-terre">{t('common.error')}</p>}
        {!id ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((c) => (
              <li key={c.id} className="overflow-hidden rounded-lg bg-white shadow-sm">
                <div className="bg-nuit/5 p-6"><PieceImage src={c.couverture} alt="" className="mx-auto w-32" /></div>
                <div className="p-5">
                  <h2 className="font-display text-xl">{c.nom}</h2>
                  <p className="text-sm text-encre/70">{c.periode} · {c.nbPieces} {t('coll.pieces')}</p>
                  <p className="mt-2 text-sm">{c.description}</p>
                  <Link to={`/collections/${c.id}`} className="mt-4 inline-block rounded bg-or px-4 py-2 text-sm font-semibold text-nuit hover:brightness-110">{t('coll.explore')}</Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <>
            <Link to="/collections" className="text-sm underline">{t('coll.all')}</Link>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{pieces.map((p) => <li key={p.id}><PieceCard piece={p} /></li>)}</ul>
            {pieces.length === 0 && <p className="py-10">{t('coll.empty')}</p>}
          </>
        )}
      </div>
    </main>
  )
}
