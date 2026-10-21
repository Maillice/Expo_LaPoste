import { after, before, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { buildApp } from '../src/app.js'
import { createPool } from '../src/db.js'
import { seed } from '../src/cli/seed.js'

const db = createPool(process.env.DATABASE_URL)
let app: Awaited<ReturnType<typeof buildApp>>

before(async () => { await seed(db); app = await buildApp(db) })
after(async () => { await app.close(); await db.end() })

const get = async (url: string, headers: Record<string, string> = {}) => {
  const r = await app.inject({ method: 'GET', url, headers })
  return { status: r.statusCode, body: r.json() as any }
}

describe('API', () => {
  it('pagine : items + total', async () => {
    const { body } = await get('/pieces?page=2&limit=4')
    assert.equal(body.items.length, 4)
    assert.equal(body.total, 15)
  })
  it('renvoie un tableau sans page ni limite', async () => {
    const { body } = await get('/pieces')
    assert.ok(Array.isArray(body))
    assert.equal(body.length, 15)
  })
  it('recherche sans tenir compte des accents ni de la casse', async () => {
    const { body } = await get('/pieces?q=ELEPHANT')
    assert.deepEqual(body.map((p: any) => p.titre), ['Éléphant de la Nazinga'])
  })
  it('recherche par année', async () => {
    const { body } = await get('/pieces?q=1960')
    assert.equal(body.length, 2)
  })
  it('filtres thème, collection, année et valeur', async () => {
    assert.equal((await get('/pieces?theme=Culture')).body.length, 3)
    assert.equal((await get('/pieces?collection=personnalites')).body.length, 2)
    assert.equal((await get('/pieces?anneeMin=2000&anneeMax=2010')).body.length, 3)
    assert.equal((await get('/pieces?valeurMin=500')).body.length, 2)
  })
  it('détail et 404', async () => {
    const first = (await get('/pieces')).body[0]
    const { status, body } = await get(`/pieces/${first.id}`)
    assert.equal(status, 200)
    assert.equal(body.identifiant, first.identifiant)
    assert.equal((await get('/pieces/99999')).status, 404)
    assert.equal((await get('/pieces/abc')).status, 404)
  })
  it('thèmes et collections', async () => {
    assert.equal((await get('/themes')).body.length, 6)
    const cols = (await get('/collections')).body
    assert.equal(cols.length, 6)
    assert.equal(cols.reduce((n: number, c: any) => n + c.nbPieces, 0), 15)
    assert.equal((await get('/collections/inconnue')).status, 404)
  })
  it('repli sur le français pour une langue sans traduction', async () => {
    const { body } = await get('/themes', { 'accept-language': 'mo' })
    assert.equal(body[0], 'Histoire')
  })
  it('refuse les paramètres absurdes sans planter', async () => {
    assert.equal((await get('/pieces?page=-5&limit=99999')).status, 200)
    assert.equal((await get("/pieces?q=%27%3B--")).status, 200)
  })
})
