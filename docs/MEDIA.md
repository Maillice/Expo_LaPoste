# Intégrer les vrais visuels, modèles 3D et médias

Le frontend affiche ce que les données lui indiquent : un champ vide ou un fichier introuvable donne un repli propre (timbre généré, message « Modèle 3D indisponible », « commentaire bientôt disponible »). On peut donc intégrer les fichiers pièce par pièce.

## 1. Où placer les fichiers
- **Recommandé (production)** : les fichiers sont servis par le backend ou un stockage, et l'API renvoie leurs URL dans `image`, `miniature`, `modele3D`, `audio`, `video`. Si le domaine diffère du site, activer **CORS** (indispensable pour les `.glb`).
- **Développement / démo** : dossiers du frontend `public/images/pieces/`, `public/models/`, `public/media/` (URL `/images/pieces/…`).
- Nommer chaque fichier d'après l'**identifiant** de la pièce : `BF-1960-001`.

## 2. Images (timbres, couvertures)
1. Numériser à 600 dpi minimum (TIFF/PNG/JPEG), fond neutre, timbre droit et entier.
2. Déposer les originaux dans `assets-src/images/` (hors dépôt).
3. Lancer `npm run images` : génère `BF-1960-001-hd.webp` (≤ 2000×2500) et `BF-1960-001-thumb.webp` (≤ 480×600) dans `public/images/pieces/`.
4. Renseigner dans les données : `image: '/images/pieces/BF-1960-001-hd.webp'`, `miniature: '/images/pieces/BF-1960-001-thumb.webp'`.
5. Cibles de poids : HD ≤ 400 Ko, vignette ≤ 60 Ko. Les cartes du catalogue utilisent la vignette ; la fiche et le visualiseur utilisent la HD.
Couvertures de collections : mettre l'URL dans `couverture`.

## 3. Modèles 3D
1. **Production** : photogrammétrie (plusieurs dizaines de photos autour de l'objet) ou modélisation dans Blender (plan légèrement épais, texture du timbre, dentelures).
2. **Export** : `.glb` (glTF binaire), matériaux PBR, une seule scène, textures ≤ 2048 px. L'orientation et l'échelle n'ont pas d'importance : le visualiseur recentre et cadre automatiquement.
3. **Compression** (obligatoire pour le web) : `npx @gltf-transform/cli optimize entree.glb BF-1960-001.glb --compress draco --texture-compress webp --texture-size 2048`. Cible : ≤ 3 Mo par modèle.
4. **Validation** : `npx gltf-validator BF-1960-001.glb`, puis contrôle visuel dans https://gltf-viewer.donmccurdy.com.
5. **Intégration** : déposer dans `public/models/` (ou stockage) et renseigner `modele3D: '/models/BF-1960-001.glb'`.
6. **Test** : ouvrir `/viewer-3d/<id>` (rotation, zoom, déplacement, réinitialisation, plein écran). Tester aussi une connexion lente : le décodeur Draco est local (`public/draco`, copié automatiquement par `npm run dev` et `npm run build`), sans dépendance à un CDN.

## 4. Audio et vidéo
- Audio : `ffmpeg -i commentaire.wav -c:a libmp3lame -b:a 96k BF-1960-001.mp3`
- Vidéo (720p, démarrage rapide) : `ffmpeg -i commentaire.mov -vf scale=-2:720 -c:v libx264 -crf 26 -movflags +faststart -c:a aac -b:a 96k BF-1960-001.mp4`
- Vidéo d'introduction : même commande, fichier `public/media/intro.mp4` (ou modifier `mockMedias`).
- Prévoir un commentaire par langue (URL différente selon `Accept-Language`, côté API).

## 5. Liste de contrôle par pièce
- [ ] `-hd.webp` ≤ 400 Ko et `-thumb.webp` ≤ 60 Ko
- [ ] `.glb` compressé ≤ 3 Mo, validé, testé dans `/viewer-3d/<id>`
- [ ] audio MP3 et vidéo MP4 lisibles sur la fiche
- [ ] URL renseignées dans les données (ou l'API) et CORS actif si domaine distinct
