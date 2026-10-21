// Couleurs officielles : charte graphique La Poste Burkina Faso (bleu dégradé C100 M60 / C100 M25, jaune or C0 M10 Y100)
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {
    colors: { bleu: '#1C63B7', bleu2: '#0C8DD7', ciel: '#0C8DD7', nuit: '#1C63B7', or: '#FDDD04', dore: '#FDDD04', papier: '#eef5fa', terre: '#EC1C26', savane: '#2B9341', encre: '#092d49' },
    fontFamily: { display: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'], sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'] }
  } },
  plugins: [],
}
