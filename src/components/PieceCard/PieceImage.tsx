import { useState } from 'react'
import StampArt from './StampArt'
interface Props { src: string; alt: string; value?: number; className?: string; priority?: boolean }
// Affiche l'image réelle (URL) ; « stamp:… » ou une image introuvable donne le timbre généré.
export default function PieceImage({ src, alt, value, className = '', priority = false }: Props) {
  const [failed, setFailed] = useState(false)
  if (src.startsWith('stamp:') || failed) return <StampArt label={src.startsWith('stamp:') ? src : 'stamp:'} value={value} className={className} />
  return (
    <img src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)}
      className={`aspect-[4/5] bg-white object-contain p-1 shadow-md ${className}`} />
  )
}
