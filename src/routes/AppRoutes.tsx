import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
const Home = lazy(() => import('../pages/Home/Home'))
const Language = lazy(() => import('../pages/Language/Language'))
const Exhibition = lazy(() => import('../pages/Exhibition/Exhibition'))
const Catalogue = lazy(() => import('../pages/Catalogue/Catalogue'))
const PieceDetails = lazy(() => import('../pages/PieceDetails/PieceDetails'))
const Collections = lazy(() => import('../pages/Collections/Collections'))
const About = lazy(() => import('../pages/About/About'))
const Search = lazy(() => import('../pages/Search/Search'))
const Viewer3D = lazy(() => import('../pages/Viewer3D/Viewer3D')) // Three.js ne sera chargé que sur cette route
export default function AppRoutes() {
  return (
    <Suspense fallback={<p className="p-10 text-center">Chargement…</p>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/langue" element={<Language />} />
        <Route path="/exposition" element={<Exhibition />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/catalogue/:id" element={<PieceDetails />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/collections/:id" element={<Collections />} />
        <Route path="/a-propos" element={<About />} />
        <Route path="/recherche" element={<Search />} />
        <Route path="/viewer-3d/:id" element={<Viewer3D />} />
      </Routes>
    </Suspense>
  )
}
