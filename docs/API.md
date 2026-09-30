# Contrat d'API attendu par le frontend

Configuration : `VITE_API_URL` (voir `.env.example`). Vide = données mockées.
Toutes les requêtes sont en `GET`, envoient `Accept-Language: fr | mo | en` et attendent du JSON.
Les textes (titre, description, contexte, mots-clés, noms de collections) doivent être renvoyés dans la langue demandée, avec repli sur le français.

| Endpoint | Réponse |
|---|---|
| `GET /pieces` | `{ items: Piece[], total: number }` (un simple `Piece[]` est aussi accepté) |
| `GET /pieces?page=1&limit=8&q=&theme=&collection=&anneeMin=&anneeMax=&valeurMin=&valeurMax=` | `{ items, total }` : catalogue filtré et paginé côté serveur (`page` démarre à 1) |
| `GET /themes` | `string[]` (thèmes traduits, pour le filtre du catalogue) |
| `GET /pieces?q=…` | idem (recherche sur titre, année, thème, mots-clés) |
| `GET /pieces?collection=<id>` | idem |
| `GET /pieces/:id` | `Piece` ; `404` si absente |
| `GET /collections` | `Collection[]` |
| `GET /collections/:id` | `Collection` ; `404` si absente |

## Types (voir `src/types/index.ts`)
- `Piece` : `id, identifiant, titre, annee, valeur, theme, description, contexte, image, modele3D?, audio?, video?, collection (id), collectionNom?, motsCles[]`
- `Collection` : `id, nom, periode, description, nbPieces, couverture`
- `image`, `modele3D` (.glb), `audio`, `video` : URL absolues ou relatives servies par le backend.

## Points à décider avec l'équipe backend
1. **Pagination** : le catalogue envoie page, limite et filtres au serveur (8 pièces par page). Si le backend renvoie un simple tableau, le catalogue n'affiche que ce tableau, sans pagination serveur.
2. **Noms de champs** : si le backend diffère, adapter uniquement `toPiece` / `toCollection` dans `src/services/api.ts`.
3. **CORS** ou proxy de développement.
4. **Erreurs** : tout statut hors 2xx affiche un message d'erreur ; `404` sur `/:id` affiche « introuvable ».
