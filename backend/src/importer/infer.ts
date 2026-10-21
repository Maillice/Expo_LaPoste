import path from 'node:path'
import { normalize, type Lang } from '../i18n.js'

export const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff'])
export const VIDEO_EXT = new Set(['.mp4', '.webm', '.mov', '.m4v'])
export const AUDIO_EXT = new Set(['.mp3', '.m4a', '.wav', '.ogg'])
export const MODEL_EXT = new Set(['.glb'])

/** Mots-clés (sans accents) cherchés dans le chemin du fichier pour deviner collection et thème. */
const COLLECTION_RULES: [string, string[]][] = [
  ['histoire-independance', ['independance', 'histoire', 'colonial', 'haute-volta', 'haute volta', 'centenaire']],
  ['personnalites', ['personnalite', 'portrait', 'sankara', 'president']],
  ['faune-environnement', ['faune', 'animal', 'oiseau', 'elephant', 'environnement', 'flore', 'parc']],
  ['evenements-nationaux', ['evenement', 'fespaco', 'ceremonie', 'fete', 'journee']],
  ['communication-innovation', ['communication', 'innovation', 'satellite', 'aerienne', 'telephone', 'poste']],
  ['culture-traditions', ['culture', 'tradition', 'masque', 'danse', 'artisan', 'femme']],
]
const THEME_BY_COLLECTION: Record<string, string> = {
  'histoire-independance': 'histoire', 'personnalites': 'personnalites', 'faune-environnement': 'environnement',
  'evenements-nationaux': 'evenement', 'communication-innovation': 'innovation', 'culture-traditions': 'culture',
}

export interface Inferred {
  titre: string
  annee: number
  collection: string | null
  theme: string
  motsCles: string[]
}

export function cleanTitle(stem: string): string {
  const t = stem
    .replace(/[_]+/g, ' ')
    .replace(/\b(19|20|18)\d{2}\b/g, ' ')
    .replace(/\b(img|dsc|scan|photo|copie|copy)\b/gi, ' ')
    .replace(/[-–]\s*\d+\s*$/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : stem
}

export function inferYear(relPath: string): number | null {
  const m = relPath.match(/(?<!\d)(18[5-9]\d|19\d{2}|20[0-4]\d)(?!\d)/g)
  return m ? Number(m[m.length - 1]) : null
}

export function inferFromPath(relPath: string): Inferred {
  const stem = path.basename(relPath, path.extname(relPath))
  const haystack = normalize(relPath.replace(/[_]+/g, ' '))
  let collection: string | null = null
  for (const [id, words] of COLLECTION_RULES) {
    if (words.some((w) => haystack.includes(w))) { collection = id; break }
  }
  const annee = inferYear(relPath) ?? 0
  const titre = cleanTitle(stem)
  const theme = collection ? THEME_BY_COLLECTION[collection] : 'histoire'
  return { titre, annee, collection, theme, motsCles: ['Burkina Faso', ...(annee ? [String(annee)] : [])] }
}

/** Langue d'un fichier vidéo/audio d'après son nom ; français par défaut. */
export function inferLang(relPath: string): Lang {
  const n = normalize(relPath)
  if (/(moore|moré|\bmo\b|mossi)/.test(n)) return 'mo'
  if (/(english|anglais|\ben\b)/.test(n)) return 'en'
  return 'fr'
}

/** Nom de comparaison entre une image et son audio/modèle 3D : "Masque Bwa 1968.jpg" ~ "masque-bwa-1968.glb". */
export function matchKey(relPath: string): string {
  return normalize(path.basename(relPath, path.extname(relPath))).replace(/[^a-z0-9]+/g, '')
}
