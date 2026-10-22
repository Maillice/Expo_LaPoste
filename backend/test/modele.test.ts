import { after, before, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import sharp from 'sharp'
import { parse } from 'csv-parse/sync'
import { createPool } from '../src/db.js'
import { importFolder, writeCsvTemplate } from '../src/importer/import.js'
import { migrate } from '../src/cli/migrate.js'

const db = createPool(process.env.DATABASE_URL)
const src = mkdtempSync(path.join(os.tmpdir(), 'mod-'))
const out = mkdtempSync(path.join(os.tmpdir(), 'modmedia-'))
const img = (c: string) => sharp({ create: { width: 300, height: 200, channels: 3, background: c } }).jpeg().toBuffer()

before(async () => {
  await migrate(db)
  await db.query("DELETE FROM pieces WHERE source LIKE 'Cat%/image00001%' OR source LIKE 'Faune/Masque%'")
  mkdirSync(path.join(src, 'CatA')); mkdirSync(path.join(src, 'CatB')); mkdirSync(path.join(src, 'Faune'))
  writeFileSync(path.join(src, 'CatA/image00001.jpeg'), await img('#111111'))
  writeFileSync(path.join(src, 'CatB/image00001.jpeg'), await img('#eeeeee')) // même nom, autre image
  writeFileSync(path.join(src, 'Faune/Masque Bwa 1968.jpg'), await img('#aa5500'))
  writeFileSync(path.join(src, 'Faune/Z copie.jpg'), await img('#aa5500')) // doublon exact
})
after(async () => {
  await db.query("DELETE FROM pieces WHERE source LIKE 'Cat%/image00001%' OR source LIKE 'Faune/Masque%'")
  await db.end(); rmSync(src, { recursive: true }); rmSync(out, { recursive: true })
})

describe('modèle CSV', () => {
  it('liste une ligne par image unique, titres génériques vides', () => {
    const r = writeCsvTemplate(src)
    assert.equal(r.lignes, 3); assert.equal(r.generiques, 2)
    const rows = parse(readFileSync(r.fichier), { columns: true, bom: true, delimiter: ';' }) as Record<string, string>[]
    const masque = rows.find((x) => x.fichier.includes('Masque'))!
    assert.equal(masque.annee, '1968'); assert.equal(masque.titre, 'Masque Bwa')
    assert.equal(rows.find((x) => x.fichier === 'CatA/image00001.jpeg')!.titre, '')
  })
  it('le CSV rempli par chemin distingue deux images de même nom', async () => {
    const f = path.join(src, 'metadonnees.csv')
    writeFileSync(f, 'fichier;titre;annee;valeur\nCatA/image00001.jpeg;Timbre A;1970;10\nCatB/image00001.jpeg;Timbre B;1980;20\n')
    const r = await importFolder(db, { sourceDir: src, mediaDir: out })
    assert.deepEqual(r.erreurs, [])
    const { rows } = await db.query("SELECT titre->>'fr' t, annee, valeur FROM pieces WHERE source LIKE 'Cat%' ORDER BY source")
    assert.deepEqual(rows.map((x) => [x.t, x.annee, x.valeur]), [['Timbre A', 1970, 10], ['Timbre B', 1980, 20]])
  })
})
