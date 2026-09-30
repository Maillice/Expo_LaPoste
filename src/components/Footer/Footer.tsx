import { useT } from '../../hooks/useLang'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'
import Logo from '../Navbar/Logo'
const social = [[Facebook, 'Facebook'], [Twitter, 'X'], [Youtube, 'YouTube'], [Instagram, 'Instagram']] as const
export default function Footer() {
  const t = useT()
  return (
    <footer className="bg-nuit pb-14 text-white/80 md:pb-0">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-5 py-8 md:flex-row md:justify-between">
        <Link to="/" aria-label="Accueil"><Logo /></Link>
        <nav aria-label="Pied de page" className="flex gap-6 text-sm"><Link to="/">{t('nav.home')}</Link><Link to="/exposition">{t('nav.exhibition')}</Link><Link to="/catalogue">{t('nav.catalogue')}</Link><Link to="/collections">{t('nav.collections')}</Link><Link to="/a-propos">{t('nav.about')}</Link></nav>
        <ul className="flex gap-3">{social.map(([Icon, n]) => <li key={n}><a href="#" aria-label={n} className="grid h-8 w-8 place-items-center rounded-full border border-white/30 hover:border-or hover:text-or"><Icon size={15} /></a></li>)}</ul>
      </div>
      <p className="border-t border-white/10 py-3 text-center text-xs">{t('footer.rights')}</p>
    </footer>
  )
}
