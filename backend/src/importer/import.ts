import { createHash } from 'node:crypto'
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { parse } from 'csv-parse/sync'
import sharp from 'sharp'
import type { Db } from '../db.js'
import { normalize, type Lang } from '../i18n.js'
import { buildSearchText } from '../search.js'
import { AUDIO_EXT, IMAGE_EXT, MODEL_EXT, VIDEO_EXT, inferFromPath, inferLang, matchKey } from './infer.js'

export interface ImportOptions { sourceDir: string; mediaDir: string; dryRun?: boolean; log?: (m: string) => void }
export interface ImportReport { images: number; nouvelles: number; doublons: number; videos: number; audios: number; modeles: number; erreurs: string[] }

const pathKey = (f: string) => {
  const p = f.replace(/\\/g, '/').replace(/^\.?\//, '').toLowerCase()
  return p.includes('/') ? `path:${normalize(p)}` : matchKey(p)
}
const slug = (s: string) => normalize(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (e.name.startsWith('.') || e.name === 'node_modules') continue
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else out.push(p)
  }
  return out
}

/** Colonnes acceptées dans metadonnees.csv (toutes facultatives sauf "fichier") : fichier, titre, annee, valeur, theme, collection, description, contexte. */
function readOverrides(sourceDir: string): Map<string, Record<string, string>> {
  const file = ['metadonnees.csv', 'metadata.csv'].map((f) => path.join(sourceDir, f)).find(existsSync)
  const map = new Map<string, Record<string, string>>()
  if (!file) return map
  const rows = parse(readFileSync(file), { columns: true, skip_empty_lines: true, bom: true, trim: true, delimiter: [',', ';'] }) as Record<string, string>[]
  // « fichier » peut être un chemin relatif (recommandé : distingue deux images de même nom) ou un simple nom
  for (const r of rows) if (r.fichier) map.set(pathKey(r.fichier), r)
  return map
}

