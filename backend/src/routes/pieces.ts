import type { FastifyInstance } from 'fastify'
import type { Db } from '../db.js'
import { config } from '../config.js'
import { normalize, parseLang, pick, pickList, type Lang, type Translated } from '../i18n.js'
import { mediaUrl } from '../urls.js'

interface PieceRow {
  id: number; identifiant: string; titre: Translated; annee: number; valeur: number
  description: Translated; contexte: Translated; mots_cles: Translated<string[]>
  image: string; miniature: string | null; modele3d: string | null; audio: Translated; video: Translated
  collection_id: string | null; collection_nom: Translated | null; theme_nom: Translated | null
}

const SELECT = `
  SELECT p.id, p.identifiant, p.titre, p.annee, p.valeur, p.description, p.contexte, p.mots_cles,
         p.image, p.miniature, p.modele3d, p.audio, p.video,
         p.collection_id, c.nom AS collection_nom, t.nom AS theme_nom
  FROM pieces p
  LEFT JOIN collections c ON c.id = p.collection_id
  LEFT JOIN themes t ON t.id = p.theme_id`

/** Forme attendue par le frontend (voir docs/API.md du frontend). */
export function toPiece(r: PieceRow, lang: Lang) {
  return {
    id: String(r.id),
    identifiant: r.identifiant,
    titre: pick(r.titre, lang),
    annee: r.annee,
    valeur: r.valeur,
    theme: pick(r.theme_nom, lang),
    description: pick(r.description, lang),
    contexte: pick(r.contexte, lang),
    image: mediaUrl(r.image),
    miniature: mediaUrl(r.miniature),
    modele3D: mediaUrl(r.modele3d),
    audio: mediaUrl(pick(r.audio, lang)),
    video: mediaUrl(pick(r.video, lang)),
    collection: r.collection_id ?? '',
    collectionNom: r.collection_nom ? pick(r.collection_nom, lang) : undefined,
    motsCles: pickList(r.mots_cles, lang),
  }
}

const num = (v: unknown): number | undefined => {
  if (typeof v !== 'string' || v.trim() === '') return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}
const int = (v: unknown, min: number, max: number, fallback: number) => {
  const n = num(v)
  return n === undefined ? fallback : Math.min(max, Math.max(min, Math.trunc(n)))
}

export function piecesRoutes(app: FastifyInstance, db: Db) {
  app.get('/pieces', async (req) => {
    const query = req.query as Record<string, string | undefined>
    const lang = parseLang(query.lang, req.headers['accept-language'])
    const where: string[] = []
    const params: unknown[] = []
    const add = (value: unknown) => { params.push(value); return `$${params.length}` }

    if (!config.showUnverified) where.push('p.a_verifier = false')
    // Chaque mot doit apparaître dans le texte normalisé (titre, thème, collection, année, mots-clés)
    for (const word of normalize(query.q ?? '').split(/\s+/).filter(Boolean)) {
      where.push(`p.recherche LIKE ${add(`%${word.replace(/[\\%_]/g, '\\$&')}%`)}`)
    }
    if (query.theme) {
      const t = add(query.theme), l = add(lang)
      where.push(`(t.id = ${t} OR t.nom ->> ${l} = ${t} OR t.nom ->> 'fr' = ${t})`)
    }
    if (query.collection) where.push(`p.collection_id = ${add(query.collection)}`)
    const anneeMin = num(query.anneeMin), anneeMax = num(query.anneeMax)
    const valeurMin = num(query.valeurMin), valeurMax = num(query.valeurMax)
    if (anneeMin !== undefined) where.push(`p.annee >= ${add(anneeMin)}`)
    if (anneeMax !== undefined) where.push(`p.annee <= ${add(anneeMax)}`)
    if (valeurMin !== undefined) where.push(`p.valeur >= ${add(valeurMin)}`)
    if (valeurMax !== undefined) where.push(`p.valeur <= ${add(valeurMax)}`)
    const clause = where.length ? `WHERE ${where.join(' AND ')}` : ''

    // Sans page ni limite : simple tableau (utilisé par getPieces, la recherche et les collections du frontend)
    if (query.page === undefined && query.limit === undefined) {
      const { rows } = await db.query<PieceRow>(`${SELECT} ${clause} ORDER BY p.annee, p.id`, params)
      return rows.map((r) => toPiece(r, lang))
    }
    const limit = int(query.limit, 1, 100, 8)
    const page = int(query.page, 1, 1_000_000, 1)
    const [list, count] = await Promise.all([
      db.query<PieceRow>(`${SELECT} ${clause} ORDER BY p.annee, p.id LIMIT ${add(limit)} OFFSET ${add((page - 1) * limit)}`, params),
      db.query<{ n: string }>(`SELECT count(*) AS n FROM pieces p LEFT JOIN themes t ON t.id = p.theme_id ${clause}`, params.slice(0, params.length - 2)),
    ])
    return { items: list.rows.map((r) => toPiece(r, lang)), total: Number(count.rows[0].n) }
  })

  app.get('/pieces/:id', async (req, reply) => {
    const { id } = req.params as { id: string }
    const lang = parseLang((req.query as { lang?: string }).lang, req.headers['accept-language'])
    if (!/^\d+$/.test(id)) return reply.code(404).send({ erreur: 'Pièce introuvable' })
    const visible = config.showUnverified ? '' : 'AND p.a_verifier = false'
    const { rows } = await db.query<PieceRow>(`${SELECT} WHERE p.id = $1 ${visible}`, [Number(id)])
    if (!rows[0]) return reply.code(404).send({ erreur: 'Pièce introuvable' })
    return toPiece(rows[0], lang)
  })

  app.get('/themes', async (req) => {
    const lang = parseLang((req.query as { lang?: string }).lang, req.headers['accept-language'])
    const visible = config.showUnverified ? '' : 'AND p.a_verifier = false'
    const { rows } = await db.query<{ nom: Translated }>(
      `SELECT t.nom FROM themes t
       WHERE EXISTS (SELECT 1 FROM pieces p WHERE p.theme_id = t.id ${visible})
       ORDER BY t.ordre, t.id`)
    return rows.map((r) => pick(r.nom, lang))
  })
}
