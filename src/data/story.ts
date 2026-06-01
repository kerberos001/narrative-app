export interface StoryOption {
  text: string;
  nextNode: string;
}

export interface StoryNode {
  title: string;
  text: string;
  options: StoryOption[];
  isFinal?: boolean;
}

export const storyData: Record<string, StoryNode> = {
  inicio: {
    title: "CAMINO ELEGIDO",
    text: "...The fog lifts, revealing three winding paths. To the west, ancient ruins loom; the east holds a dense forest; straight ahead lies a bustling port. Choices define your destiny. Which path calls to you, Jorge? The journey is long but rewarding. Decide carefully...",
    options: [
      { text: "CAMINO 1: RUINAS ANTIGUAS", nextNode: "ruinas" },
      { text: "CAMINO 2: BOSQUE DENSO", nextNode: "bosque" },
      { text: "CAMINO 3: PUERTO DE AVENTURA", nextNode: "puerto" }
    ]
  },
  ruinas: {
    title: "LAS RUINAS ANTIGUAS",
    text: "Te adentras en las ruinas arqueológicas. El suelo tiembla bajo tus pies y encuentras un viejo mapa grabado en piedra que parece apuntar hacia un astillero legendario donde construyen barcos míticos.",
    options: [
      { text: "Buscar una salida segura", nextNode: "inicio" },
      { text: "Seguir el mapa de piedra", nextNode: "final_victoria" },
      { text: "Explorar las catacumbas", nextNode: "bosque" }
    ]
  },
  bosque: {
    title: "EL BOSQUE DENSO",
    text: "El bosque es oscuro y los árboles susurran secretos. Te encuentras con un viejo sabio que te ofrece multiplicar tus $10 si respondes un acertijo, o puedes usar el río para llegar al puerto.",
    options: [
      { text: "Responder el acertijo", nextNode: "final_victoria" },
      { text: "Navegar por el río", nextNode: "puerto" },
      { text: "Volver al inicio", nextNode: "inicio" }
    ]
  },
  puerto: {
    title: "EL PUERTO DE AVENTURA",
    text: "Llegas al bullicioso puerto. El olor a sal marina te inunda. Ves un hermoso barco en venta, pero el vendedor te pide realizar una última misión de transporte para dejártelo a precio de oferta.",
    options: [
      { text: "Aceptar la misión del capitán", nextNode: "final_victoria" },
      { text: "Buscar trabajo en la taberna", nextNode: "ruinas" },
      { text: "Regresar al cruce de caminos", nextNode: "inicio" }
    ]
  },
  final_victoria: {
    title: "¡META COMPLETA!",
    text: "¡Increíble! Tus decisiones te han llevado al lugar correcto en el momento adecuado. Has acumulado los recursos necesarios y completado los desafíos.",
    options: [],
    isFinal: true
  }
};