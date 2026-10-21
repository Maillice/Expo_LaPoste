import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Play } from 'lucide-react'
import { useLang, useT } from '../../hooks/useLang'
export default function Exhibition() {
  const t = useT()
  const { lang } = useLang()
  const [failed, setFailed] = useState(false)
  const nav = useNavigate()
  return (
    <main className="mx-auto max-w-[1250px] px-[5vw] pb-20 pt-9">
      <span className="inline-flex items-center gap-2 rounded-full bg-[#e8f3fa] px-3 py-2 font-extrabold text-[#1C63B7]">{lang.toUpperCase()} · {t('expo.badge')}</span>
      <h1 className="rise mb-2.5 mt-4 text-[clamp(2.2rem,5vw,4.5rem)] font-bold leading-[1.05]">{t('expo.title')}</h1>
      <p className="max-w-[900px] text-[clamp(1rem,1.7vw,1.3rem)] leading-relaxed text-[#567183]">{t('expo.subtitle')}</p>
      <div className="mb-3 mt-6 overflow-hidden rounded-[26px] bg-[#1C63B7] shadow-[0_20px_55px_rgba(7,65,104,.2)]">
        {!failed
          ? <video key={lang} controls playsInline preload="metadata" src={`/media/video-${lang}.mp4`} onEnded={() => nav('/catalogue')} onError={() => setFailed(true)} aria-label={t('expo.videoTitle')} className="block max-h-[650px] w-full bg-[#000000]" />
          : (
            <div className="relative grid aspect-[16/8.5] min-h-[260px] place-items-center bg-[radial-gradient(circle_at_50%_40%,#0C8DD7,#1C63B7_70%)] p-6 text-center text-white">
              <div>
                <span aria-hidden className="mx-auto grid h-[82px] w-[82px] place-items-center rounded-full bg-or text-[#14384e] shadow-[0_12px_35px_rgba(0,0,0,.3)]"><Play size={32} /></span>
                <h2 className="mb-2 mt-5 text-2xl font-bold">{t('expo.videoTitle')}</h2>
                <p>{t('expo.videoNote')}</p>
              </div>
              <p className="absolute inset-x-5 bottom-5 text-sm text-white/70">media/video-{lang}.mp4</p>
            </div>
          )}
      </div>
      <Link to="/catalogue" className="inline-block rounded-xl border border-bleu px-5 py-3 text-sm font-semibold text-bleu hover:bg-bleu hover:text-white">{t('expo.skip')}</Link>
    </main>
  )
}
