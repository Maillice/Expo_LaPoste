export default function Logo({ light = true }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2 leading-none">
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden><path d="M4 22 18 4l-3 10h13L12 30l4-8z" fill="#E8A317" /></svg>
      <span className={`font-display text-base tracking-wide ${light ? 'text-white' : 'text-nuit'}`}>LA POSTE<span className="block font-sans text-[10px] tracking-widest opacity-80">BURKINA FASO</span></span>
    </span>
  )
}
