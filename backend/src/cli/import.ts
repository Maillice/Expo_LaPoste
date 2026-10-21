import path from 'node:path'
import { config } from '../config.js'
import { createPool } from '../db.js'
import { importFolder } from '../importer/import.js'
import { migrate } from './migrate.js'

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const dir = args.find((a) => !a.startsWith('--'))
if (!dir) {
  console.error('Usage : npm run import -- <dossier-drive-telecharge> [--dry-run]')
  process.exit(1)
}
const db = createPool()
await migrate(db)
const r = await importFolder(db, { sourceDir: path.resolve(dir), mediaDir: config.mediaDir, dryRun, log: console.log })
console.log(`\n${dryRun ? '[simulation] ' : ''}${r.images} images lues : ${r.nouvelles} ajoutées, ${r.doublons} doublons ignorés.`)
console.log(`${r.videos} vidéos, ${r.audios} audios, ${r.modeles} modèles 3D copiés.`)
if (r.erreurs.length) console.log(`\n${r.erreurs.length} erreur(s) :\n- ${r.erreurs.join('\n- ')}`)
await db.end()
