import { useLang, useT } from '../../hooks/useLang'
import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Maximize, Move, RotateCcw, RotateCw, ZoomIn } from 'lucide-react'
import { getPieceById } from '../../services/api'
import type { Piece } from '../../types'
import PieceImage from '../../components/PieceCard/PieceImage'
const ModelViewer = lazy(() => import('../../components/ModelViewer/ModelViewer'))
class Boundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}
export default function Viewer3D() {
  const { id = '' } = useParams()
  const t = useT()
  const { lang } = useLang()
  const box = useRef<HTMLDivElement>(null)
  const [piece, setPiece] = useState<Piece | undefined | null>(null)
  const [resetKey, setResetKey] = useState(0)
  useEffect(() => { getPieceById(id, lang).then(setPiece).catch(() => setPiece(undefined)) }, [id, lang])
  if (piece === null) return <main className="grid min-h-screen place-items-center bg-nuit text-white">{t('common.loading')}</main>
  if (!piece) return <main className="grid min-h-screen place-items-center bg-nuit text-white"><Link to="/catalogue" className="underline">{t('viewer.notfound')}</Link></main>
  const fallback = (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
      <PieceImage src={piece.image} alt={piece.titre} value={piece.valeur} priority className="w-56" />
      <div aria-hidden className="-mt-2 h-5 w-72 rounded-full bg-white/10 blur-sm" />
      <p role="status" className="rounded bg-white/10 px-4 py-2 text-center text-sm">{t('viewer.unavailable')}</p>
    </div>
  )
  const btn = 'flex items-center gap-2 rounded bg-white/10 px-3 py-2 text-sm hover:bg-white/20'
  return (
    <main ref={box} className="flex min-h-screen flex-col bg-nuit text-white">
      <div className="flex items-center justify-between p-4">
        <Link to={`/catalogue/${piece.id}`} className={btn}><ArrowLeft size={16} aria-hidden />{t('viewer.back')}</Link>
        <div className="flex gap-2">
          {piece.modele3D && <button className={btn} onClick={() => setResetKey(resetKey + 1)}><RotateCcw size={16} aria-hidden />{t('viewer.reset')}</button>}
          <button className={btn} onClick={() => box.current?.requestFullscreen?.()}><Maximize size={16} aria-hidden />{t('viewer.fs')}</button>
        </div>
      </div>
      <div className="min-h-[60vh] flex-1">
        {piece.modele3D
          ? <Boundary fallback={fallback}><Suspense fallback={<p className="p-10 text-center">{t('viewer.loading')}</p>}><ModelViewer key={resetKey} url={piece.modele3D} /></Suspense></Boundary>
          : fallback}
      </div>
      <ul className="mx-auto flex w-full max-w-md justify-around px-4 pb-4 text-xs text-white/80" aria-label={t('viewer.controls')}>
        {[[RotateCw, 'viewer.rotate'], [ZoomIn, 'viewer.zoom'], [Move, 'viewer.pan']].map(([Icon, l]) => { const I = Icon as typeof Move; return <li key={l as string} className="flex flex-col items-center gap-1"><I size={22} aria-hidden />{t(l as string)}</li> })}
      </ul>
      <footer className="mx-4 mb-4 flex items-center gap-4 rounded-lg bg-white/10 p-4 text-sm">
        <PieceImage src={piece.miniature ?? piece.image} alt="" className="w-12 shrink-0" />
        <div><p className="font-display text-lg">{piece.titre}</p><p className="text-white/70">{piece.annee} · {t('viewer.collection')} : {piece.collectionNom ?? piece.collection}</p></div>
      </footer>
    </main>
  )
}
