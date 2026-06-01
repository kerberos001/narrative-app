# 1. Asegurar la creación de la estructura de directorios
mkdir -p src/assets
mkdir -p src/components
mkdir -p src/context
mkdir -p src/data
mkdir -p src/pages
mkdir -p src/theme

# 2. Crear archivos dentro de components
touch src/components/Layout.tsx
touch src/components/OptionButton.tsx

# 3. Crear el archivo del contexto (estado del juego)
touch src/context/GameContext.tsx

# 4. Crear el archivo de datos para la historia/caminos
touch src/data/story.ts

# 5. Crear las 5 pantallas (Pages) basadas en la imagen
touch src/pages/Welcome.tsx
touch src/pages/Login.tsx
touch src/pages/Register.tsx
touch src/pages/Adventure.tsx
touch src/pages/Ending.tsx

# 6. Crear/asegurar archivos base de entorno y estilos si no existen
touch src/theme/variables.css
touch src/vite-env.d.ts

# 7. Mostrar mensaje de éxito en la consola
echo "✅ ¡Estructura de carpetas y archivos para tu PWA creada con éxito!"