// Logotype officiel (charte graphique) : fond blanc de protection, proportions inchangées.
export default function Logo({ className = 'h-16' }: { className?: string }) {
  return <img src="/images/logo-la-poste.png" alt="La Poste Burkina Faso" className={`w-auto rounded-xl bg-white p-1.5 shadow-md ${className}`} />
}
