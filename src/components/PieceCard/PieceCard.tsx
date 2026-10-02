import { Link } from 'react-router-dom'
import type { Piece } from '../../types'
import { useT } from '../../hooks/useLang'
import PieceImage from './PieceImage'
export default function PieceCard({ piece, layout = 'grid' }: { piece: Piece; layout?: 'grid' | 'list' }) {
  const t = useT()
  const row = layout === 'list'
  return (
    <article className={`overflow-hidden rounded-[20px] border border-[#dce7ef] bg-white shadow-[0_12px_30px_rgba(20,58,80,.08)] transition hover:-translate-y-0.5 hover:shadow-lg ${row ? 'flex items-center' : ''}`}>
      <PieceImage bare src={piece.miniature ?? piece.image} alt={piece.titre} value={piece.valeur} className={row ? 'w-24 shrink-0' : 'w-full'} />
      <div className={`p-[18px] ${row ? 'flex flex-1 items-center gap-6' : ''}`}>
        <div className="flex-1">
          <h3 className="mb-1 font-bold leading-snug">{piece.titre}</h3>
          <p className="text-sm text-[#4f6578]">{piece.annee} · {piece.valeur} F · {piece.theme}</p>
        </div>
        <Link to={`/catalogue/${piece.id}`} className={`rounded-[10px] bg-bleu py-3 text-center font-extrabold text-white hover:bg-bleu2 ${row ? 'px-6' : 'mt-4 block w-full'}`}>{t('card.discover')}</Link>
      </div>
    </article>
  )
}
