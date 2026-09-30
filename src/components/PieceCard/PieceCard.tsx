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
        <div className="flex-1">
          <h3 className="text-sm font-semibold leading-snug">{piece.titre}</h3>
          <p className="text-xs text-encre/70">{piece.annee} · {piece.valeur} F</p>
          <p className="text-xs text-encre/70">{piece.theme}</p>
        </div>
        <Link to={`/catalogue/${piece.id}`} className={`rounded bg-or px-4 py-2 text-center text-sm font-semibold text-nuit hover:brightness-110 ${row ? '' : 'mt-2 block'}`}>{t('card.discover')}</Link>
      </div>
    </article>
  )
}
