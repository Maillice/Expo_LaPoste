import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Facebook, Instagram, MessageCircle, Twitter } from 'lucide-react'
import { mockLangues } from '../../data/mockCollections'
import { useLang, useT } from '../../hooks/useLang'
import StampArt from '../PieceCard/StampArt'
const social = [[Instagram, 'Instagram'], [Facebook, 'Facebook'], [Twitter, 'X'], [MessageCircle, 'WhatsApp']] as const
export default function Hero() {
  const t = useT()
  const nav = useNavigate()
  const { setLang } = useLang()
  return (
    <section className="relative min-h-screen overflow-hidden text-white [background:radial-gradient(circle_at_15%_80%,rgba(247,190,31,.45),transparent_24%),radial-gradient(circle_at_62%_65%,rgba(195,46,108,.22),transparent_22%),linear-gradient(135deg,#075d98_0%,#0875ba_52%,#07568f_100%)]">
      <div aria-hidden className="absolute inset-0 opacity-80 [background:linear-gradient(115deg,transparent_0_28%,rgba(255,255,255,.06)_29%,transparent_31%_48%,rgba(255,255,255,.06)_49%,transparent_51%)]" />
      <div className="relative z-10 mx-auto grid min-h-screen max-w-[1240px] items-center gap-9 px-[5vw] pb-[12vh] pt-32 lg:pb-[210px] lg:grid-cols-[1.15fr_.85fr]">
        <div className="rise">
          <p className="text-[.82rem] font-extrabold uppercase tracking-[.14em] text-[#ffe85d]">{t('home.eyebrow')}</p>
          <h1 className="my-4 text-[clamp(3.4rem,7vw,6.8rem)] font-bold leading-[.9] tracking-[-.055em]">{t('home.title1')}<br /><span className="text-or">{t('home.title2')}</span></h1>
          <p className="max-w-[700px] text-[clamp(1rem,1.7vw,1.3rem)] leading-relaxed text-white/90">{t('home.sub')}</p>
          <Link to="/langue" className="mt-6 inline-flex items-center gap-3 rounded-xl bg-or px-6 py-4 font-black text-[#173a50] shadow-[0_14px_35px_rgba(0,0,0,.2)] hover:brightness-105">{t('home.cta')} <ArrowRight size={18} aria-hidden /></Link>
        </div>
        <div className="rounded-[28px] border border-white/30 bg-white/10 p-6 shadow-[0_30px_80px_rgba(0,0,0,.22)] backdrop-blur-md md:p-8">
          <h2 className="text-2xl font-bold">{t('lang.title')}</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/85">{t('lang.subtitle')}</p>
          <div className="mt-5 grid gap-3">
            {mockLangues.map((l) => (
              <button key={l.code} onClick={() => { setLang(l.code); nav('/exposition') }} className="flex items-center justify-between rounded-2xl bg-white px-5 py-4 text-lg font-black text-[#123f61] shadow-md transition hover:translate-x-1">
                <span>{l.libelle}</span><span aria-hidden className="h-3 w-3 rounded-full bg-or" />
              </button>
            ))}
          </div>
          <ul className="mt-5 flex gap-3">{social.map(([Icon, n]) => <li key={n}><a href="#" aria-label={n} className="grid h-9 w-9 place-items-center rounded-full border border-white/40 hover:bg-white/15"><Icon size={16} /></a></li>)}</ul>
        </div>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-[6vw] bottom-0 hidden h-[250px] lg:block">
        <StampArt label="stamp:Histoire" value={50} className="absolute bottom-[-45px] left-[23%] w-[170px] -rotate-[7deg]" />
        <StampArt label="stamp:Culture" value={100} className="absolute bottom-[-20px] left-[38%] w-[170px] rotate-[4deg]" />
        <StampArt label="stamp:Innovation" value={200} className="absolute bottom-[-55px] left-[53%] w-[170px] -rotate-[3deg]" />
      </div>
    </section>
  )
}
