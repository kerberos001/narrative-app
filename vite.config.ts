import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Si usas Vue, dirá plugin-vue
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Actualiza la app automáticamente cuando subas cambios
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Mi Aplicación Híbrida Ionic',
        short_name: 'IonicPWA',
        description: 'Mi increíble PWA con Vite e Ionic sin usar APK',
        theme_color: '#3880ff', // El color de la barra de estado en el móvil (azul de Ionic)
        background_color: '#ffffff',
        display: 'standalone', // Hace que se abra a pantalla completa sin la barra del navegador
        orientation: 'portrait', // Fuerza la orientación vertical en móviles (opcional)
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // Permite que Android adapte el icono a círculos/cuadrados
          }
        ]
      }
    })
  ]
});