import { mkdirSync } from 'node:fs'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import fastifyStatic from '@fastify/static'
import { config } from './config.js'
import type { Db } from './db.js'
import { piecesRoutes } from './routes/pieces.js'
import { collectionsRoutes } from './routes/collections.js'
import { mediasRoutes } from './routes/medias.js'

export async function buildApp(db: Db, options: { logger?: boolean } = {}) {
  const app = Fastify({ logger: options.logger ?? false })

  const origins = config.corsOrigin.split(',').map((o) => o.trim()).filter(Boolean)
  await app.register(cors, { origin: origins.includes('*') ? true : origins, methods: ['GET', 'HEAD', 'OPTIONS'] })

  // Images, miniatures, modèles 3D, audio et vidéos (les requêtes Range sont gérées : lecture et avance rapide des vidéos)
  mkdirSync(config.mediaDir, { recursive: true })
  await app.register(fastifyStatic, { root: config.mediaDir, prefix: '/files/', decorateReply: false, maxAge: '7d' })

  app.get('/health', async () => {
    await db.query('SELECT 1')
    return { statut: 'ok' }
  })
  piecesRoutes(app, db)
  collectionsRoutes(app, db)
  mediasRoutes(app, db)

  app.setErrorHandler((err, _req, reply) => {
    app.log.error(err)
    reply.code(500).send({ erreur: 'Erreur interne du serveur' })
  })
  return app
}
