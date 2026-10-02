import type { Collection, Langue, Media } from '../types'
const c = (id: string, nom: string, periode: string, nbPieces: number, description: string): Collection =>
  ({ id, nom, periode, nbPieces, description, couverture: `stamp:${nom}` })
export const mockCollections: Collection[] = [
  c('histoire-independance', 'Histoire et indépendance', '1914 – 1960', 320, "Des premiers timbres coloniaux à l'indépendance."),
  c('culture-traditions', 'Culture et traditions', '1960 – 2025', 450, 'Masques, danses, artisanat et savoir-faire.'),
  c('personnalites', 'Personnalités', '1960 – 2025', 380, 'Visages qui ont marqué le pays.'),
  c('evenements-nationaux', 'Événements nationaux', '1960 – 2025', 290, 'Fêtes, cérémonies et grandes dates.'),
  c('faune-environnement', 'Faune et environnement', '1965 – 2025', 290, 'Animaux, parcs et paysages.'),
  c('communication-innovation', 'Communication et innovation', '1974 – 2025', 260, 'La poste et les technologies.'),
]
export const mockLangues: Langue[] = [
  { code: 'mo', libelle: 'En Mooré', nom: 'Mooré', drapeau: '🇧🇫', sousTitre: "Découvrir l'exposition en mooré" },
  { code: 'fr', libelle: 'En Français', nom: 'Français', drapeau: '🇫🇷', sousTitre: "Découvrir l'exposition en français" },
  { code: 'en', libelle: 'In English', nom: 'English', drapeau: '🇬🇧', sousTitre: 'Discover the exhibition in English' },
]
export const mockMedias: Media[] = [
  { id: 'intro', type: 'video', titre: "Bienvenue dans l'histoire de La Poste", src: '/media/intro.mp4', dureeSec: 165 },
]
