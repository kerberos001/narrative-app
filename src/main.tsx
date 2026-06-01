import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// 1. Importar la función de registro automático de la PWA
// @ts-ignore
import { registerSW } from 'virtual:pwa-register'

// 2. Importar los estilos de Ionic (que ya configuramos antes)
import '@ionic/react/css/core.css'
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'
import './index.css'

// 3. Registrar el Service Worker para que la PWA funcione Offline e instalable
// 'autoUpdate' hace que si subes cambios, la app se actualice sola en el cel del usuario
registerSW({ immediate: true })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)