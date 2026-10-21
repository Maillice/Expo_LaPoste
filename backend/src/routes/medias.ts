import type { FastifyInstance } from 'fastify'
import type { Db } from '../db.js'
import { parseLang, pick, type Translated } from '../i18n.js'
import { mediaUrl } from '../urls.js'

export function mediasRoutes(app: FastifyInstance, db: Db) {
  // Vidéo d'introduction, une par langue : { id, type, titre, src, dureeSec }
  app.get('/medias', async (req) => {
    const lang = parseLang((req.query as { lang?: string }).lang, req.headers['accept-language'])
    const { rows } = await db.query<{ id: string; type: 'video' | 'audio'; titre: Translated; src: Translated; duree_sec: number }>(
      'SELECT id, type, titre, src, duree_sec FROM medias ORDER BY id')
    return rows.map((r) => ({ id: r.id, type: r.type, titre: pick(r.titre, lang), src: mediaUrl(pick(r.src, lang)) ?? '', dureeSec: r.duree_sec }))
  })
}
