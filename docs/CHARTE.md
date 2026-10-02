# Identité visuelle du site

## Source et limites
Les couleurs viennent du prototype HTML fourni par l'équipe ; elles sont à confirmer avec la charte officielle. Aucune charte graphique de La Poste Burkina Faso n'est publiée en ligne (recherche effectuée le 02/10/2026). Les couleurs ci-dessous sont donc **mesurées sur le logo officiel** fourni (`assets-src/brand/logo-original.jpg`, issu du lancement de la nouvelle identité visuelle de décembre 2018) : bleu dégradé arrondi, contour et étalon jaunes, lettrage blanc.
Un annuaire de marques tiers (Brandfetch) indique pour le bleu la valeur #165BAB, très proche de la valeur mesurée : cohérent, mais ce n'est pas une source officielle.
**À faire** : demander à la direction de la communication de La Poste Burkina Faso la charte graphique (valeurs Pantone/CMYK/RVB exactes, typographies, version vectorielle du logo) et ajuster `tailwind.config.js` si besoin.

## Palette (`tailwind.config.js`)
Le design suit le **prototype HTML fourni** (`index.html`, variables CSS `--blue`, `--blue2`, `--deep`, `--yellow`, `--ink`, `--bg`, `--gold`).
| Rôle | Jeton | Valeur |
|---|---|---|
| Bleu principal (boutons, accents) | `bleu` | #086db0 |
| Bleu foncé (survol) | `bleu2` | #0a4f86 |
| Bleu profond (fonds sombres) | `nuit` | #063d6a (pied de page #062e4c) |
| Jaune (appels à l'action) | `or` | #ffd400 |
| Or | `dore` | #f4b51b |
| Fond de page | `papier` | #eef5fa |
| Texte | `encre` | #092d49 |
| Erreur | `terre` | #b23a2e |
Dégradé du Hero : #075d98 → #0875ba → #07568f, avec halos jaune et rose, comme dans le prototype. Police : Inter, avec repli sur la police système (aucun chargement externe).

Écart à noter : le bleu mesuré sur le logo officiel (#175FA7) est un peu plus sombre que le bleu du prototype (#086db0). Les deux cohabitent sans problème, mais la charte officielle de La Poste Burkina Faso (non publiée en ligne) tranchera.

## Logo
- Fichier : `public/brand/logo-la-poste-bf.png` (détouré par `npm run logo`, favicon `public/brand/favicon.png`).
- Le fichier d'origine est petit (318×185 px) : demander une version haute définition ou vectorielle (SVG/PDF) pour les écrans Retina et l'impression.
- Ne pas modifier couleurs, proportions ni éléments du logo ; respecter une zone de protection autour.
