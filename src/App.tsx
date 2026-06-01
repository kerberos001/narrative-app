import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Importar el Cerebro Global de la App */
import { GameProvider } from './context/GameContext';

/* Importar las 5 Pantallas Basadas en la Imagen */
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import Adventure from './pages/Adventure';
import Ending from './pages/Ending';

/* Importar el Tema de Colores Personalizado */
import './theme/variables.css';
import Status from './pages/Status';

// Inicializar los componentes internos de Ionic
setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    {/* 1. Envolvemos toda la aplicación con nuestro estado global */}
    <GameProvider>
      {/* 2. Inicializamos el enrutador nativo de Ionic para controlar las transiciones */}
      <IonReactRouter>
        <IonRouterOutlet>
          
          {/* Ruta 1: Bienvenida */}
          <Route exact path="/welcome">
            <Welcome />
          </Route>

          {/* Ruta 2: Iniciar Sesión */}
          <Route exact path="/login">
            <Login />
          </Route>

          {/* Ruta 3: Crear Perfil */}
          <Route exact path="/register">
            <Register />
          </Route>

          {/* Ruta 4: El texto largo y los 3 caminos */}
          <Route exact path="/adventure">
            <Adventure />
          </Route>

          <Route exact path="/status">
            <Status />
          </Route>

          {/* Ruta 5: Pantalla de Felicitaciones / Victoria */}
          <Route exact path="/ending">
            <Ending />
          </Route>

          {/* Ruta por Defecto: Si el usuario entra a la raíz '/', lo mandamos a Bienvenida */}
          <Route exact path="/">
            <Redirect to="/welcome" />
          </Route>

        </IonRouterOutlet>
      </IonReactRouter>
    </GameProvider>
  </IonApp>
);

export default App;