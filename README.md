# Narrative App

Aplicación web progresiva (PWA) de aventura narrativa interactiva. El jugador crea un personaje, toma decisiones que afectan su dinero, energía y salud, y avanza por una historia generada dinámicamente hasta cumplir los hitos necesarios para alcanzar la victoria — o perecer en el intento.

## Descripción

**Narrative App** es un juego de elecciones con narrativa ramificada conectado a un backend REST. Cada partida comienza con el registro o inicio de sesión de un jugador; a partir de ahí, el servidor entrega escenas de texto y opciones con consecuencias mecánicas (dinero, energía, HP). El objetivo es completar todos los hitos de la historia (`story milestones`) que bloquean el final antes de quedarse sin puntos de vida.

La interfaz está pensada para móvil gracias a **Ionic React**, y la app puede instalarse como PWA sin necesidad de publicar en una tienda de aplicaciones.

## Características

- **Registro y login de jugadores** con validación de formulario (nombre, username, edad, dinero inicial).
- **Narrativa dinámica** obtenida desde la API en cada turno.
- **Sistema de recursos**: dinero, energía, HP y estado de salud (sano/enfermo).
- **Hitos de historia** que deben completarse para desbloquear el final.
- **Game Over** si el HP del personaje llega a cero.
- **Pantalla de estado** con atributos del jugador, meta final e hitos pendientes o completados.
- **PWA** con soporte offline parcial y actualización automática del service worker.

## Flujo de la aplicación

```
Bienvenida → Login / Registro → Aventura ⇄ Estado → Final (victoria) o Game Over
```

| Pantalla   | Ruta         | Descripción                                              |
|------------|--------------|----------------------------------------------------------|
| Welcome    | `/welcome`   | Punto de entrada: login o registro                       |
| Login      | `/login`     | Acceso con username existente                            |
| Register   | `/register`  | Creación de perfil de jugador                            |
| Adventure  | `/adventure` | Narrativa activa y elección de opciones                  |
| Status     | `/status`    | Estadísticas, meta final e hitos de la historia          |
| Ending     | `/ending`    | Pantalla de victoria al completar todos los hitos        |

## Stack tecnológico

| Tecnología        | Uso                                      |
|-------------------|------------------------------------------|
| React 19          | UI y componentes                         |
| TypeScript        | Tipado estático                          |
| Vite 8            | Bundler y servidor de desarrollo         |
| Ionic React 8     | Componentes móviles y navegación         |
| vite-plugin-pwa   | Service worker y manifiesto PWA          |
| React Router      | Enrutamiento entre pantallas             |

## Estructura del proyecto

```
src/
├── App.tsx                 # Rutas y proveedor de contexto global
├── components/
│   ├── Layout.tsx          # Layout común con cabecera y navegación
│   └── OptionButton.tsx    # Botón reutilizable para opciones de la historia
├── context/
│   └── GameContext.tsx     # Estado global: perfil, narrativa y lógica de juego
├── data/
│   ├── apiRoutes.ts        # URLs del backend (configurable vía .env)
│   └── story.ts            # Datos de historia estáticos (referencia local)
├── pages/
│   ├── Welcome.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Adventure.tsx
│   ├── Status.tsx
│   └── Ending.tsx
└── theme/
    └── variables.css       # Variables de color y tema Ionic
```

## API backend

La app espera un servidor REST en la URL configurada por la variable de entorno `VITE_API_URL` (por defecto `http://127.0.0.1:8000`).

| Método | Endpoint                              | Descripción                        |
|--------|---------------------------------------|------------------------------------|
| GET    | `/narrative/player/{username}`        | Obtener jugador existente          |
| POST   | `/narrative/create_player/`           | Crear nuevo jugador                |
| POST   | `/narrative/narrative/`               | Obtener escena narrativa actual    |
| POST   | `/narrative/continue_narrative/`      | Registrar la opción elegida        |
| POST   | `/narrative/story_milestones/`        | Verificar hitos completados        |
| POST   | `/narrative/status/`                  | Consultar estado completo del jugador |

## Configuración

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://127.0.0.1:8000
```

## Requisitos previos

- Node.js 18+
- Backend de narrativa en ejecución (ver endpoints anteriores)

## Instalación y ejecución

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Vista previa del build
npm run preview

# Linter
npm run lint
```

## Scripts disponibles

| Script          | Descripción                              |
|-----------------|------------------------------------------|
| `npm run dev`   | Inicia Vite en modo desarrollo con HMR   |
| `npm run build` | Compila TypeScript y genera el bundle    |
| `npm run preview` | Sirve el build de producción localmente |
| `npm run lint`  | Ejecuta ESLint sobre el código fuente    |

## Licencia

Proyecto privado.
