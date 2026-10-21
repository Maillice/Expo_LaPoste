// Timbre généré en CSS : remplace les images tant que les visuels réels ne sont pas fournis.
const tint: Record<string, string> = { Histoire: '#EC1C26', Culture: '#AA5E1C', Environnement: '#2B9341', Personnalités: '#1C63B7', 'Événement': '#469EDD', Innovation: '#0C8DD7' }
export default function StampArt({ label, value, className = '' }: { label: string; value?: number; className?: string }) {
  const key = label.replace('stamp:', '')
  const color = tint[key] ?? '#1C63B7'
  return (
    <div role="img" aria-label={`Timbre : ${key}`} className={`relative aspect-[4/5] bg-white p-2 shadow-md ${className}`}
      style={{ backgroundImage: 'radial-gradient(circle, #F5F8FC 3px, transparent 3.5px)', backgroundSize: '12px 12px', backgroundPosition: '-6px -6px' }}>
      <div className="flex h-full w-full flex-col justify-between p-3 text-white" style={{ background: `linear-gradient(160deg, ${color}, #1C63B7)` }}>
        <span className="font-display text-xs opacity-80">BURKINA FASO</span>
        {value !== undefined && <span className="font-display text-2xl text-or">{value} F</span>}
      </div>
    </div>
  )
}
