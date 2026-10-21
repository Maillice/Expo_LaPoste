-- Les textes traduits sont stockés en JSON : {"fr": "...", "mo": "...", "en": "..."}.
-- L'API renvoie la langue demandée, avec repli sur le français.

CREATE TABLE collections (
  id          text PRIMARY KEY,
  nom         jsonb NOT NULL,
  description jsonb NOT NULL DEFAULT '{}',
  periode     text  NOT NULL DEFAULT '',
  couverture  text  NOT NULL DEFAULT '',
  ordre       int   NOT NULL DEFAULT 0
);

CREATE TABLE themes (
  id    text PRIMARY KEY,
  nom   jsonb NOT NULL,
  ordre int   NOT NULL DEFAULT 0
);

CREATE TABLE pieces (
  id            serial PRIMARY KEY,
  identifiant   text  NOT NULL UNIQUE,
  titre         jsonb NOT NULL,
  annee         int   NOT NULL,
  valeur        int   NOT NULL DEFAULT 0,
  theme_id      text  REFERENCES themes(id),
  collection_id text  REFERENCES collections(id),
  description   jsonb NOT NULL DEFAULT '{}',
  contexte      jsonb NOT NULL DEFAULT '{}',
  mots_cles     jsonb NOT NULL DEFAULT '{}',   -- {"fr": ["..."], "en": ["..."]}
  image         text  NOT NULL,                -- chemin relatif à MEDIA_DIR, URL absolue ou "stamp:Thème"
  miniature     text,
  modele3d      text,
  audio         jsonb NOT NULL DEFAULT '{}',   -- un chemin par langue
  video         jsonb NOT NULL DEFAULT '{}',
  source        text,                          -- chemin d'origine du fichier dans le Drive
  empreinte     text  UNIQUE,                  -- SHA-1 du fichier image : évite les doublons à l'import
  a_verifier    boolean NOT NULL DEFAULT false,-- informations déduites automatiquement, à relire
  recherche     text  NOT NULL DEFAULT '',     -- texte normalisé (minuscules, sans accents) pour la recherche
  cree_le       timestamptz NOT NULL DEFAULT now(),
  modifie_le    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX pieces_annee_idx ON pieces (annee);
CREATE INDEX pieces_valeur_idx ON pieces (valeur);
CREATE INDEX pieces_collection_idx ON pieces (collection_id);
CREATE INDEX pieces_theme_idx ON pieces (theme_id);

-- Médias généraux (vidéo d'introduction, une par langue)
CREATE TABLE medias (
  id        text PRIMARY KEY,
  type      text  NOT NULL CHECK (type IN ('video', 'audio')),
  titre     jsonb NOT NULL,
  src       jsonb NOT NULL,                    -- un chemin par langue
  duree_sec int   NOT NULL DEFAULT 0
);
