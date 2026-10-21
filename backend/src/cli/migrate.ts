import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createPool, type Db } from '../db.js'

const sqlDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../sql')

/** Applique chaque fichier sql/*.sql une seule fois, dans l'ordre. */
export async function migrate(db: Db): Promise<string[]> {
  await db.query('CREATE TABLE IF NOT EXISTS migrations (nom text PRIMARY KEY, appliquee_le timestamptz NOT NULL DEFAULT now())')
  const done = new Set((await db.query<{ nom: string }>('SELECT nom FROM migrations')).rows.map((r) => r.nom))
  const applied: string[] = []
  for (const file of readdirSync(sqlDir).filter((f) => f.endsWith('.sql')).sort()) {
    if (done.has(file)) continue
    const client = await db.connect()
    try {
      await client.query('BEGIN')
      await client.query(readFileSync(path.join(sqlDir, file), 'utf8'))
      await client.query('INSERT INTO migrations (nom) VALUES ($1)', [file])
      await client.query('COMMIT')
      applied.push(file)
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.release()
    }
  }
  return applied
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const db = createPool()
  const applied = await migrate(db)
  console.log(applied.length ? `Migrations appliquées : ${applied.join(', ')}` : 'Base déjà à jour.')
  await db.end()
}
