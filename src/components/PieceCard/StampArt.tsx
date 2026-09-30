// Timbre généré en CSS : remplace les images tant que les visuels réels ne sont pas fournis.
const tint: Record<string, string> = { Histoire: '#B23A2E', Culture: '#C77D1A', Environnement: '#1F6B45', Personnalités: '#2B4A7A', 'Événement': '#7A3B6E', Innovation: '#1B6F7A' }
export default function StampArt({ label, value, className = '' }: { label: string; value?: number; className?: string }) {
  const key = label.replace('stamp:', '')
  const color = tint[key] ?? '#0F1B33'
  return (
    <div role="img" aria-label={`Timbre : ${key}`} className={`relative aspect-[4/5] bg-white p-2 shadow-md ${className}`}
      style={{ backgroundImage: 'radial-gradient(circle, #FBF7EE 3px, transparent 3.5px)', backgroundSize: '12px 12px', backgroundPosition: '-6px -6px' }}>
      <div className="flex h-full w-full flex-col justify-between p-3 text-white" style={{ background: `linear-gradient(160deg, ${color}, #0F1B33)` }}>
        <span className="font-display text-xs opacity-80">BURKINA FASO</span>
        {value !== undefined && <span className="font-display text-2xl text-or">{value} F</span>}
      </div>
    </div>
  )
}
