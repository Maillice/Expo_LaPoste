# Identité visuelle du site

## Source
Les couleurs et le logo viennent de la **charte graphique officielle** de La Poste Burkina Faso (`LA_POSTE_BF_Charte_Graphique_NV.pdf`, pages « Couleurs prioritaires » et « Couleurs secondaires »). Les valeurs RVB ci-dessous sont la conversion des valeurs CMJN de la charte.

## Palette (`tailwind.config.js`)
| Rôle | Jeton | CMJN (charte) | RVB |
|---|---|---|---|
| Bleu foncé (début du dégradé, fonds, boutons) | `bleu`, `nuit` | C100 M60 J0 N0 | #1C63B7 |
| Bleu clair (fin du dégradé, survol) | `bleu2`, `ciel` | C100 M25 J0 N0 | #0C8DD7 |
| Jaune or (appels à l'action) | `or`, `dore` | C0 M10 J100 N0 | #FDDD04 |
| Rouge (erreurs, timbres « Histoire ») | `terre` | secondaire | #EC1C26 |
| Vert | `savane` | secondaire | #2B9341 |
| Bleu ciel | — | secondaire | #469EDD |
| Marron | — | secondaire | #AA5E1C |
| Beige | — | secondaire | #FBCBA5 |
| Fond de page, texte | `papier`, `encre` | hors charte (neutres) | #eef5fa, #092d49 |

Le dégradé de la charte va du bleu foncé au bleu clair (`linear-gradient(110deg, #1C63B7, #0C8DD7)`). Police : Inter, avec repli sur la police système. La charte n'a pas pu être lue pour la typographie : à confirmer avec la direction de la communication.

## Logo
- Fichier : `public/brand/logo-charte.png`, extrait de la charte (sans la signature « Vous faciliter la vie. »), utilisé par `src/components/Navbar/Logo.tsx` sur un fond blanc de protection.
- Ne pas modifier couleurs, proportions ni éléments du logo ; respecter une zone de protection autour.
- `public/brand/logo-la-poste-bf.png` (généré par `npm run logo` depuis une copie du logo) n'est plus utilisé par le site. Le remplacer par une version vectorielle de la charte dès qu'elle est disponible.
