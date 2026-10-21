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
        <Link to={`/viewer-3d/${piece.id}`} aria-label={`${t('card.discover')} : ${piece.titre}`} className={`rounded-[10px] bg-bleu py-3 text-center font-extrabold text-white hover:bg-bleu2 ${row ? 'ml-auto px-6' : 'mt-4 block w-full'}`}>{t('card.discover')}</Link>
      </div>
    </article>
  )
}
