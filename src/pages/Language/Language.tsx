import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { mockLangues } from '../../data/mockCollections'
import { useLang, useT } from '../../hooks/useLang'
import Logo from '../../components/Navbar/Logo'
export default function Language() {
  const nav = useNavigate()
  const { setLang } = useLang()
  const t = useT()
  return (
    <main className="flex min-h-screen flex-col items-center bg-[radial-gradient(ellipse_at_50%_0%,#2c3f66,#0F1B33_70%)] px-5 py-8 text-white">
      <Logo />
      <div className="flex flex-1 flex-col items-center justify-center">
        <h1 className="rise text-center font-display text-4xl md:text-5xl">{t('lang.title')}</h1>
        <p className="mt-3 text-center text-white/70">{t('lang.subtitle')}</p>
        <div className="mt-12 grid w-full max-w-3xl gap-5 md:grid-cols-3">
          {mockLangues.map((l) => (
            <button key={l.code} onClick={() => { setLang(l.code); nav('/exposition') }}
              className="group flex flex-col items-center gap-3 rounded-xl bg-white/90 p-7 text-center text-nuit shadow-lg transition hover:-translate-y-1 hover:bg-white">
              <span aria-hidden className="grid h-20 w-20 place-items-center rounded-full bg-papier text-5xl shadow-inner">{l.drapeau}</span>
              <span className="font-display text-2xl">{l.nom}</span>
              <span className="text-xs text-encre/70">{l.sousTitre}</span>
              <span className="mt-2 grid h-9 w-9 place-items-center rounded-full bg-nuit/10 transition group-hover:bg-or"><ArrowRight size={16} aria-hidden /></span>
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}
