import { useT } from '../../hooks/useLang'
export interface FilterState { periode: string; theme: string; collection: string; valeur: string }
export const emptyFilters: FilterState = { periode: '', theme: '', collection: '', valeur: '' }
interface Props { value: FilterState; onChange: (f: FilterState) => void; themes: string[]; collections: { id: string; nom: string }[] }
export const periodRange = (p: string): [number, number] => { const [a, b] = p.split('–').map(Number); return [a, b] }
export const valueRange = (v: string): [number | undefined, number | undefined] => (v.startsWith('≤') ? [undefined, 100] : v.startsWith('>') ? [301, undefined] : [101, 300])
export const periodes = ['1914–1959', '1960–1979', '1980–1999', '2000–2025']
export const valeurs = ['≤ 100 F', '101–300 F', '> 300 F']
export default function Filters({ value, onChange, themes, collections }: Props) {
  const t = useT()
  const sel = (key: keyof FilterState, label: string, opts: [string, string][]) => (
    <label className="text-sm">
      <span className="sr-only">{label}</span>
      <select value={value[key]} onChange={(e) => onChange({ ...value, [key]: e.target.value })} className="w-full rounded border border-encre/15 bg-white px-3 py-2">
        <option value="">{label}</option>
        {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  )
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
      {sel('periode', t('filter.period'), periodes.map((p) => [p, p]))}
      {sel('theme', t('filter.theme'), themes.map((t) => [t, t]))}
      {sel('collection', t('filter.collection'), collections.map((c) => [c.id, c.nom]))}
      {sel('valeur', t('filter.value'), valeurs.map((v) => [v, v]))}
      <button onClick={() => onChange(emptyFilters)} className="rounded px-3 py-2 text-sm text-terre hover:underline">{t('filter.reset')}</button>
    </div>
  )
}
