// 1. Leemos la IP del archivo .env usando la sintaxis nativa de Vite
const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// 2. Definimos y exportamos las constantes de las rutas de tu API
export const API_ROUTES = {
  // Ruta dinámica para el player (recibe el username)
  getPlayer: (username: string) => `${BASE_URL}narrative/player/${username}`,
  
  createPlayer: `${BASE_URL}narrative/create_player/`,
  getNarrative: `${BASE_URL}narrative/narrative/`,
  continueNarrative: `${BASE_URL}narrative/continue_narrative/`,
  checkMilestones: `${BASE_URL}narrative/story_milestones/`,
  getPlayerStatus: `${BASE_URL}narrative/status/`,
};