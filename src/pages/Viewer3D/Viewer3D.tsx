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
      <PieceImage src={piece.image} alt={piece.titre} value={piece.valeur} priority className="w-48 md:w-56" />
      <p role="status" className="rounded-lg bg-white/80 px-4 py-2 text-center text-sm text-encre">{t('viewer.unavailable')}</p>
    </div>
  )
  const btn = 'flex items-center gap-2 rounded-full bg-[#edf3f7] px-4 py-2 text-sm font-semibold hover:bg-[#dfe9f0]'
  return (
    <main ref={box} className="flex min-h-screen items-center justify-center bg-[#05202f] p-4 md:p-6">
      <div className="relative w-full max-w-[900px] rounded-3xl bg-white p-5 text-encre md:p-6">
        <div className="mb-3 flex items-center justify-between gap-2">
          <Link to={`/catalogue/${piece.id}`} className={btn}><ArrowLeft size={16} aria-hidden />{t('viewer.back')}</Link>
          <div className="flex gap-2">
            {piece.modele3D && <button className={btn} onClick={() => setResetKey(resetKey + 1)}><RotateCcw size={16} aria-hidden />{t('viewer.reset')}</button>}
            <button className={btn} onClick={() => box.current?.requestFullscreen?.()}><Maximize size={16} aria-hidden />{t('viewer.fs')}</button>
          </div>
        </div>
        <p className="text-[.82rem] font-extrabold uppercase tracking-[.14em] text-[#0873b7]">{t('viewer.title')}</p>
        <h1 className="mb-1 mt-2 text-2xl font-bold">{piece.titre}</h1>
        <p className="mb-4 text-[#718394]">{piece.annee} · {piece.valeur} F · {piece.collectionNom ?? piece.collection}</p>
        <div className="h-[390px] overflow-hidden rounded-[18px] bg-[radial-gradient(circle,#dff0f8,#9abbd0)] md:h-[500px]">
          {piece.modele3D
            ? <Boundary fallback={fallback}><Suspense fallback={<p className="p-10 text-center">{t('viewer.loading')}</p>}><ModelViewer key={resetKey} url={piece.modele3D} /></Suspense></Boundary>
            : fallback}
        </div>
        <p className="mt-3 text-center text-[#63788a]">{t('viewer.tip')}</p>
        <ul className="mt-3 flex justify-around text-xs text-[#63788a]" aria-label={t('viewer.controls')}>
          {[[RotateCw, 'viewer.rotate'], [ZoomIn, 'viewer.zoom'], [Move, 'viewer.pan']].map(([Icon, l]) => { const I = Icon as typeof Move; return <li key={l as string} className="flex items-center gap-1.5"><I size={16} aria-hidden />{t(l as string)}</li> })}
        </ul>
      </div>
    </main>
  )
}
