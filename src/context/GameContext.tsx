import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { API_ROUTES } from '../data/apiRoutes';

export interface StoryMilestone {
  id: number;
  milestone_name: string;
  money_required: number;
  is_completed: boolean;
  player_id: string;
  blocks_ending: boolean;
}

export interface UserProfile {
  name: string;
  user_name: string;
  age: number;
  money: number;
  hitosCumplidos: StoryMilestone[]; 
  final_goal: string;
  hp: number;       
  energy: number;   
  is_sick: boolean;
  category_id?: number; // 🛠️ Añadido opcional para el payload de finalización
}

export interface NarrativeOption {
  id: number;
  description: string; 
  money: number;
  energy: number;
  hp: number;
  narrative_id: string;
}

export interface CurrentNarrative {
  player_id: string;
  narrativa: string;   
  opciones: NarrativeOption[];
}

interface GameContextType {
  profile: UserProfile | null;
  currentNarrative: CurrentNarrative | null;
  loginUser: (username: string) => Promise<boolean>;
  registerUser: (data: Omit<UserProfile, 'hitosCumplidos'>) => Promise<boolean>;
  setNarrativeData: (narrative: CurrentNarrative) => void;
  selectOptionAndContinue: (selectedOption: NarrativeOption) => Promise<boolean | 'DEAD'>;
  logout: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [currentNarrative, setCurrentNarrative] = useState<CurrentNarrative | null>(null);

  // Helper para pedir la narrativa al backend
  const fetchNarrative = async (playerData: any): Promise<CurrentNarrative | null> => {
    try {
      const response = await fetch(API_ROUTES.getNarrative, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(playerData)
      });

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (e) {
      console.error("Error obtuvo narrativa:", e);
      return null;
    }
  };

