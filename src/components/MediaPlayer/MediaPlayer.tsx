import { useT } from '../../hooks/useLang'
import { useState } from 'react'
// Lecteur audio/vidéo natif avec message de repli si le fichier est absent.
export default function MediaPlayer({ type, src, titre }: { type: 'audio' | 'video'; src?: string; titre: string }) {
  const [failed, setFailed] = useState(false)
  const t = useT()
  if (!src || failed) return <p className="rounded bg-encre/5 p-4 text-sm text-encre/70">{t(type === 'audio' ? 'media.soonAudio' : 'media.soonVideo')}</p>
  return type === 'audio'
    ? <audio controls src={src} aria-label={titre} className="w-full" onError={() => setFailed(true)} />
    : <video controls src={src} aria-label={titre} className="aspect-video w-full rounded bg-black" onError={() => setFailed(true)} />
}
