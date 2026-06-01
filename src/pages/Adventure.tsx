import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  IonCard, 
  IonCardContent, 
  IonIcon, 
  IonLoading, 
  IonButtons, 
  IonButton, 
  IonAlert 
} from '@ionic/react';
import { compassOutline, logOutOutline } from 'ionicons/icons';
import Layout from '../components/Layout';
import OptionButton from '../components/OptionButton';
import { useGame } from '../context/GameContext';

const Adventure: React.FC = () => {
  const history = useHistory();
  
  // Estados locales para el Loading y para la Alerta de confirmación
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [showExitAlert, setShowExitAlert] = useState<boolean>(false);
  const [showGameOverAlert, setShowGameOverAlert] = useState<boolean>(false);
  
  // Extraemos los datos, la función de juego y el método logout para limpiar el estado global
  const { currentNarrative, selectOptionAndContinue, logout } = useGame();

  if (!currentNarrative) {
    return (
      <Layout title="CARGANDO...">
        <div className="ion-text-center ion-padding">Cargando tu destino...</div>
      </Layout>
    );
  }

  // Manejador para continuar la historia al pulsar un camino
const handleOptionClick = async (opcion: any) => {
  setShowLoading(true);
  try {
    const resultado = await selectOptionAndContinue(opcion);
    
    if (resultado === 'DEAD') {
      // 💀 GATILLAMOS EL GAME OVER
      setShowLoading(false);
      setShowGameOverAlert(true);
      return;
    }
    
    if (resultado === true) {
      history.push('/ending');
    }
  } catch (error) {
    console.error("Error al procesar la opción", error);
  } finally {
    // Solo apagamos el loading si el personaje sigue vivo para evitar parpadeos antes de la alerta
    if (!showGameOverAlert) setShowLoading(false);
  }
};

  // Función que se ejecuta cuando el usuario confirma que quiere abandonar la partida
  const handleConfirmExit = () => {
    logout(); // 🧠 Limpiamos por completo el "cerebro" global (profile y narrative a null)
    history.push('/welcome'); // Redirigimos a la pantalla de Bienvenida
  };

  return (
    <Layout 
      title="TU AVENTURA"
      // 🛠️ Inyectamos el botón en la barra superior usando los headers dinámicos si tu Layout los soporta,
      // o puedes renderizarlo directamente aquí. Si tu componente Layout acepta botones, se pasa como prop:
      customButtons={
        <IonButtons slot="end">
          {/* Botón nuevo para consultar Estadísticas */}
          <IonButton color="primary" onClick={() => history.push('/status')} style={{ marginRight: '8px', fontWeight: 'bold' }}>
            ESTADO 📊
          </IonButton>
          
          <IonButton color="danger" onClick={() => setShowExitAlert(true)}>
            <IonIcon slot="icon-only" icon={logOutOutline} />
          </IonButton>
        </IonButtons>
      }
    >
      <div className="ion-padding-top">
        
        {/* Componente de Carga */}
        <IonLoading
          isOpen={showLoading}
          message={'El destino se está escribiendo... ✨'}
          spinner="crescent"
          mode="ios"
        />

        {/* 🛠️ Alerta Nativa de Confirmación de Salida */}
        <IonAlert
          isOpen={showExitAlert}
          onDidDismiss={() => setShowExitAlert(false)}
          header={'¿Abandonar aventura?'}
          message={'Para retomar la aventura solo ingresa tu username de registro.'}
          mode="ios"
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel',
              cssClass: 'secondary'
            },
            {
              text: 'Salir',
              role: 'destructive',
              handler: handleConfirmExit // Si confirma, limpia y sale
            }
          ]}
        />
        {/* 💀 Alerta Nativa de GAME OVER */}
        <IonAlert
          isOpen={showGameOverAlert}
          backdropDismiss={false} // Obliga al usuario a interactuar con el botón, no puede cerrar tocando fuera
          header={'☠️ GAME OVER ☠️'}
          subHeader={'Tu aventura ha terminado de forma trágica'}
          message={
            'Tus decisiones hicieron que tu personaje muriera. En el cruel camino hacia tus ambiciones, ' +
            'calcular mal los riesgos te costó caro. Te has quedado sin salud debido a los peligros ' +
            'del entorno y el agotamiento físico. La historia se ha cerrado y tu meta final se ha desvanecido en el olvido.'
          }
          mode="ios"
          buttons={[
            {
              text: 'INTENTAR DE NUEVO 🔄',
              handler: () => {
                setShowGameOverAlert(false);
                history.push('/welcome'); // Mandamos al inicio para re-crear personaje
              }
            }
          ]}
        />
        
        <IonCard mode="ios" style={{ borderRadius: '16px', margin: '0 0 25px 0', border: '1px solid #e0e0e0', boxShadow: 'none' }}>
          <IonCardContent style={{ color: '#333', fontSize: '15px', lineHeight: '1.6', textAlign: 'justify' }}>
            <p style={{ fontWeight: 'bold', color: '#1e56a0', marginBottom: '10px' }}>
              HISTORIA EN DESARROLLO
            </p>
            {currentNarrative.narrativa}
          </IonCardContent>
        </IonCard>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {currentNarrative.opciones.map((opcion) => (
            <OptionButton 
              key={opcion.id}
              text={`${opcion.description} (Efecto: $${opcion.money} / Enrg: ${opcion.energy})`} 
              onClick={() => handleOptionClick(opcion)} 
            />
          ))}
        </div>

        <div className="ion-text-center" style={{ marginTop: '30px', fontSize: '40px', opacity: 0.2 }}>
          <IonIcon icon={compassOutline} />
        </div>

      </div>
    </Layout>
  );
};

export default Adventure;