  // Login
  const loginUser = async (username: string): Promise<boolean> => {
    try {
      const response = await fetch(API_ROUTES.getPlayer(username), {
        method: 'GET',
        headers: { 'accept': 'application/json' }
      });

      if (!response.ok) return false;
      const data = await response.json();

      const userFullProfile: UserProfile = {
        name: data.name,
        user_name: data.user_name,
        age: data.age,
        money: data.money,
        hitosCumplidos: [],
        final_goal: data.final_goal || "",
        hp: data.hp || 100,
        energy: data.energy || 100,
        is_sick: data.is_sick || false,
        category_id: data.category_id || 0
      };
      setProfile(userFullProfile);

      const initialPayload = {
        id: data.id || "",
        name: data.name,
        user_name: data.user_name,
        age: data.age,
        money: data.money,
      };
      
      const narrativeData = await fetchNarrative(initialPayload);
      if (narrativeData) {
        setCurrentNarrative(narrativeData);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  // Register
  const registerUser = async (newData: Omit<UserProfile, 'hitosCumplidos'>): Promise<boolean> => {
    try {
      const payload = {
        id: "", 
        ...newData
      };

      const resCreate = await fetch(API_ROUTES.createPlayer, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!resCreate.ok) {
        alert("Error al registrar el jugador en el servidor principal.");
        return false;
      }

      const data = await resCreate.json();
      payload.id = data.id;

      const narrativeData = await fetchNarrative(payload);
      
      if (narrativeData) {
        setProfile({
          ...newData,
          hitosCumplidos: [],
          hp: 100,
          energy: 100,
          is_sick: false
        });
        setCurrentNarrative(narrativeData);
        return true;
      }

      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  // 🛠️ FUNCCIÓN AVANZAR HISTORIA (CON SOPORTE DE LLAMADA FINISH EN PERMADEATH)
  const selectOptionAndContinue = async (selectedOption: NarrativeOption): Promise<boolean | 'DEAD'> => {
    if (!currentNarrative || !profile) return false;

    try {
      // ----------------------------------------------------------------------
      // PASO 1: Notificar la decisión tomada al endpoint de continuación
      // ----------------------------------------------------------------------
      const payloadContinue = {
        player_id: currentNarrative.player_id,
        narrativa: currentNarrative.narrativa,
        contexto_resumen: "",
        reglas_del_mundo: "",
        opciones: [selectedOption]
      };

      const responseContinue = await fetch(API_ROUTES.continueNarrative, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payloadContinue)
      });

      if (!responseContinue.ok) return false;
      await responseContinue.json();

      // Evaluamos el impacto inmediato en los puntos de vida (HP) y el dinero
      const nuevoHP = (profile.hp ?? 100) + selectedOption.hp;
      const nuevoDinero = profile.money + selectedOption.money;

      // 💥 REGLA DE SALUD CRÍTICA: HP es igual o menor a 0
      if (nuevoHP <= 0) {
        console.log("💀 El personaje se ha quedado sin puntos de vida. Notificando fin de juego...");
        
        // 🛠️ Ejecutamos el servicio de cambio de estado hacia el endpoint /finish
        try {
          const payloadFinish = {
            id: currentNarrative.player_id,
            name: profile.name,
            user_name: profile.user_name,
            age: profile.age,
            money: nuevoDinero, // Enviamos el dinero final resultante
            final_goal: profile.final_goal || "",
            category_id: profile.category_id || 0
          };

          // Recuerda usar el nombre correcto mapeado en tus apiRoutes (API_ROUTES.getFinish)
          await fetch(API_ROUTES.getFinish, {
            method: 'POST',
            headers: {
              'accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payloadFinish)
          });
          console.log("✅ Servidor de finalización notificado con éxito.");
        } catch (finishError) {
          // Captura un error aislado de red en el finish sin interrumpir el flujo visual de derrota
          console.error("No se pudo sincronizar el estado /finish con el servidor:", finishError);
        }

        logout(); // Limpiamos la memoria local
        return 'DEAD'; // Interrumpimos el flujo y disparamos el IonAlert de derrota
      }

      // ----------------------------------------------------------------------
      // PASO 3: Verificar estado de Milestones (El juego sigue vivo aquí)
      // ----------------------------------------------------------------------
      const payloadMilestones = {
        id: currentNarrative.player_id,
        name: profile.name,
        user_name: profile.user_name,
        age: profile.age,
        money: nuevoDinero,
      };

      const responseMilestones = await fetch(API_ROUTES.checkMilestones, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payloadMilestones)
      });

      if (responseMilestones.ok) {
        const milestonesList: StoryMilestone[] = await responseMilestones.json();
        
        setProfile({
          ...profile,
          money: nuevoDinero,
          hp: nuevoHP, // Actualizamos también dinámicamente la salud si continúa
          hitosCumplidos: milestonesList
        });

        const quedaHitoPendiente = milestonesList.some(
          (hito) => hito.blocks_ending && !hito.is_completed
        );

        if (!quedaHitoPendiente) {
          return true; // Victoria
        }
      }

      // ----------------------------------------------------------------------
      // PASO 2: Pedir nueva narrativa si continúa con vida
      // ----------------------------------------------------------------------
      const payloadNextNarrative = {
        id: currentNarrative.player_id,
        name: profile.name,
        user_name: profile.user_name,
        age: profile.age,
        money: nuevoDinero,
      };

      const responseNarrative = await fetch(API_ROUTES.getNarrative, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payloadNextNarrative)
      });

      if (!responseNarrative.ok) return false;
      const nextNarrativeData: CurrentNarrative = await responseNarrative.json();
      setCurrentNarrative(nextNarrativeData);

      if (nextNarrativeData.opciones.length === 0) {
        return true; 
      }

      return false; 
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const logout = () => {
    setProfile(null);
    setCurrentNarrative(null);
  };

  return (
    <GameContext.Provider value={{ 
      profile, 
      currentNarrative, 
      loginUser, 
      registerUser, 
      setNarrativeData: setCurrentNarrative, 
      selectOptionAndContinue, 
      logout 
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame debe ser usado dentro de un GameProvider');
  }
  return context;
};