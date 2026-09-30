export type Lang = 'fr' | 'mo' | 'en'
export interface Piece {
  id: string; identifiant: string; titre: string; annee: number; valeur: number
  theme: string; description: string; contexte: string; image: string; miniature?: string
  modele3D?: string; audio?: string; video?: string; collection: string; collectionNom?: string; motsCles: string[]
}
export interface Collection { id: string; nom: string; periode: string; description: string; nbPieces: number; couverture: string }
export interface Langue { code: Lang; nom: string; drapeau: string; sousTitre: string }
export interface Media { id: string; type: 'video' | 'audio'; titre: string; src: string; dureeSec: number }
