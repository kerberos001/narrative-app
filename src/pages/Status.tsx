import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  IonCard, 
  IonCardContent, 
  IonIcon, 
  IonItem, 
  IonLabel, 
  IonList, 
  IonButton,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol,
  IonLoading
} from '@ionic/react';
import { 
  cashOutline, 
  flashOutline, 
  heartOutline, 
  medkitOutline, 
  checkmarkCircleOutline, 
  ellipseOutline,
  arrowBackOutline,
  ribbonOutline // 🛠️ Añadimos un icono elegante para la meta final
} from 'ionicons/icons';
import Layout from '../components/Layout';
import { useGame } from '../context/GameContext';
import { API_ROUTES } from '../data/apiRoutes';

interface PlayerStatusResponse {
  money: number;
  energy: number;
  hp: number;
  is_sick: boolean;
  final_goal: string,
  story_milestone: Array<{
    id: number;
    player_id: string;
    is_completed: boolean;
    blocks_ending: boolean;
    milestone_name: string;
    money_required: number;
  }>;
}

const Status: React.FC = () => {
  const history = useHistory();
  const { profile, currentNarrative } = useGame();
  
  const [statusData, setStatusData] = useState<PlayerStatusResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStatus = async () => {
      const playerId = currentNarrative?.player_id || "";
      
      if (!profile) {
        setLoading(false);
        return;
      }

      try {
        const payload = {
          id: playerId,
          name: profile.name,
          user_name: profile.user_name,
          age: profile.age,
          money: profile.money,
          final_goal: profile.final_goal
        };

        const response = await fetch(API_ROUTES.getPlayerStatus, {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const data = await response.json();
          setStatusData(data);
        }
      } catch (error) {
        console.error("Error al traer el estado del jugador:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [profile, currentNarrative]);

  if (loading) {
    return (
      <IonLoading isOpen={loading} message="Consultando estado..." spinner="crescent" mode="ios" />
    );
  }

  return (
    <Layout title="ESTADO DEL JUGADOR">
      <div className="ion-padding-top">
        
        {/* Sección de Estadísticas Básicas */}
        <h3 style={{ fontWeight: 'bold', fontSize: '16px', color: '#1e56a0', paddingLeft: '8px' }}>
          Atributos de {profile?.name || 'Sophie'}
        </h3>

        <IonGrid className="ion-no-padding" style={{ marginBottom: '20px' }}>
          <IonRow>
            {/* Dinero */}
            <IonCol size="6">
              <IonCard mode="ios" style={{ margin: '4px', border: '1px solid #e0e0e0', boxShadow: 'none' }}>
                <IonCardContent className="ion-text-center">
                  <IonIcon icon={cashOutline} color="success" style={{ fontSize: '28px' }} />
                  <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '5px 0 0 0', color: '#000' }}>
                    ${statusData?.money ?? 0}
                  </h2>
                  <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Dinero</p>
                </IonCardContent>
              </IonCard>
            </IonCol>

            {/* Energía */}
            <IonCol size="6">
              <IonCard mode="ios" style={{ margin: '4px', border: '1px solid #e0e0e0', boxShadow: 'none' }}>
                <IonCardContent className="ion-text-center">
                  <IonIcon icon={flashOutline} color="warning" style={{ fontSize: '28px' }} />
                  <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '5px 0 0 0', color: '#000' }}>
                    {statusData?.energy ?? 0}
                  </h2>
                  <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Energía</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

          <IonRow>
            {/* Vida (HP) */}
            <IonCol size="6">
              <IonCard mode="ios" style={{ margin: '4px', border: '1px solid #e0e0e0', boxShadow: 'none' }}>
                <IonCardContent className="ion-text-center">
                  <IonIcon icon={heartOutline} color="danger" style={{ fontSize: '28px' }} />
                  <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '5px 0 0 0', color: '#000' }}>
                    {statusData?.hp ?? 0}/100
                  </h2>
                  <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Salud (HP)</p>
                </IonCardContent>
              </IonCard>
            </IonCol>

            {/* Enfermedad */}
            <IonCol size="6">
              <IonCard mode="ios" style={{ margin: '4px', border: '1px solid #e0e0e0', boxShadow: 'none' }}>
                <IonCardContent className="ion-text-center">
                  <IonIcon icon={medkitOutline} color={statusData?.is_sick ? "danger" : "primary"} style={{ fontSize: '28px' }} />
                  <div style={{ marginTop: '5px' }}>
                    {statusData?.is_sick ? (
                      <IonBadge color="danger">Enfermo 🤒</IonBadge>
                    ) : (
                      <IonBadge color="success">Sano 👍</IonBadge>
                    )}
                  </div>
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '4px', marginBottom: 0 }}>Estado de Salud</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* 🛠️ NUEVA SECCIÓN: OBJETIVO FINAL DEL JUGADOR */}
        <h3 style={{ fontWeight: 'bold', fontSize: '16px', color: '#1e56a0', paddingLeft: '8px', marginBottom: '10px' }}>
          Objetivo de la Vida
        </h3>
        <IonCard mode="ios" style={{ borderRadius: '16px', margin: '0 0 25px 0', border: '1px solid #e0e0e0', background: '#f4f6f9', boxShadow: 'none' }}>
          <IonCardContent style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px' }}>
            <div style={{ background: '#1e56a0', padding: '10px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <IonIcon icon={ribbonOutline} style={{ fontSize: '24px', color: '#fff' }} />
            </div>
            <div>
              <p style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 2px 0', fontWeight: 'bold' }}>
                Meta Final Establecida
              </p>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#000', margin: 0, fontStyle: 'italic' }}>
                "{statusData?.final_goal || 'Sin meta definida'}"
              </h2>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Sección de Story Milestones */}
        <h3 style={{ fontWeight: 'bold', fontSize: '16px', color: '#1e56a0', paddingLeft: '8px', marginBottom: '10px' }}>
          Lista de Hitos de la Historia
        </h3>

        <IonCard mode="ios" style={{ borderRadius: '16px', margin: '0 0 20px 0', border: '1px solid #e0e0e0', boxShadow: 'none' }}>
          <IonCardContent style={{ padding: '8px' }}>
            <IonList lines="full">
              {statusData?.story_milestone && statusData.story_milestone.length > 0 ? (
                statusData.story_milestone.map((milestone) => (
                  <IonItem key={milestone.id} style={{ '--padding-start': '8px' }}>
                    <IonIcon 
                      slot="start" 
                      icon={milestone.is_completed ? checkmarkCircleOutline : ellipseOutline} 
                      color={milestone.is_completed ? "success" : "medium"} 
                      style={{ fontSize: '22px' }}
                    />
                    <IonLabel className="ion-text-wrap">
                      <h2 style={{ 
                        fontSize: '14px', 
                        fontWeight: '600',
                        color: milestone.is_completed ? '#2dd36f' : '#333',
                        textDecoration: milestone.is_completed ? 'line-through' : 'none'
                      }}>
                        {milestone.milestone_name}
                      </h2>
                      {milestone.blocks_ending && !milestone.is_completed && (
                        <p style={{ fontSize: '11px', color: '#eb445a', fontWeight: 'bold' }}>
                          ⚠️ Requerido para finalizar el juego
                        </p>
                      )}
                    </IonLabel>
                  </IonItem>
                ))
              ) : (
                <div className="ion-text-center ion-padding" style={{ color: '#999' }}>
                  No hay hitos disponibles para esta historia.
                </div>
              )}
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* Botón para volver a la aventura */}
        <IonButton 
          expand="block" 
          fill="clear" 
          onClick={() => history.goBack()}
          style={{ marginTop: '10px', color: '#1e56a0', fontWeight: 'bold' }}
        >
          <IonIcon slot="start" icon={arrowBackOutline} />
          VOLVER A LA HISTORIA
        </IonButton>

      </div>
    </Layout>
  );
};

export default Status;