export async function importFolder(db: Db, opts: ImportOptions): Promise<ImportReport> {
  const log = opts.log ?? (() => {})
  const rep: ImportReport = { images: 0, nouvelles: 0, doublons: 0, videos: 0, audios: 0, modeles: 0, erreurs: [] }
  const files = walk(opts.sourceDir)
  const rel = (f: string) => path.relative(opts.sourceDir, f).split(path.sep).join('/')
  const ext = (f: string) => path.extname(f).toLowerCase()
  const overrides = readOverrides(opts.sourceDir)

  const audios = new Map<string, { lang: Lang; rel: string }[]>()
  const models = new Map<string, string>()
  const copy = (f: string, dest: string) => {
    if (opts.dryRun) return
    mkdirSync(path.dirname(path.join(opts.mediaDir, dest)), { recursive: true })
    copyFileSync(f, path.join(opts.mediaDir, dest))
  }

  for (const f of files.filter((f) => VIDEO_EXT.has(ext(f)))) {
    const lang = inferLang(rel(f))
    const dest = `videos/${slug(path.basename(f, ext(f)))}${ext(f)}`
    copy(f, dest); rep.videos++
    if (!opts.dryRun) {
      // La vidéo d'introduction de chaque langue est la première trouvée pour cette langue.
      await db.query(
        `INSERT INTO medias (id, type, titre, src, duree_sec) VALUES ('intro','video',$1,$2,0)
         ON CONFLICT (id) DO UPDATE SET src = medias.src || $2::jsonb`, [{ fr: "Bienvenue dans l'histoire de La Poste" }, { [lang]: dest }])
    }
  }
  for (const f of files.filter((f) => AUDIO_EXT.has(ext(f)))) {
    const dest = `audio/${slug(path.basename(f, ext(f)))}${ext(f)}`
    copy(f, dest); rep.audios++
    const k = matchKey(f).replace(/(fr|mo|en|moore|english|francais)$/, '')
    audios.set(k, [...(audios.get(k) ?? []), { lang: inferLang(rel(f)), rel: dest }])
  }
  for (const f of files.filter((f) => MODEL_EXT.has(ext(f)))) {
    const dest = `modeles/${slug(path.basename(f, ext(f)))}.glb`
    copy(f, dest); rep.modeles++
    models.set(matchKey(f), dest)
  }

  const seenHashes = new Set<string>()
  for (const f of files.filter((f) => IMAGE_EXT.has(ext(f)))) {
    rep.images++
    try {
      const buf = readFileSync(f)
      const hash = createHash('sha1').update(buf).digest('hex')
      const exists = seenHashes.has(hash) || (await db.query('SELECT 1 FROM pieces WHERE empreinte = $1', [hash])).rowCount
      seenHashes.add(hash)
      if (exists) { rep.doublons++; log(`doublon ignoré : ${rel(f)}`); continue }

      const key = matchKey(f)
      const inf = inferFromPath(rel(f))
      const o = overrides.get(pathKey(rel(f))) ?? overrides.get(key) ?? {}
      const annee = Number(o.annee) || inf.annee
      const titre = o.titre || inf.titre
      const collectionId = o.collection ? slug(o.collection) : inf.collection
      const themeLabel = o.theme || inf.theme
      const themeId = slug(themeLabel)
      const aVerifier = !(o.titre && o.annee)

      const imageDest = `images/${hash.slice(0, 10)}-${slug(titre).slice(0, 50)}.webp`
      const thumbDest = `images/miniatures/${hash.slice(0, 10)}.webp`
      if (!opts.dryRun) {
        mkdirSync(path.join(opts.mediaDir, 'images/miniatures'), { recursive: true })
        await sharp(buf).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(opts.mediaDir, imageDest))
        await sharp(buf).rotate().resize({ width: 400, withoutEnlargement: true }).webp({ quality: 75 }).toFile(path.join(opts.mediaDir, thumbDest))
      }

      const audio: Record<string, string> = {}
      for (const a of audios.get(key) ?? []) audio[a.lang] = a.rel
      const motsCles = { fr: inf.motsCles }
      const colNom = collectionId ? (await db.query<{ nom: { fr: string } }>('SELECT nom FROM collections WHERE id = $1', [collectionId])).rows[0]?.nom : undefined
      if (opts.dryRun) { rep.nouvelles++; continue }

      await db.query('INSERT INTO themes (id, nom, ordre) VALUES ($1,$2,99) ON CONFLICT (id) DO NOTHING', [themeId, { fr: themeLabel.charAt(0).toUpperCase() + themeLabel.slice(1) }])
      if (collectionId && !colNom) {
        await db.query('INSERT INTO collections (id, nom, ordre) VALUES ($1,$2,99) ON CONFLICT (id) DO NOTHING', [collectionId, { fr: o.collection ?? collectionId }])
      }
      const identifiant = `BF-${annee || 'XXXX'}-${hash.slice(0, 6).toUpperCase()}`
      await db.query(
        `INSERT INTO pieces (identifiant, titre, annee, valeur, theme_id, collection_id, description, contexte, mots_cles,
                             image, miniature, modele3d, audio, video, source, empreinte, a_verifier, recherche)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'{}',$14,$15,$16,$17)`,
        [identifiant, { fr: titre }, annee, Number(o.valeur) || 0, themeId, collectionId,
          o.description ? { fr: o.description } : {}, o.contexte ? { fr: o.contexte } : {}, motsCles,
          imageDest, thumbDest, models.get(key) ?? null, audio, rel(f), hash, aVerifier,
          buildSearchText({ titre: { fr: titre }, annee, theme: { fr: themeLabel }, collection: colNom ?? { fr: o.collection ?? '' }, motsCles })])
      rep.nouvelles++
      log(`ajoutée : ${titre} (${annee || 'année inconnue'})${aVerifier ? ' — à vérifier' : ''}`)
    } catch (e) {
      rep.erreurs.push(`${rel(f)} : ${(e as Error).message}`)
    }
  }
  return rep
}

const COLONNES = ['fichier', 'titre', 'annee', 'valeur', 'theme', 'collection', 'description', 'contexte']
const GENERIQUE = /^(img|image|dsc|scan|photo|p)[-_ ]?\d+$/i
const cell = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`

/** Écrit un fichier modèle (une ligne par image, doublons exacts exclus) à compléter dans Excel. */
export function writeCsvTemplate(sourceDir: string): { fichier: string; lignes: number; generiques: number } {
  const lignes: string[] = [COLONNES.join(';')]
  const vus = new Set<string>()
  let generiques = 0
  for (const f of walk(sourceDir).filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()))) {
    const hash = createHash('sha1').update(readFileSync(f)).digest('hex')
    if (vus.has(hash)) continue
    vus.add(hash)
    const rel = path.relative(sourceDir, f).split(path.sep).join('/')
    const stem = path.basename(rel, path.extname(rel))
    const inf = inferFromPath(rel)
    const generique = GENERIQUE.test(stem.trim())
    if (generique) generiques++
    const theme = inf.theme.charAt(0).toUpperCase() + inf.theme.slice(1)
    // titre laissé vide pour les noms génériques : c'est à vous de le remplir
    lignes.push([rel, generique ? '' : inf.titre, inf.annee || '', '', theme, inf.collection ?? '', '', ''].map(cell).join(';'))
  }
  const existe = existsSync(path.join(sourceDir, 'metadonnees.csv'))
  const fichier = path.join(sourceDir, existe ? 'metadonnees.modele.csv' : 'metadonnees.csv')
  writeFileSync(fichier, '\ufeff' + lignes.join('\r\n') + '\r\n', 'utf8')
  return { fichier, lignes: lignes.length - 1, generiques }
}
