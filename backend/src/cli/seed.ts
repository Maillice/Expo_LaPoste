import { fileURLToPath } from 'node:url'
import { createPool, type Db } from '../db.js'
import { buildSearchText } from '../search.js'
import { migrate } from './migrate.js'

const COLLECTIONS: [string, string, string, string][] = [
  ['histoire-independance', 'Histoire et indépendance', '1914 – 1960', "Des premiers timbres coloniaux à l'indépendance."],
  ['culture-traditions', 'Culture et traditions', '1960 – 2025', 'Masques, danses, artisanat et savoir-faire.'],
  ['personnalites', 'Personnalités', '1960 – 2025', 'Visages qui ont marqué le pays.'],
  ['evenements-nationaux', 'Événements nationaux', '1960 – 2025', 'Fêtes, cérémonies et grandes dates.'],
  ['faune-environnement', 'Faune et environnement', '1965 – 2025', 'Animaux, parcs et paysages.'],
  ['communication-innovation', 'Communication et innovation', '1974 – 2025', 'La poste et les technologies.'],
]
const THEMES = ['Histoire', 'Culture', 'Environnement', 'Personnalités', 'Événement', 'Innovation']
const PIECES: [string, number, number, string, string][] = [
  ['Indépendance du Burkina Faso', 1960, 50, 'Histoire', 'histoire-independance'],
  ['Femme burkinabè', 1972, 100, 'Culture', 'culture-traditions'],
  ['Faune du Burkina', 1985, 200, 'Environnement', 'faune-environnement'],
  ['Maurice Yaméogo', 1960, 300, 'Personnalités', 'personnalites'],
  ['Journée de la femme', 2006, 250, 'Événement', 'evenements-nationaux'],
  ['Architecture moderne', 2010, 400, 'Culture', 'culture-traditions'],
  ['Haute-Volta, timbre colonial', 1914, 5, 'Histoire', 'histoire-independance'],
  ['Masques de Bwa', 1968, 75, 'Culture', 'culture-traditions'],
  ['Éléphant de la Nazinga', 1978, 150, 'Environnement', 'faune-environnement'],
  ['Thomas Sankara', 1987, 500, 'Personnalités', 'personnalites'],
  ['FESPACO', 1999, 200, 'Événement', 'evenements-nationaux'],
  ['Premier satellite postal', 2003, 350, 'Innovation', 'communication-innovation'],
  ['Poste aérienne', 1974, 250, 'Innovation', 'communication-innovation'],
  ['Cérémonie officielle', 1963, 100, 'Événement', 'evenements-nationaux'],
  ['Centenaire de La Poste', 2014, 600, 'Histoire', 'histoire-independance'],
]
const slug = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

/** Données de démonstration (les mêmes que le mode maquette du frontend). Source = "demo", donc remplaçables. */
export async function seed(db: Db): Promise<void> {
  await migrate(db)
  await db.query("DELETE FROM pieces WHERE source = 'demo'")
  for (const [i, t] of THEMES.entries()) {
    await db.query('INSERT INTO themes (id, nom, ordre) VALUES ($1,$2,$3) ON CONFLICT (id) DO NOTHING', [slug(t), { fr: t }, i])
  }
  for (const [i, [id, nom, periode, desc]] of COLLECTIONS.entries()) {
    await db.query(
      `INSERT INTO collections (id, nom, description, periode, couverture, ordre) VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (id) DO NOTHING`, [id, { fr: nom }, { fr: desc }, periode, `stamp:${nom}`, i])
  }
  for (const [i, [titre, annee, valeur, theme, collection]] of PIECES.entries()) {
    const n = i + 1
    const nomCol = COLLECTIONS.find((c) => c[0] === collection)![1]
    const motsCles = { fr: [theme, 'Burkina Faso', String(annee)] }
    await db.query(
      `INSERT INTO pieces (identifiant, titre, annee, valeur, theme_id, collection_id, description, contexte, mots_cles,
                           image, modele3d, audio, video, source, empreinte, a_verifier, recherche)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'demo',$14,false,$15)`,
      [`BF-${annee}-${String(n).padStart(3, '0')}`, { fr: titre }, annee, valeur, slug(theme), collection,
        { fr: `Timbre « ${titre} », émis en ${annee}.` },
        { fr: `Contexte historique fictif de la pièce « ${titre} » (${annee}).` }, motsCles,
        `stamp:${theme}`, i % 3 === 0 ? `/models/${n}.glb` : null,
        { fr: `/media/audio-${n}.mp3` }, { fr: `/media/video-${n}.mp4` }, `demo-${n}`,
        buildSearchText({ titre: { fr: titre }, annee, theme: { fr: theme }, collection: { fr: nomCol }, motsCles })])
  }
  await db.query(
    `INSERT INTO medias (id, type, titre, src, duree_sec) VALUES ('intro','video',$1,$2,165) ON CONFLICT (id) DO NOTHING`,
    [{ fr: "Bienvenue dans l'histoire de La Poste" }, { fr: '/media/intro.mp4' }])
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const db = createPool()
  await seed(db)
  console.log('Données de démonstration chargées (15 pièces, 6 collections).')
  await db.end()
}
