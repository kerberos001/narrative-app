import React from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonGrid, 
  IonRow, 
  IonCol,
  IonButtons,
  IonBackButton
} from '@ionic/react';

interface LayoutProps {
  title: string;          // El título que saldrá en la barra azul superior
  showBackButton?: boolean; // Por si queremos mostrar la flecha de "Atrás" (ej: en Login o Registro)
  children: React.ReactNode; // El contenido interno de cada pantalla
  customButtons?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ title, showBackButton = false, children, customButtons }) => {
  return (
    <IonPage>
      {/* Barra superior común (Header Azul de la imagen) */}
      <IonHeader>
        <IonToolbar color="primary">
          {showBackButton && (
            <IonButtons slot="start">
              {/* El IonBackButton maneja el regreso de pantalla automáticamente */}
              <IonBackButton defaultHref="/welcome" text="Atrás" />
            </IonButtons>
          )}
          <IonTitle className="ion-text-center">{title}</IonTitle>
          {customButtons}
        </IonToolbar>
      </IonHeader>

      {/* Contenedor del contenido con scroll automático */}
      <IonContent className="ion-padding">
        
        {/* El IonGrid "fixed" limita el ancho en PC para que no se estire feo, 
            pero en celular ocupa el 100% de la pantalla */}
        <IonGrid fixed>
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" sizeSm="10" sizeMd="8" sizeLg="6">
              
              {/* Aquí se renderizará el formulario, los textos o los botones de cada pantalla */}
              {children}
              
            </IonCol>
          </IonRow>
        </IonGrid>

      </IonContent>
    </IonPage>
  );
};

export default Layout;