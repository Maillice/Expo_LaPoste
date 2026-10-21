import { useT } from '../../hooks/useLang'
import { Link } from 'react-router-dom'
import StampArt from '../PieceCard/StampArt'
import Logo from '../Navbar/Logo'
export default function Hero() {
  const t = useT()
  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-[linear-gradient(110deg,#1C63B7,#0C8DD7)] px-0 py-8 text-white">
      <div className="mx-auto w-full max-w-7xl px-5"><Logo className="h-24" /></div>
      <div className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 px-5 py-12 md:grid-cols-2">
        <div className="rise">
          <h1 className="font-display text-4xl leading-tight md:text-6xl">{t('hero.title')}</h1>
          <p className="mt-6 max-w-md text-lg text-white/80">{t('hero.subtitle')}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/langue" className="rounded bg-or px-6 py-3 font-semibold text-nuit hover:brightness-110">{t('nav.visit')}</Link>
          </div>
        </div>
        <div aria-hidden className="relative mx-auto h-80 w-full max-w-md">
          <StampArt label="stamp:Histoire" value={50} className="absolute left-0 top-6 w-40 -rotate-6" />
          <StampArt label="stamp:Culture" value={100} className="absolute left-32 top-0 w-44 rotate-3" />
          <StampArt label="stamp:Environnement" value={200} className="absolute bottom-0 right-4 w-40 rotate-6" />
        </div>
      </div>
    </section>
  )
}
