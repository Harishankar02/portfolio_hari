import { createRoot } from 'react-dom/client'
import '@fontsource/rozha-one/devanagari-400.css'
import '@fontsource/rozha-one/latin-400.css'
import '@fontsource/courier-prime/latin-400.css'
import '@fontsource/courier-prime/latin-700.css'
import '@fontsource/spectral/latin-400.css'
import '@fontsource/spectral/latin-400-italic.css'
import '@fontsource/spectral/latin-600.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(<App />)
