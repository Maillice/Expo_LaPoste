import type { FastifyInstance } from 'fastify'
import type { Db } from '../db.js'
import { config } from '../config.js'
import { parseLang, pick, type Lang, type Translated } from '../i18n.js'
import { mediaUrl } from '../urls.js'

interface CollectionRow {
  id: string; nom: Translated; description: Translated; periode: string; couverture: string; nb_pieces: string
}

const toCollection = (r: CollectionRow, lang: Lang) => ({
  id: r.id,
  nom: pick(r.nom, lang),
  periode: r.periode,
  description: pick(r.description, lang),
  nbPieces: Number(r.nb_pieces),
  couverture: mediaUrl(r.couverture) ?? '',
})

export function collectionsRoutes(app: FastifyInstance, db: Db) {
  const visible = config.showUnverified ? '' : 'AND p.a_verifier = false'
  const SELECT = `
    SELECT c.id, c.nom, c.description, c.periode, c.couverture,
           (SELECT count(*) FROM pieces p WHERE p.collection_id = c.id ${visible}) AS nb_pieces
    FROM collections c`

  app.get('/collections', async (req) => {
    const lang = parseLang((req.query as { lang?: string }).lang, req.headers['accept-language'])
    const { rows } = await db.query<CollectionRow>(`${SELECT} ORDER BY c.ordre, c.id`)
    return rows.filter((r) => Number(r.nb_pieces) > 0 || r.id !== 'non-classe').map((r) => toCollection(r, lang))
  })

  app.get('/collections/:id', async (req, reply) => {
    const { id } = req.params as { id: string }
    const lang = parseLang((req.query as { lang?: string }).lang, req.headers['accept-language'])
    const { rows } = await db.query<CollectionRow>(`${SELECT} WHERE c.id = $1`, [id])
    if (!rows[0]) return reply.code(404).send({ erreur: 'Collection introuvable' })
    return toCollection(rows[0], lang)
  })
}
