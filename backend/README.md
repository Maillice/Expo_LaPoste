# API — Exposition virtuelle La Poste Burkina Faso

Node.js 22 + TypeScript (Fastify) + PostgreSQL. Répond au contrat `docs/API.md` du frontend.

## Démarrage

```bash
npm install
docker compose up -d          # PostgreSQL 16 (ou utilisez votre propre base)
cp .env.example .env          # adaptez DATABASE_URL si besoin
npm run migrate               # crée les tables
npm run seed                  # (facultatif) 15 pièces de démonstration
npm run dev                   # http://localhost:4000
```

Frontend : dans son `.env`, mettre `VITE_API_URL=http://localhost:4000`, puis relancer `npm run dev`.

## Importer les données du Drive

1. Téléchargez le dossier du Drive sur votre PC (clic droit → Télécharger) et dézippez-le.
2. `npm run import -- "C:\chemin\vers\le-dossier" --dry-run` : simulation, rien n'est écrit.
3. Même commande sans `--dry-run` : les images sont converties en WebP (1600 px + miniature 400 px) dans `media/`.

L'import est relançable : les doublons sont détectés (empreinte SHA-1 du fichier).

| Fichier trouvé | Effet |
|---|---|
| image (jpg, png, webp, tif) | une pièce ; titre, année, collection et thème déduits du nom et des dossiers |
| vidéo | vidéo d'introduction ; la langue vient du nom (`moore`, `english`, sinon français) |
| audio | rattaché à la pièce de même nom (`elephant_1978.jpg` ↔ `elephant_1978.mp3`) |
| `.glb` | modèle 3D de la pièce de même nom |
| `metadonnees.csv` | corrige/complète : colonnes `fichier;titre;annee;valeur;theme;collection;description;contexte` |

Une pièce dont le titre ou l'année a été **déduit** est marquée `a_verifier`. Avec `SHOW_UNVERIFIED=false`, elles sont cachées du public tant qu'elles ne sont pas confirmées (renseignez-les dans le CSV, puis relancez).

## Points d'accès

`GET /pieces` (`page, limit, q, theme, collection, anneeMin, anneeMax, valeurMin, valeurMax`), `/pieces/:id`, `/themes`, `/collections`, `/collections/:id`, `/medias`, `/health`, fichiers sur `/files/...`. Langue : en-tête `Accept-Language` ou `?lang=fr|mo|en` (repli sur le français).

## Tests

`DATABASE_URL=... npm test` (utilise une base de test, charge les données de démonstration).
