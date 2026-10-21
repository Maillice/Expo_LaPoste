import { useLang } from './hooks/useLang'
import AppRoutes from './routes/AppRoutes'
export default function App() {
  const { lang } = useLang()
  return (<div key={lang} className="fade"><AppRoutes /></div>)
}
