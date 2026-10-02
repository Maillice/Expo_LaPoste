import { Link } from 'react-router-dom'
import { useT } from '../../hooks/useLang'
export default function Footer() {
  const t = useT()
  return (
    <footer className="bg-[#062e4c] px-[5vw] py-9 pb-24 text-center text-[#bcd1df] md:pb-9">
      <nav aria-label="Pied de page" className="mb-4 flex flex-wrap justify-center gap-6 text-sm">
        <Link to="/">{t('nav.home')}</Link><Link to="/exposition">{t('nav.exhibition')}</Link><Link to="/catalogue">{t('nav.catalogue')}</Link><Link to="/collections">{t('nav.collections')}</Link><Link to="/a-propos">{t('nav.about')}</Link>
      </nav>
      <p><span className="font-black text-white">La Poste Burkina Faso</span> · {t('footer.tagline')}</p>
      <p className="mt-1 text-xs">{t('footer.rights')}</p>
    </footer>
  )
}
