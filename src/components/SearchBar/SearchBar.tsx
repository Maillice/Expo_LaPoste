import { useT } from '../../hooks/useLang'
import { Search } from 'lucide-react'
export default function SearchBar({ value, onChange, className = '' }: { value: string; onChange: (v: string) => void; className?: string }) {
  const t = useT()
  return (
    <label className={`flex items-center gap-2 rounded-lg border border-encre/15 bg-white px-3 py-2 text-sm ${className}`}>
      <Search size={16} className="shrink-0 text-encre/50" aria-hidden />
      <span className="sr-only">{t('search.label')}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={t('search.placeholder')} className="w-full bg-transparent outline-none" />
    </label>
  )
}
