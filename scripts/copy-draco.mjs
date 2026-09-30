// Copie le décodeur Draco de three.js dans public/draco : les modèles 3D compressés se chargent sans CDN externe.
import { cpSync, existsSync, mkdirSync } from 'node:fs'
const from = 'node_modules/three/examples/jsm/libs/draco/gltf'
if (existsSync(from)) { mkdirSync('public/draco', { recursive: true }); cpSync(from, 'public/draco', { recursive: true }); console.log('Décodeur Draco copié dans public/draco') }
else console.warn('three non installé : lancez npm install')
