import { after, before, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, rmSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import sharp from 'sharp'
import { createPool } from '../src/db.js'
import { importFolder } from '../src/importer/import.js'
import { migrate } from '../src/cli/migrate.js'

const db = createPool(process.env.DATABASE_URL)
const src = mkdtempSync(path.join(os.tmpdir(), 'src-'))
const out = mkdtempSync(path.join(os.tmpdir(), 'media-'))

before(async () => {
  await migrate(db)
  await db.query("DELETE FROM pieces WHERE source NOT LIKE 'demo%' OR source IS NULL")
  mkdirSync(path.join(src, 'Faune'))
  const img = (c: string) => sharp({ create: { width: 2000, height: 1000, channels: 3, background: c } }).jpeg().toBuffer()
  writeFileSync(path.join(src, 'Faune/elephant_1978.jpg'), await img('#336699'))
  writeFileSync(path.join(src, 'Faune/zz_copie.jpg'), await img('#336699')) // doublon exact
  writeFileSync(path.join(src, 'Faune/lion.jpg'), await img('#993333'))
  writeFileSync(path.join(src, 'Faune/elephant_1978.mp3'), 'x')
  writeFileSync(path.join(src, 'metadonnees.csv'), 'fichier;titre;annee;valeur\nlion.jpg;Lion de Pama;1980;120\n')
})
after(async () => {
  await db.query("DELETE FROM pieces WHERE source LIKE 'Faune/%'")
  await db.end(); rmSync(src, { recursive: true }); rmSync(out, { recursive: true })
})

describe('import', () => {
  it('importe, optimise, déduplique et applique le CSV', async () => {
    const r = await importFolder(db, { sourceDir: src, mediaDir: out })
    assert.equal(r.images, 3)
    assert.equal(r.nouvelles, 2)
    assert.equal(r.doublons, 1)
    assert.deepEqual(r.erreurs, [])
    const { rows } = await db.query("SELECT titre->>'fr' AS titre, annee, valeur, a_verifier, image, audio FROM pieces WHERE source LIKE 'Faune/%' ORDER BY annee")
    const lion = rows.find((x) => x.titre === 'Lion de Pama')
    assert.equal(lion.annee, 1980); assert.equal(lion.valeur, 120); assert.equal(lion.a_verifier, false)
    const ele = rows.find((x) => x.annee === 1978)
    assert.equal(ele.a_verifier, true)
    assert.ok(ele.audio.fr.endsWith('.mp3'))
    assert.ok(existsSync(path.join(out, ele.image)))
    assert.equal((await sharp(path.join(out, ele.image)).metadata()).width, 1600)
  })
  it('est relançable sans créer de doublons', async () => {
    const r = await importFolder(db, { sourceDir: src, mediaDir: out })
    assert.equal(r.nouvelles, 0)
  })
})
