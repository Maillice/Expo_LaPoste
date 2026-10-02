// Logo officiel de La Poste Burkina Faso (public/brand/logo-la-poste-bf.png). Ne pas modifier ses couleurs ni ses proportions.
export default function Logo({ className = 'h-11' }: { className?: string }) {
  return <img src="/brand/logo-la-poste-bf.png" alt="La Poste Burkina Faso" className={`${className} w-auto`} />
}
