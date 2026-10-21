// Logotype officiel (charte graphique, public/brand/logo-charte.png) : fond blanc de protection, couleurs et proportions inchangées.
export default function Logo({ className = 'h-11' }: { className?: string }) {
  return <img src="/brand/logo-charte.png" alt="La Poste Burkina Faso" className={`${className} w-auto rounded-xl bg-white p-1.5 shadow-md`} />
}
