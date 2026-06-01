import React from 'react';
import { useHistory } from 'react-router-dom';
import { 
  IonButton, 
  IonCard, 
  IonCardContent, 
  IonIcon, 
  IonItem, 
  IonLabel, 
  IonList 
} from '@ionic/react';
import { checkmarkCircleOutline, trophyOutline, refreshOutline, playOutline } from 'ionicons/icons';
import Layout from '../components/Layout';
import { useGame } from '../context/GameContext'; // Importamos nuestro hook

const Ending: React.FC = () => {
  const history = useHistory();
  const { profile, logout } = useGame(); // Extraemos los datos reales de Jorge

  const handleRestart = () => {
    logout(); // Limpiamos los estados de la partida anterior
    history.push('/welcome');
  };

  // Filtramos la lista para mostrar en pantalla solo los hitos que Jorge completó con éxito
  const hitosLogrados = profile?.hitosCumplidos.filter(hito => hito.is_completed) || [];

  return (
    <Layout title="¡FELICITACIONES!">
      <div className="ion-padding-top ion-text-center">
        
        <IonCard mode="ios" style={{ borderRadius: '16px', margin: '0 0 20px 0', overflow: 'visible' }}>
          <div style={{ position: 'absolute', width: '100%', top: '-15px', fontSize: '24px', letterSpacing: '10px' }}>
            🎉✨🎊✨🎉
          </div>

          <IonCardContent>
            <div style={{ fontSize: '90px', margin: '20px 0 10px 0', filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.1))' }}>
              Submarino u Barco ⛵
            </div>

            <h1 style={{ fontWeight: '900', fontSize: '24px', color: '#000', margin: '15px 0 5px 0' }}>
              ¡LO LOGRASTE, {profile?.name.toUpperCase() || 'JORGE'}!
            </h1>
            
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '25px', fontWeight: 'bold' }}>
              <IonIcon icon={trophyOutline} color="warning" /> ¡Tu destino de {profile?.final_goal} ha sido completado con ${profile?.money}!
            </p>

            <h3 style={{ textAlign: 'left', fontWeight: 'bold', fontSize: '14px', color: '#333', paddingLeft: '5px', marginBottom: '10px' }}>
              HITOS REALES CUMPLIDOS:
            </h3>

            <IonList lines="none">
              {hitosLogrados.length > 0 ? (
                hitosLogrados.map((hito) => (
                  <IonItem key={hito.id} style={{ 
                    '--background': '#e8f5e9', // Fondo verde suave para los completados
                    '--border-radius': '8px', 
                    marginBottom: '8px' 
                  }}>
                    <IonIcon slot="start" icon={checkmarkCircleOutline} color="success" style={{ fontSize: '20px' }} />
                    <IonLabel style={{ fontSize: '13px', fontWeight: '600', color: '#1b5e20' }}>
                      {hito.milestone_name}
                    </IonLabel>
                  </IonItem>
                ))
              ) : (
                <p style={{ color: '#999', fontSize: '12px' }}>Ningún hito registrado.</p>
              )}
            </IonList>

            <IonButton 
              expand="block" 
              size="large"
              style={{ '--border-radius': '10px', marginTop: '25px' }}
            >
              SIGUIENTE AVENTURA
              <IonIcon slot="end" icon={playOutline} />
            </IonButton>

          </IonCardContent>
        </IonCard>

        <IonButton 
          expand="block" 
          size="large" 
          fill="outline"
          onClick={handleRestart}
          style={{ '--border-radius': '10px' }}
        >
          <IonIcon slot="start" icon={refreshOutline} />
          INICIO
        </IonButton>

      </div>
    </Layout>
  );
};

export default Ending;
