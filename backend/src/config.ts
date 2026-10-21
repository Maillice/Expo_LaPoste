import path from 'node:path'

const port = Number(process.env.PORT ?? 4000)

export const config = {
  port,
  host: process.env.HOST ?? '0.0.0.0',
  databaseUrl: process.env.DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/expo_poste',
  mediaDir: path.resolve(process.env.MEDIA_DIR ?? './media'),
  publicUrl: (process.env.PUBLIC_URL ?? `http://localhost:${port}`).replace(/\/$/, ''),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  showUnverified: (process.env.SHOW_UNVERIFIED ?? 'true') !== 'false',
}

export type Config = typeof config
