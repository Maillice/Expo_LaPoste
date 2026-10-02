import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'
import { getPieces } from '../../services/api'
import type { Piece } from '../../types'
import { useLang, useT } from '../../hooks/useLang'
import PieceImage from '../../components/PieceCard/PieceImage'
export default function Exhibition() {
  const t = useT()
  const { lang } = useLang()
  const [failed, setFailed] = useState(false)
  const [featured, setFeatured] = useState<Piece[]>([])
  useEffect(() => {
    getPieces(lang).then((all) => { const m = all.filter((p) => p.modele3D); setFeatured((m.length >= 3 ? m : all).slice(0, 3)) }).catch(() => setFeatured([]))
  }, [lang])
  const eyebrow = 'text-[.82rem] font-extrabold uppercase tracking-[.14em] text-[#0873b7]'
  return (
    <main className="mx-auto max-w-[1250px] px-[5vw] pb-20 pt-9">
      <span className="inline-flex items-center gap-2 rounded-full bg-[#e8f3fa] px-3 py-2 font-extrabold text-[#075b96]">{lang.toUpperCase()} · {t('expo.badge')}</span>
      <h1 className="rise mb-2.5 mt-4 text-[clamp(2.2rem,5vw,4.5rem)] font-bold leading-[1.05]">{t('expo.title')}</h1>
      <p className="max-w-[900px] text-[clamp(1rem,1.7vw,1.3rem)] leading-relaxed text-[#567183]">{t('expo.subtitle')}</p>
      <div className="mb-3 mt-6 overflow-hidden rounded-[26px] bg-[#082e4b] shadow-[0_20px_55px_rgba(7,65,104,.2)]">
        {!failed
          ? <video key={lang} controls playsInline preload="metadata" src={`/media/video-${lang}.mp4`} onError={() => setFailed(true)} aria-label={t('expo.videoTitle')} className="block max-h-[650px] w-full bg-[#001d31]" />
          : (
            <div className="relative grid aspect-[16/8.5] min-h-[260px] place-items-center bg-[radial-gradient(circle_at_50%_40%,#1c85bd,#062f50_70%)] p-6 text-center text-white">
              <div>
                <span aria-hidden className="mx-auto grid h-[82px] w-[82px] place-items-center rounded-full bg-or text-[#14384e] shadow-[0_12px_35px_rgba(0,0,0,.3)]"><Play size={32} /></span>
                <h2 className="mb-2 mt-5 text-2xl font-bold">{t('expo.videoTitle')}</h2>
                <p>{t('expo.videoNote')}</p>
              </div>
              <p className="absolute inset-x-5 bottom-5 text-sm text-white/70">media/video-{lang}.mp4</p>
            </div>
          )}
      </div>
      <Link to="/catalogue" className="text-sm font-semibold text-bleu underline">{t('expo.skip')} →</Link>
      <div className="mb-8 mt-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div><p className={eyebrow}>{t('expo.after')}</p><h2 className="mt-2 text-[clamp(2rem,4vw,3.3rem)] font-bold leading-tight">{t('expo.pieces')}</h2></div>
        <p className="max-w-[700px] leading-[1.7] text-[#4f6578]">{t('expo.piecesLead')}</p>
      </div>
      <ul className="grid gap-5 md:grid-cols-3">
        {featured.map((p) => (
          <li key={p.id} className="overflow-hidden rounded-[20px] border border-[#dce7ef] bg-white shadow-[0_12px_30px_rgba(20,58,80,.08)]">
            <PieceImage bare src={p.miniature ?? p.image} alt={p.titre} value={p.valeur} className="w-full" />
            <div className="p-[18px]">
              <h3 className="mb-1.5 font-bold">{p.titre}</h3><p className="mb-4 text-[#4f6578]">{p.annee} · {p.valeur} F</p>
              <Link to={`/viewer-3d/${p.id}`} className="block w-full rounded-[10px] bg-bleu py-3 text-center font-extrabold text-white hover:bg-bleu2">{t('piece.3d')}</Link>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-10 text-center"><Link to="/catalogue" className="inline-block rounded-xl bg-or px-6 py-4 font-black text-[#173a50] shadow-lg hover:brightness-105">{t('expo.catalogue')} →</Link></div>
    </main>
  )
}
