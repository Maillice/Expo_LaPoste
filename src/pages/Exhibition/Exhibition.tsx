import { useT } from '../../hooks/useLang'
import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Maximize, Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { mockMedias } from '../../data/mockCollections'
export default function Exhibition() {
  const media = mockMedias[0]
  const t = useT()
  const nav = useNavigate()
  const box = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [failed, setFailed] = useState(false)
  const toggle = () => { const v = video.current; if (!v) return; v.paused ? v.play() : v.pause() }
  const btn = 'rounded p-2 hover:bg-white/20'
  return (
    <main className="flex min-h-screen flex-col items-center bg-nuit px-5 py-12 text-white">
      <h1 className="rise max-w-2xl text-center font-display text-3xl md:text-5xl">{t('expo.title')}</h1>
      <p className="mt-3 text-white/70">{t('expo.subtitle')}</p>
      <div ref={box} className="relative mt-10 aspect-video w-full max-w-4xl overflow-hidden rounded-lg bg-black">
        <video ref={video} src={media.src} muted={muted} className="h-full w-full object-cover" aria-label={media.titre}
          onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => nav('/catalogue')} onError={() => setFailed(true)} />
        {failed && <p className="absolute inset-0 grid place-items-center px-6 text-center text-sm text-white/70">{t('expo.unavailable')}</p>}
        {!playing && <button onClick={toggle} aria-label={t('expo.play')} className="absolute inset-0 m-auto grid h-20 w-20 place-items-center rounded-full bg-white/90 text-nuit shadow-lg hover:scale-105 transition"><Play size={32} /></button>}
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-gradient-to-t from-black/70 to-transparent p-3">
          <button className={btn} onClick={toggle} aria-label={playing ? t('expo.pause') : t('expo.play')}>{playing ? <Pause /> : <Play />}</button>
          <button className={btn} onClick={() => setMuted(!muted)} aria-label={muted ? t('expo.unmute') : t('expo.mute')}>{muted ? <VolumeX /> : <Volume2 />}</button>
          <span className="ml-auto text-xs text-white/70">{Math.floor(media.dureeSec / 60)}:{String(media.dureeSec % 60).padStart(2, '0')}</span>
          <button className={btn} onClick={() => box.current?.requestFullscreen?.()} aria-label={t('expo.fs')}><Maximize /></button>
        </div>
      </div>
      <Link to="/catalogue" className="mt-8 rounded border border-white/40 px-5 py-2 text-sm hover:bg-white/10">{t('expo.skip')}</Link>
      <section className="mt-14 text-center">
        <h2 className="font-display text-2xl">{t('expo.explore')}</h2>
        <p className="mt-1 text-sm text-white/70">{t('expo.exploreSub')}</p>
        <Link to="/catalogue" className="mt-5 inline-block rounded bg-or px-6 py-3 font-semibold text-nuit hover:brightness-110">{t('expo.enter')}</Link>
      </section>
    </main>
  )
}
