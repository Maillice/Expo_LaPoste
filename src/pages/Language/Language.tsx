import { useNavigate } from 'react-router-dom'
import { mockLangues } from '../../data/mockCollections'
import { useLang, useT } from '../../hooks/useLang'
export default function Language() {
  const nav = useNavigate()
  const t = useT()
  const { setLang } = useLang()
  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(145deg,#0b78b8,#0b4f83)] px-[5vw] py-7 text-white">
      <div className="w-full max-w-[920px] rounded-[28px] border border-white/30 bg-white/10 p-6 shadow-[0_30px_80px_rgba(0,0,0,.22)] backdrop-blur-md md:p-11">
        <button onClick={() => nav('/')} className="mb-8 rounded-full border border-white/35 bg-white/10 px-4 py-2.5 hover:bg-white/20 md:mb-10">← {t('viewer.back')}</button>
        <p className="text-[.85rem] font-black tracking-[.16em] text-or">LA POSTE BURKINA FASO</p>
        <h1 className="rise my-3 text-[clamp(2.5rem,6vw,5rem)] font-bold leading-none tracking-[-.045em]">{t('lang.title')}</h1>
        <p className="max-w-[800px] text-[clamp(1rem,2vw,1.25rem)] leading-relaxed text-white/85">{t('lang.subtitle')}</p>
        <div className="mt-8 grid gap-4">
          {mockLangues.map((l) => (
            <button key={l.code} onClick={() => { setLang(l.code); nav('/exposition') }}
              className="flex w-full items-center justify-between rounded-[22px] bg-white px-5 py-5 text-[1.12rem] font-black text-[#123f61] shadow-[0_12px_28px_rgba(0,0,0,.13)] transition hover:translate-x-2 hover:shadow-[0_18px_38px_rgba(0,0,0,.2)] md:px-8 md:py-6 md:text-[1.35rem]">
              <span>{l.libelle}</span><span aria-hidden className="grid h-[42px] w-[42px] place-items-center rounded-full bg-or text-xl">→</span>
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}
