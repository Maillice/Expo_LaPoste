// Mooré : les textes non renseignés s'affichent en français.
// Pour traduire, décommenter la ligne et remplacer la valeur vide (le texte français est rappelé en commentaire).
export const mo: Record<string, string> = {
  // 'common.loading': '', // FR : Chargement…
  // 'nav.home': '', // FR : Accueil
  // 'nav.exhibition': '', // FR : Exposition
  // 'nav.catalogue': '', // FR : Catalogue
  // 'nav.collections': '', // FR : Collections
  // 'nav.about': '', // FR : À propos
  // 'nav.visit': '', // FR : Visiter l'exposition
  // 'nav.menu': '', // FR : Menu
  // 'nav.main': '', // FR : Navigation principale
  // 'hero.title': '', // FR : Découvrez l'histoire philatélique du Burkina Faso
  // 'hero.subtitle': '', // FR : Une collection unique de timbres, de documents et de souvenirs qui racontent notre histoire, notre culture et notre patrimoine.
  // 'hero.cta2': '', // FR : Découvrir les collections
  // 'home.heritage': '', // FR : Un patrimoine à découvrir
  // 'home.s1': '', // FR : Période couverte
  // 'home.s2': '', // FR : Pièces
  // 'home.s3': '', // FR : 3 langues
  // 'home.s4': '', // FR : Collection numérique
  // 'home.s4l': '', // FR : Accessible en ligne
  // 'home.main': '', // FR : Nos principales collections
  // 'footer.rights': '', // FR : © 2026 La Poste Burkina Faso. Tous droits réservés.
  // 'lang.title': '', // FR : Choisissez votre langue
  // 'lang.subtitle': '', // FR : Sélectionnez la langue de votre visite pour une expérience personnalisée et immersive.
  // 'expo.title': '', // FR : Bienvenue dans l'histoire de La Poste Burkina Faso
  // 'expo.subtitle': '', // FR : Une plongée au cœur de notre patrimoine philatélique.
  // 'expo.skip': '', // FR : Passer l'introduction
  // 'expo.explore': '', // FR : Explorer les collections
  // 'expo.exploreSub': '', // FR : Découvrez nos différentes collections thématiques.
  // 'expo.enter': '', // FR : Entrer dans le catalogue
  // 'expo.play': '', // FR : Lecture
  // 'expo.pause': '', // FR : Pause
  // 'expo.mute': '', // FR : Couper le son
  // 'expo.unmute': '', // FR : Activer le son
  // 'expo.fs': '', // FR : Plein écran
  // 'expo.unavailable': '', // FR : Vidéo d'introduction indisponible pour le moment (fichier de démonstration).
  // 'cat.title': '', // FR : Catalogue philatélique
  // 'cat.subtitle': '', // FR : Explorez les pièces de 1914 à 2025
  // 'cat.one': '', // FR : {n} pièce
  // 'cat.many': '', // FR : {n} pièces
  // 'cat.grid': '', // FR : Affichage en grille
  // 'cat.list': '', // FR : Affichage en liste
  // 'cat.pagination': '', // FR : Pagination
  // 'cat.empty': '', // FR : Aucune pièce ne correspond. Modifiez la recherche ou réinitialisez les filtres.
  // 'search.placeholder': '', // FR : Rechercher une pièce, une année, un thème...
  // 'search.label': '', // FR : Rechercher
  // 'search.by': '', // FR : Rechercher par
  // 'search.title': '', // FR : Résultats de recherche
  // 'search.one': '', // FR : {n} résultat trouvé
  // 'search.many': '', // FR : {n} résultats trouvés
  // 'search.all': '', // FR : Tous les champs
  // 'search.none': '', // FR : Aucun résultat. Essayez un autre mot-clé ou changez de champ.
  // 'f.titre': '', // FR : Titre
  // 'f.annee': '', // FR : Année
  // 'f.theme': '', // FR : Thème
  // 'f.valeur': '', // FR : Valeur
  // 'f.motsCles': '', // FR : Mots-clés
  // 'f.collection': '', // FR : Collection
  // 'filter.period': '', // FR : Période
  // 'filter.theme': '', // FR : Thème
  // 'filter.collection': '', // FR : Collection
  // 'filter.value': '', // FR : Valeur faciale
  // 'filter.reset': '', // FR : Réinitialiser
  // 'card.discover': '', // FR : Découvrir
  // 'piece.breadcrumb': '', // FR : Fil d'Ariane
  // 'piece.crumb': '', // FR : Pièce
  // 'piece.notfound': '', // FR : Cette pièce n'existe pas.
  // 'piece.back': '', // FR : Retour au catalogue
  // 'piece.year': '', // FR : Année
  // 'piece.value': '', // FR : Valeur faciale
  // 'piece.theme': '', // FR : Thème
  // 'piece.collection': '', // FR : Collection
  // 'piece.id': '', // FR : Identifiant
  // 'piece.3d': '', // FR : Explorer en 3D
  // 'piece.history': '', // FR : Histoire et contexte
  // 'piece.listen': '', // FR : Écouter le commentaire
  // 'piece.watch': '', // FR : Voir le commentaire vidéo
  // 'piece.keywords': '', // FR : Mots-clés
  // 'piece.refs': '', // FR : Références
  // 'media.soonAudio': '', // FR : Commentaire audio bientôt disponible.
  // 'media.soonVideo': '', // FR : Commentaire vidéo bientôt disponible.
  // 'coll.title': '', // FR : Nos collections thématiques
  // 'coll.subtitle': '', // FR : Plongez dans l'histoire du Burkina Faso à travers ses timbres.
  // 'coll.explore': '', // FR : Explorer
  // 'coll.pieces': '', // FR : pièces
  // 'coll.all': '', // FR : Toutes les collections
  // 'coll.one': '', // FR : Collection
  // 'coll.empty': '', // FR : Aucune pièce de démonstration dans cette collection.
  // 'viewer.back': '', // FR : Retour
  // 'viewer.reset': '', // FR : Réinitialiser la vue
  // 'viewer.fs': '', // FR : Plein écran
  // 'viewer.loading': '', // FR : Chargement du modèle…
  // 'viewer.unavailable': '', // FR : Modèle 3D indisponible — affichage de l'image haute définition
  // 'viewer.notfound': '', // FR : Pièce introuvable — retour au catalogue
  // 'viewer.rotate': '', // FR : Rotation 360°
  // 'viewer.zoom': '', // FR : Zoom
  // 'viewer.pan': '', // FR : Déplacer
  // 'viewer.collection': '', // FR : Collection
  // 'viewer.controls': '', // FR : Commandes de la vue
  // 'about.title': '', // FR : À propos de l'exposition
  // 'about.intro': '', // FR : L'Exposition Virtuelle de La Poste Burkina Faso est un musée philatélique numérique. Elle rend accessible à tous le patrimoine postal du pays, où que l'on se trouve.
  // 'about.p1t': '', // FR : Une collection numérisée
  // 'about.p1d': '', // FR : Environ 2 000 pièces de 1914 à 2025, photographiées en haute définition et documentées une à une.
  // 'about.p2t': '', // FR : Trois langues
  // 'about.p2d': '', // FR : Chaque parcours est proposé en français, en mooré et en anglais.
  // 'about.p3t': '', // FR : Une visite immersive
  // 'about.p3d': '', // FR : Vidéo d'introduction, modèles 3D, commentaires audio et vidéo accompagnent les pièces.
  // 'about.contact': '', // FR : Contact
  // 'about.contactText': '', // FR : Une question sur une pièce ou sur la collection ? Les coordonnées officielles seront renseignées ici (contenu fictif pour le moment).
  // 'common.error': '', // FR : Impossible de charger les données. Vérifiez votre connexion et réessayez.
}
