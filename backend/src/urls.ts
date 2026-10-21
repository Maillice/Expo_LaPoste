import { config } from './config.js'

/**
 * Transforme la valeur stockée en URL utilisable par le frontend :
 * - "stamp:Histoire", URL absolue ou chemin commençant par "/" : renvoyés tels quels (ressources du frontend) ;
 * - sinon : chemin relatif à MEDIA_DIR, servi par l'API sur /files.
 */
export function mediaUrl(value: string | null | undefined): string | undefined {
  if (!value) return undefined
  if (value.startsWith('stamp:') || value.startsWith('/') || /^https?:\/\//.test(value)) return value
  return `${config.publicUrl}/files/${value.split('/').map(encodeURIComponent).join('/')}`
}
