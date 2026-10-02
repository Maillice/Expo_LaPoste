// Détoure le logo officiel (fond blanc -> transparent) : assets-src/brand/logo-original.jpg -> public/brand/logo-la-poste-bf.png + favicon
import sharp from 'sharp'
const src = 'assets-src/brand/logo-original.jpg'
const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const { width: w, height: h } = info
const at = (x, y) => (y * w + x) * 4
const light = (i) => { const [r, g, b] = [data[i], data[i + 1], data[i + 2]]; return Math.min(r, g, b) > 205 && Math.max(r, g, b) - Math.min(r, g, b) < 28 }
const seen = new Uint8Array(w * h), q = []
const push = (x, y) => { if (x < 0 || y < 0 || x >= w || y >= h || seen[y * w + x]) return; if (!light(at(x, y))) return; seen[y * w + x] = 1; q.push([x, y]) }
for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1) }
for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y) }
while (q.length) { const [x, y] = q.pop(); push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1) }
for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (seen[y * w + x]) data[at(x, y) + 3] = 0
// adoucit le liseré : pixels clairs voisins du fond retiré -> semi-transparents
const out = Buffer.from(data)
for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
  const i = at(x, y); if (data[i + 3] === 0) continue
  const edge = [[1,0],[-1,0],[0,1],[0,-1]].some(([dx, dy]) => data[at(x + dx, y + dy) + 3] === 0)
  const m = Math.min(data[i], data[i + 1], data[i + 2])
  if (edge && m > 150) out[i + 3] = Math.round(255 * Math.max(0, 1 - (m - 150) / 105))
}
await sharp(out, { raw: { width: w, height: h, channels: 4 } }).trim().png().toFile('public/brand/logo-la-poste-bf.png')
await sharp('public/brand/logo-la-poste-bf.png').resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile('public/brand/favicon.png')
console.log('logo détouré :', (await sharp('public/brand/logo-la-poste-bf.png').metadata()).width + '×' + (await sharp('public/brand/logo-la-poste-bf.png').metadata()).height)
