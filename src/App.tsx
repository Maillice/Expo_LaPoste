import { useLocation } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import { useLang } from './hooks/useLang'
import AppRoutes from './routes/AppRoutes'
// Pages immersives : sans navbar/footer
const immersive = ['/langue', '/exposition', '/viewer-3d']
export default function App() {
  const { pathname } = useLocation()
  const { lang } = useLang()
  const bare = immersive.some((p) => pathname.startsWith(p))
  return (<>{!bare && <Navbar />}<div key={lang} className="fade"><AppRoutes /></div>{!bare && <Footer />}</>)
}
