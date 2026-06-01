import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { 
  IonButton, 
  IonCard, 
  IonCardContent, 
  IonInput, 
  IonItem, 
  IonLabel, 
  IonList,
  IonIcon
} from '@ionic/react';
import { logInOutline, arrowBackOutline } from 'ionicons/icons';
import Layout from '../components/Layout';

const Login: React.FC = () => {
  const history = useHistory();
  const [username, setUsername] = useState<string>('');
  const { loginUser } = useGame();

// 1. Asegúrate de agregar 'async' aquí
  const handleLogin = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      alert('Por favor, ingresa tu username.');
      return;
    }

    // Traemos la función del contexto (asegúrate de importar useGame arriba si no lo habías hecho)
    // const { loginUser } = useGame();

    console.log('Buscando usuario en el servidor...');
    
    // 2. Esperamos a que la API responda
    const loginExitoso = await loginUser(username);

    if (loginExitoso) {
      // Si la API encontró a kerberos, avanzamos a la aventura
      history.push('/adventure');
    } else {
      // Si la API dio error o no existe el usuario
      alert('El username no existe en el servidor. Prueba con "kerberos" o regístrate.');
    }
  };

  return (
    // Usamos nuestro Layout con la flecha de atrás activada hacia la bienvenida
    <Layout title="INICIAR SESIÓN" showBackButton={true}>
      <div className="ion-padding-top">
        
        {/* Tarjeta central blanca de la maqueta */}
        <IonCard mode="ios" style={{ borderRadius: '16px', margin: '0 0 20px 0' }}>
          <IonCardContent className="ion-text-center">
            
            {/* Icono de la llave superior */}
            <div style={{ fontSize: '60px', margin: '10px 0' }}>🔑</div>
            
            <h2 style={{ fontWeight: 'bold', fontSize: '22px', color: '#000', marginBottom: '20px' }}>
              LOGIN
            </h2>

            {/* Formulario HTML nativo para permitir el botón "Intro/Enter" del teclado del celular */}
            <form onSubmit={handleLogin}>
              <IonList lines="none">
                {/* Caja de entrada estilizada de Ionic */}
                <IonItem style={{ 
                  '--background': '#f4f5f8', 
                  '--border-radius': '10px',
                  margin: '10px 0' 
                }}>
                  <IonLabel position="stacked" color="medium" style={{ fontSize: '12px', fontWeight: 'bold' }}>
                    IonList:
                  </IonLabel>
                  <IonInput 
                    placeholder="[USER_NAME: kerberos]" 
                    value={username}
                    onIonInput={(e) => setUsername(e.detail.value!)}
                    clearInput={true}
                  />
                </IonItem>
              </IonList>

              {/* Botón de Ingresar */}
              <IonButton 
                expand="block" 
                size="large" 
                type="submit"
                style={{ '--border-radius': '10px', marginTop: '20px' }}
              >
                INGRESAR
                <IonIcon slot="end" icon={logInOutline} />
              </IonButton>
            </form>

          </IonCardContent>
        </IonCard>

        {/* Botón inferior de Atrás / Cancelar */}
        <IonButton 
          expand="block" 
          size="large" 
          fill="outline"
          onClick={() => history.push('/welcome')}
          style={{ '--border-radius': '10px' }}
        >
          <IonIcon slot="start" icon={arrowBackOutline} />
          ATRÁS
        </IonButton>

        {/* Icono decorativo de llave inferior de la maqueta */}
        <div className="ion-text-center" style={{ fontSize: '60px', marginTop: '30px', opacity: 0.3 }}>
          🔑
        </div>

      </div>
    </Layout>
  );
};

export default Login;