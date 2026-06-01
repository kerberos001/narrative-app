import React from 'react';
import { useHistory } from 'react-router-dom';
import { 
  IonButton, 
  IonCard, 
  IonCardContent, 
  IonIcon 
} from '@ionic/react';
import { arrowForwardOutline, personAddOutline } from 'ionicons/icons';
import Layout from '../components/Layout';

const Welcome: React.FC = () => {
  const history = useHistory();

  // Funciones para navegar a las siguientes pantallas
  const handleGoToLogin = () => {
    history.push('/login');
  };

  const handleGoToRegister = () => {
    history.push('/register');
  };

  return (
    <Layout title="ADVENTURE PATH">
      <div className="ion-text-center ion-padding-top">
        
        {/* Tarjeta contenedora de la Ilustración Central */}
        <IonCard mode="ios" style={{ background: '#f4f5f8', borderRadius: '16px', boxShadow: 'none' }}>
          <IonCardContent className="ion-text-center">
            {/* Aquí puedes reemplazar este div por tu imagen <img src="..." /> cuando la tengas en assets */}
            <div style={{ fontSize: '100px', margin: '20px 0' }}>
              🗺️🧭
            </div>
          </IonCardContent>
        </IonCard>

        {/* Texto de Pregunta Principal */}
        <h1 style={{ fontWeight: 'bold', fontSize: '24px', margin: '30px 0 20px 0' }}>
          ¿ESTÁS REGISTRADO?
        </h1>

        {/* Botón 1: Sí, ya estoy registrado (Va a Login) */}
        <IonButton 
          expand="block" 
          size="large" 
          className="ion-margin-bottom"
          onClick={handleGoToLogin}
          style={{ '--border-radius': '10px' }}
        >
          SÍ, YA ESTOY REGISTRADO
          <IonIcon slot="end" icon={arrowForwardOutline} />
        </IonButton>

        {/* Botón 2: No, soy nuevo (Va a Registro) */}
        <IonButton 
          expand="block" 
          size="large" 
          fill="outline"
          onClick={handleGoToRegister}
          style={{ '--border-radius': '10px' }}
        >
          NO, SOY NUEVO
          <IonIcon slot="end" icon={personAddOutline} />
        </IonButton>

      </div>
    </Layout>
  );
};

export default Welcome;