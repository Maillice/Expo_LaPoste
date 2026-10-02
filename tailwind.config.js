// Palette issue du prototype HTML fourni (voir docs/CHARTE.md)
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {
    colors: { bleu: '#086db0', bleu2: '#0a4f86', nuit: '#063d6a', or: '#ffd400', dore: '#f4b51b', papier: '#eef5fa', terre: '#b23a2e', savane: '#1f6b45', encre: '#092d49' },
    fontFamily: { display: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'], sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'] }
  } },
  plugins: [],
}
