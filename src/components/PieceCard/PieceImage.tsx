import { useState } from 'react'
import StampArt from './StampArt'
interface Props { src: string; alt: string; value?: number; className?: string; priority?: boolean; bare?: boolean }
// Affiche l'image réelle (URL) ; « stamp:… » ou une image introuvable donne le timbre généré. `bare` : image pleine largeur recadrée (cartes).
export default function PieceImage({ src, alt, value, className = '', priority = false, bare = false }: Props) {
  const [failed, setFailed] = useState(false)
  if (src.startsWith('stamp:') || failed) {
    const stamp = <StampArt label={src.startsWith('stamp:') ? src : 'stamp:'} value={value} className={bare ? 'mx-auto w-4/5' : className} />
    return bare ? <div className={`bg-[#e9f0f5] p-4 ${className}`}>{stamp}</div> : stamp
  }
  return (
    <img src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)}
      className={`aspect-[4/5] ${bare ? 'w-full bg-[#e9f0f5] object-cover' : 'bg-white object-contain p-1 shadow-md'} ${className}`} />
  )
}
