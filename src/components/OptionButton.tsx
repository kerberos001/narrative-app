import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { arrowForwardOutline } from 'ionicons/icons';

interface OptionButtonProps {
  text: string;          // El texto del camino (ej: "CAMINO 1: RUINAS ANTIGUAS")
  onClick: () => void;   // La función que se ejecuta al presionarlo
  color?: string;        // Color opcional si quieres destacar un camino de otro
}

const OptionButton: React.FC<OptionButtonProps> = ({ text, onClick, color = "primary" }) => {
  return (
    <IonButton
      expand="block"
      size="large"
      color={color}
      onClick={onClick}
      style={{
        '--border-radius': '12px',
        '--box-shadow': '0 4px 10px rgba(30, 86, 160, 0.15)',
        margin: '0 0 4px 0',
        whiteSpace: 'normal', // Permite que el texto se acomode en múltiples líneas si es muy largo en pantallas chicas
        height: 'auto',       // Ajusta la altura dinámicamente según el texto
        minHeight: '55px'     // Asegura un tamaño cómodo para el pulgar del usuario
      }}
    >
      {/* Contenedor interno para alinear el texto a la izquierda y la flecha a la derecha */}
      <div style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        textAlign: 'left',
        padding: '8px 0',
        fontSize: '14px',
        fontWeight: 'bold',
        letterSpacing: '0.5px'
      }}>
        <span>{text}</span>
        <IonIcon icon={arrowForwardOutline} style={{ fontSize: '18px', marginLeft: '10px', flexShrink: 0 }} />
      </div>
    </IonButton>
  );
};

export default OptionButton;