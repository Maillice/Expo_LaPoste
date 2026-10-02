import Hero from '../../components/Hero/Hero'
import PieceImage from '../../components/PieceCard/PieceImage'
import { useT } from '../../hooks/useLang'
const cards = [['home.c1t', 'home.c1d', 'stamp:Histoire'], ['home.c2t', 'home.c2d', 'stamp:Culture'], ['home.c3t', 'home.c3d', 'stamp:Innovation']]
export default function Home() {
  const t = useT()
  return (
    <>
      <Hero />
      <section id="about" className="bg-white px-[5vw] py-[90px]">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[.82rem] font-extrabold uppercase tracking-[.14em] text-[#0873b7]">{t('home.concept')}</p>
              <h2 className="mt-2 text-[clamp(2rem,4vw,3.3rem)] font-bold leading-tight">{t('home.conceptTitle')}</h2>
            </div>
            <p className="max-w-[700px] leading-[1.7] text-[#4f6578]">{t('home.conceptLead')}</p>
          </div>
          <ul className="grid gap-5 md:grid-cols-3">
            {cards.map(([ti, de, img]) => (
              <li key={ti} className="overflow-hidden rounded-[20px] border border-[#dce7ef] bg-white shadow-[0_12px_30px_rgba(20,58,80,.08)]">
                <PieceImage bare src={img} alt="" className="w-full" />
                <div className="p-[18px]"><h3 className="mb-1.5 font-bold">{t(ti)}</h3><p className="leading-normal text-[#4f6578]">{t(de)}</p></div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
