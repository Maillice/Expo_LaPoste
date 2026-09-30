import { Link } from 'react-router-dom'
import { useT } from '../../hooks/useLang'
const points = [['about.p1t', 'about.p1d'], ['about.p2t', 'about.p2d'], ['about.p3t', 'about.p3d']]
export default function About() {
  const t = useT()
  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="font-display text-4xl">{t('about.title')}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed">{t('about.intro')}</p>
      <ul className="mt-10 grid gap-6 md:grid-cols-3">
        {points.map(([a, b]) => <li key={a} className="border-l-2 border-or pl-4"><h2 className="font-display text-xl">{t(a)}</h2><p className="mt-2 text-sm text-encre/80">{t(b)}</p></li>)}
      </ul>
      <section className="mt-12"><h2 className="font-display text-2xl">{t('about.contact')}</h2><p className="mt-2 text-sm text-encre/80">{t('about.contactText')}</p></section>
      <Link to="/langue" className="mt-10 inline-block rounded bg-or px-6 py-3 font-semibold text-nuit hover:brightness-110">{t('nav.visit')}</Link>
    </main>
  )
}
