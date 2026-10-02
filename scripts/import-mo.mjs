// Usage : npm run i18n:mo [fichier.csv]  — lit docs/traduction-moore.csv (séparateur « ; », UTF-8) et régénère src/i18n/mo.ts.
// Les lignes dont la colonne « mooré » est vide restent en français dans l'interface.
import { readFileSync, writeFileSync } from 'node:fs'
const file = process.argv[2] ?? 'docs/traduction-moore.csv'
const text = readFileSync(file, 'utf8').replace(/^\uFEFF/, '')
const rows = []; let row = [], cell = '', quoted = false
for (let i = 0; i < text.length; i++) {
  const c = text[i]
  if (quoted) { if (c === '"' && text[i + 1] === '"') { cell += '"'; i++ } else if (c === '"') quoted = false; else cell += c }
  else if (c === '"') quoted = true
  else if (c === ';') { row.push(cell); cell = '' }
  else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cell); cell = ''; if (row.some(Boolean)) rows.push(row); row = [] }
  else cell += c
}
if (cell || row.length) { row.push(cell); rows.push(row) }
const esc = (s) => JSON.stringify(s)
let done = 0, out = "// Généré par scripts/import-mo.mjs à partir de docs/traduction-moore.csv — ne pas éditer à la main.\n// Les textes non traduits s'affichent en français.\nexport const mo: Record<string, string> = {\n"
for (const [key, fr, , mo] of rows.slice(1)) {
  if (mo?.trim()) { out += `  ${esc(key)}: ${esc(mo.trim())},\n`; done++ }
  else out += `  // ${esc(key)}: '', // FR : ${fr}\n`
}
writeFileSync('src/i18n/mo.ts', out + '}\n')
console.log(`${done} traduction(s) mooré importée(s) sur ${rows.length - 1}`)
