import { useT } from '../../hooks/useLang'
import { Link } from 'react-router-dom'
import type { Piece } from '../../types'
import PieceImage from './PieceImage'
export default function PieceCard({ piece, layout = 'grid' }: { piece: Piece; layout?: 'grid' | 'list' }) {
  const t = useT()
  const row = layout === 'list'
  return (
    <article className={`flex gap-4 rounded-lg border border-encre/10 bg-white p-4 transition hover:shadow-md ${row ? 'items-center' : 'flex-col'}`}>
      <PieceImage src={piece.miniature ?? piece.image} alt={piece.titre} value={piece.valeur} className={row ? 'w-20 shrink-0' : 'mx-auto w-36'} />
      <div className={`flex flex-1 ${row ? 'items-center gap-6' : 'flex-col gap-1'}`}>
        <Link to={`/viewer-3d/${piece.id}`} aria-label={`${t('card.discover')} : ${piece.titre}`} className={`rounded bg-or px-4 py-2 text-center text-sm font-semibold text-nuit hover:brightness-110 ${row ? 'ml-auto' : 'mt-2 block'}`}>{t('card.discover')}</Link>
      </div>
    </article>
  )
}
