import type { Piece } from '../types'
import { mockCollections } from './mockCollections'
// [titre, année, valeur, thème, collection]
const base: [string, number, number, string, string][] = [
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
export const mockPieces: Piece[] = base.map(([titre, annee, valeur, theme, collection], i) => ({
  id: String(i + 1), identifiant: `BF-${annee}-${String(i + 1).padStart(3, '0')}`,
  titre, annee, valeur, theme, collection, collectionNom: mockCollections.find((c) => c.id === collection)?.nom,
  description: `Timbre « ${titre} », émis en ${annee}.`,
  contexte: `Contexte historique fictif de la pièce « ${titre} » (${annee}). Ce texte sera fourni par l'API.`,
  image: `stamp:${theme}`, modele3D: i % 3 === 0 ? `/models/${i + 1}.glb` : undefined,
  audio: `/media/audio-${i + 1}.mp3`, video: `/media/video-${i + 1}.mp4`,
  motsCles: [theme, 'Burkina Faso', String(annee)],
}))
