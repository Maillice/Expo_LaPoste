import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Bounds, Center, OrbitControls, useGLTF } from '@react-three/drei'
useGLTF.setDecoderPath('/draco/') // décodeur local (copié par scripts/copy-draco.mjs)
function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url) // lève une erreur si le fichier est absent : gérée par l'ErrorBoundary parente
  return <primitive object={scene} />
}
// Cadrage automatique (échelle et position quelconques), rotation 360°, zoom, déplacement. Éclairage local : aucun chargement externe.
export default function ModelViewer({ url }: { url: string }) {
  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 45 }} aria-label="Modèle 3D du timbre">
      <hemisphereLight args={['#ffffff', '#445', 1.1]} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} />
      <directionalLight position={[-3, -2, -4]} intensity={0.6} />
      <Suspense fallback={null}>
        <Bounds fit observe margin={1.3}><Center><Model url={url} /></Center></Bounds>
      </Suspense>
      <OrbitControls enablePan enableZoom makeDefault />
    </Canvas>
  )
}
