import { useT } from '../../hooks/useLang'
import { Link } from 'react-router-dom'
import { CalendarRange, Languages, Layers, Monitor } from 'lucide-react'
import Hero from '../../components/Hero/Hero'
import PieceImage from '../../components/PieceCard/PieceImage'
import { mockCollections } from '../../data/mockCollections'
const stats = [[CalendarRange, '1914 – 2025', 'home.s1'], [Layers, '~ 2 000', 'home.s2'], [Languages, 'home.s3', 'FR · MO · EN'], [Monitor, 'home.s4', 'home.s4l']] as const
export default function Home() {
  const t = useT()
  return (
    <>
      <Hero />
      <section className="relative z-10 mx-auto -mt-12 max-w-5xl px-5">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="font-display text-2xl">{t('home.heritage')}</h2>
          <dl className="mt-5 grid grid-cols-2 gap-5 md:grid-cols-4">
            {stats.map(([Icon, v, l]) => <div key={v} className="flex items-center gap-3"><Icon className="shrink-0 text-or" aria-hidden /><div><dt className="font-semibold">{t(v)}</dt><dd className="text-xs text-encre/70">{t(l)}</dd></div></div>)}
          </dl>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 pb-20 pt-14">
        <h2 className="font-display text-2xl">{t('home.main')}</h2>
        <ul className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
          {mockCollections.slice(0, 4).map((c) => (
            <li key={c.id}><Link to={`/collections/${c.id}`} className="group block">
              <PieceImage src={c.couverture} alt="" className="transition-transform group-hover:scale-[1.02]" />
              <p className="mt-3 font-semibold">{c.nom}</p>
            </Link></li>
          ))}
        </ul>
      </section>
    </>
  )
}
