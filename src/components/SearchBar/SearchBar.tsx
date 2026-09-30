import { useT } from '../../hooks/useLang'
import { Search } from 'lucide-react'
export default function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const t = useT()
  return (
    <label className="flex items-center gap-3 rounded-lg border border-encre/15 bg-white px-4 py-3">
      <Search className="text-encre/50" aria-hidden />
      <span className="sr-only">{t('search.label')}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={t('search.placeholder')} className="w-full bg-transparent outline-none" />
    </label>
  )
}
