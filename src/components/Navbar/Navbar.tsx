import { useT } from '../../hooks/useLang'
import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { BookOpen, Home, LayoutGrid, Menu, X } from 'lucide-react'
import LanguageSelector from '../LanguageSelector/LanguageSelector'
import Logo from './Logo'
const links = [['/', 'nav.home'], ['/exposition', 'nav.exhibition'], ['/catalogue', 'nav.catalogue'], ['/collections', 'nav.collections'], ['/a-propos', 'nav.about']]
export default function Navbar() {
  const [open, setOpen] = useState(false)
  const t = useT()
  const home = useLocation().pathname === '/'
  const cls = ({ isActive }: { isActive: boolean }) => `px-1 py-1 hover:underline decoration-or decoration-2 underline-offset-4 ${isActive ? 'font-semibold underline' : ''}`
  return (
    <header className={home ? 'absolute inset-x-0 top-0 z-20 text-white' : 'relative z-20 border-b border-encre/10 bg-white text-nuit'}>
      <nav aria-label={t('nav.main')} className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        <Link to="/" aria-label="La Poste Burkina Faso, accueil"><Logo light={home} /></Link>
        <ul className="hidden items-center gap-6 text-sm md:flex">
          {links.map(([to, label]) => <li key={to}><NavLink to={to} end={to === '/'} className={cls}>{t(label)}</NavLink></li>)}
        </ul>
        <div className="hidden items-center gap-5 md:flex">
          <LanguageSelector />
          <Link to="/langue" className="rounded bg-or px-4 py-2 text-sm font-semibold text-nuit hover:brightness-110">{t('nav.visit')}</Link>
        </div>
        <button className="md:hidden" aria-expanded={open} aria-label="Menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </nav>
      {open && (
        <div className="fixed inset-x-0 bottom-14 z-30 rounded-t-lg bg-nuit px-5 pb-5 text-white shadow-2xl md:hidden">
          <ul className="space-y-3 py-3">{links.map(([to, label]) => <li key={to}><Link to={to} onClick={() => setOpen(false)}>{t(label)}</Link></li>)}</ul>
          <LanguageSelector />
          <Link to="/langue" className="mt-4 block rounded bg-or px-4 py-2 text-center font-semibold text-nuit">{t('nav.visit')}</Link>
        </div>
      )}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-encre/10 bg-white text-nuit md:hidden">
        <ul className="grid grid-cols-4 text-[11px]">
          {[['/', 'nav.home', Home], ['/catalogue', 'nav.catalogue', BookOpen], ['/collections', 'nav.collections', LayoutGrid]].map(([to, l, I]) => { const Icon = I as typeof Home; return (
            <li key={to as string}><NavLink to={to as string} end={to === '/'} className={({ isActive }) => `flex flex-col items-center gap-0.5 py-2 ${isActive ? 'font-semibold text-terre' : ''}`}><Icon size={20} aria-hidden />{t(l as string)}</NavLink></li>) })}
          <li><button onClick={() => setOpen(!open)} className="flex w-full flex-col items-center gap-0.5 py-2"><Menu size={20} aria-hidden />{t('nav.menu')}</button></li>
        </ul>
      </div>
    </header>
  )
}
