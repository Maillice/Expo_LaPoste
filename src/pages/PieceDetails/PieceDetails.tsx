import { useLang, useT } from '../../hooks/useLang'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Box, ChevronRight } from 'lucide-react'
import { getPieceById } from '../../services/api'
import type { Piece } from '../../types'
import PieceImage from '../../components/PieceCard/PieceImage'
import MediaPlayer from '../../components/MediaPlayer/MediaPlayer'
export default function PieceDetails() {
  const { id = '' } = useParams()
  const t = useT()
  const { lang } = useLang()
  const [piece, setPiece] = useState<Piece | undefined | null>(null)
  const [error, setError] = useState(false)
  useEffect(() => { setPiece(null); setError(false); getPieceById(id, lang).then(setPiece).catch(() => setError(true)) }, [id, lang])
  const facts = piece ? [['piece.year', piece.annee], ['piece.value', `${piece.valeur} F`], ['piece.theme', piece.theme], ['piece.collection', piece.collectionNom ?? piece.collection], ['piece.id', piece.identifiant]] : []
  return (
    <main>
      <div className="mx-auto max-w-6xl px-5 py-8">
        <nav aria-label={t('piece.breadcrumb')} className="flex items-center gap-1 text-sm text-encre/70">
          <Link to="/" className="hover:underline">{t('nav.home')}</Link><ChevronRight size={14} aria-hidden />
          <Link to="/catalogue" className="hover:underline">{t('nav.catalogue')}</Link><ChevronRight size={14} aria-hidden />
          <span aria-current="page">{piece ? piece.titre : t('piece.crumb')}</span>
        </nav>
        {error && <p role="alert" className="py-20 text-center text-terre">{t('common.error')}</p>}
        {piece === null && !error && <p className="py-20 text-center">{t('common.loading')}</p>}
        {piece === undefined && <p className="py-20 text-center">{t('piece.notfound')} <Link to="/catalogue" className="underline">{t('piece.back')}</Link></p>}
        {piece && (
          <>
            <div className="mt-8 grid gap-10 md:grid-cols-2">
              <PieceImage src={piece.image} alt={piece.titre} value={piece.valeur} priority className="mx-auto w-full max-w-sm" />
              <div>
                <h1 className="font-display text-3xl md:text-4xl">{piece.titre}</h1>
                <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
                  {facts.map(([k, v]) => <div key={k} className="contents"><dt className="text-encre/60">{t(String(k))} :</dt><dd className="font-semibold">{v}</dd></div>)}
                </dl>
                <p className="mt-6">{piece.description}</p>
                <Link to={`/viewer-3d/${piece.id}`} className="mt-6 inline-flex items-center gap-2 rounded border border-or bg-or/15 px-5 py-3 font-semibold text-nuit hover:bg-or/30"><Box size={18} aria-hidden />{t('piece.3d')}</Link>
              </div>
            </div>
            <section className="mt-14 max-w-3xl"><h2 className="font-display text-2xl">{t('piece.history')}</h2><p className="mt-3 leading-relaxed">{piece.contexte}</p></section>
            <div className="mt-12 grid gap-10 md:grid-cols-2">
              <section><h2 className="font-display text-2xl">{t('piece.listen')}</h2><div className="mt-3"><MediaPlayer type="audio" src={piece.audio} titre={`Commentaire audio : ${piece.titre}`} /></div></section>
              <section><h2 className="font-display text-2xl">{t('piece.watch')}</h2><div className="mt-3"><MediaPlayer type="video" src={piece.video} titre={`Commentaire vidéo : ${piece.titre}`} /></div></section>
            </div>
            <section className="mt-12"><h2 className="font-display text-2xl">{t('piece.keywords')}</h2>
              <ul className="mt-3 flex flex-wrap gap-2">{piece.motsCles.map((m) => <li key={m}><Link to={`/recherche?q=${encodeURIComponent(m)}`} className="rounded-full bg-nuit/10 px-3 py-1 text-sm hover:bg-nuit/20">{m}</Link></li>)}</ul>
            </section>
            <section className="mt-12 border-t border-encre/10 pt-6"><h2 className="font-display text-2xl">{t('piece.refs')}</h2>
              <ul className="mt-3 list-disc pl-5 text-sm text-encre/80"><li>La Poste Burkina Faso, Catalogue {piece.annee} (référence fictive)</li><li>Timbres d'Afrique, édition 2020 (référence fictive)</li></ul>
            </section>
          </>
        )}
      </div>
    </main>
  )
}
