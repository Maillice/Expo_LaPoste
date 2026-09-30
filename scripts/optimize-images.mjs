// Usage : déposer les scans/photos dans assets-src/images (nommés d'après l'identifiant : BF-1960-001.jpg), puis « npm run images ».
// Produit dans public/images/pieces : <nom>-hd.webp (≤ 2000×2500) et <nom>-thumb.webp (≤ 480×600).
import sharp from 'sharp'
import { mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
const SRC = 'assets-src/images', OUT = 'public/images/pieces'
await mkdir(OUT, { recursive: true })
let n = 0
for (const f of await readdir(SRC)) {
  if (!/\.(jpe?g|png|tiff?|webp)$/i.test(f)) continue
  const name = path.parse(f).name
  const img = sharp(path.join(SRC, f)).rotate()
  await img.clone().resize({ width: 2000, height: 2500, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toFile(`${OUT}/${name}-hd.webp`)
  await img.clone().resize({ width: 480, height: 600, fit: 'inside', withoutEnlargement: true }).webp({ quality: 78 }).toFile(`${OUT}/${name}-thumb.webp`)
  console.log('✓', name); n++
}
console.log(n ? `${n} image(s) optimisée(s) dans ${OUT}` : `Aucune image trouvée dans ${SRC}`)
