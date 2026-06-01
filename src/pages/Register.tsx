import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  IonItem, 
  IonInput, 
  IonButton, 
  IonCard, 
  IonCardContent, 
  IonText,
  IonLoading
} from '@ionic/react';
import Layout from '../components/Layout';
import { useGame } from '../context/GameContext';

const Register: React.FC = () => {
  const history = useHistory();
  const { registerUser } = useGame();
  
  const [showLoading, setShowLoading] = useState<boolean>(false);

  // 1. Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    name: '',
    user_name: '',
    age: 18,
    money: 10
  });

  // 2. Estado para almacenar los mensajes de error por cada campo
  const [errors, setErrors] = useState({
    name: '',
    user_name: '',
    age: '',
    money: ''
  });

  // Manejador genérico para actualizar el formData y limpiar errores al escribir
  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' }); // Limpia el error del campo actual mientras escribe
  };

  // 3. Función validadora con tus reglas de negocio exactas
  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { name: '', user_name: '', age: '', money: '' };

    // Regla Nombre: Sin números ni caracteres especiales (Permite letras, espacios y acentos)
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio.';
      isValid = false;
    } else if (!nameRegex.test(formData.name)) {
      newErrors.name = 'El nombre no debe contener números ni caracteres especiales.';
      isValid = false;
    }

    // Regla Username: Tamaño > 5 y < 10 caracteres
    const usernameLength = formData.user_name.trim().length;
    if (usernameLength <= 5 || usernameLength >= 10) {
      newErrors.user_name = 'El username debe tener entre 6 y 9 caracteres.';
      isValid = false;
    }

    // Regla Edad: Entre 15 y 80 años
    if (formData.age < 15 || formData.age > 80) {
      newErrors.age = 'La edad permitida debe estar entre 15 y 80 años.';
      isValid = false;
    }

    // Regla Money: Solo números y un valor realista (ej: máximo $50,000 iniciales)
    const moneyNum = Number(formData.money);
    if (isNaN(moneyNum) || !formData.money.toString().trim()) {
      newErrors.money = 'Debes ingresar un valor numérico.';
      isValid = false;
    } else if (moneyNum < 0) {
      newErrors.money = 'El dinero inicial no puede ser negativo.';
      isValid = false;
    } else if (moneyNum > 50000) {
      newErrors.money = '¡El dinero inicial no es realista! El máximo permitido es $50,000.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Si el formulario no pasa tus filtros, frena la ejecución aquí
    if (!validateForm()) return;

    setShowLoading(true);
    try {
      // Pasamos los datos validados listos para tus endpoints (create_player + narrative)
      const exito = await registerUser({
        name: formData.name,
        user_name: formData.user_name,
        age: Number(formData.age),
        money: Number(formData.money),
        final_goal: "",
        hp: 100,
        energy: 100,
        is_sick: false
      });
      
      if (exito) {
        history.push('/adventure');
      } else {
        alert('Hubo un problema al inicializar tu narrativa en el servidor.');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setShowLoading(false);
    }
  };

  return (
    <Layout title="CREAR PERFIL">
      <div className="ion-padding-top">
        
        <IonLoading
          isOpen={showLoading}
          message={'Registrando tu personaje y tejiendo el destino... ✨'}
          spinner="crescent"
          mode="ios"
        />

        <IonCard mode="ios" style={{ borderRadius: '16px', margin: '0 0 20px 0', border: '1px solid #e0e0e0', boxShadow: 'none' }}>
          <IonCardContent>
            
            <form onSubmit={handleSaveProfile}>
              
          {/* Campo 1: Nombre */}
          <IonItem lines="none" style={{ marginBottom: errors.name ? '4px' : '16px' }}>
            <IonInput 
              fill="solid"  // 🛠️ Movido aquí
              mode="md"     // 🛠️ Movido aquí
              label="Nombre Completo"
              labelPlacement="floating"
              value={formData.name} 
              onIonInput={(e) => handleInputChange('name', e.detail.value!)} 
              placeholder="Ej. Jorge"
            />
          </IonItem>
          {errors.name && <IonText color="danger" style={{ fontSize: '12px', paddingLeft: '8px', display: 'block', marginBottom: '16px', fontWeight: 'bold' }}>{errors.name}</IonText>}

          {/* Campo 2: Username */}
          <IonItem lines="none" style={{ marginBottom: errors.user_name ? '4px' : '16px' }}>
            <IonInput 
              fill="solid"
              mode="md"
              label="Username"
              labelPlacement="floating"
              value={formData.user_name} 
              onIonInput={(e) => handleInputChange('user_name', e.detail.value!)} 
              placeholder="De 6 a 9 letras (Ej. kerberos)"
            />
          </IonItem>
          {errors.user_name && <IonText color="danger" style={{ fontSize: '12px', paddingLeft: '8px', display: 'block', marginBottom: '16px', fontWeight: 'bold' }}>{errors.user_name}</IonText>}

          {/* Campo 3: Edad */}
          <IonItem lines="none" style={{ marginBottom: errors.age ? '4px' : '16px' }}>
            <IonInput 
              type="number"
              fill="solid"
              mode="md"
              label="Edad (Entre 15 y 80)"
              labelPlacement="floating"
              value={formData.age} 
              onIonInput={(e) => handleInputChange('age', parseInt(e.detail.value!, 10) || 0)} 
            />
          </IonItem>
          {errors.age && <IonText color="danger" style={{ fontSize: '12px', paddingLeft: '8px', display: 'block', marginBottom: '16px', fontWeight: 'bold' }}>{errors.age}</IonText>}

          {/* Campo 4: Dinero Inicial */}
          <IonItem lines="none" style={{ marginBottom: errors.money ? '4px' : '16px' }}>
            <IonInput 
              type="number"
              fill="solid"
              mode="md"
              label="Dinero Inicial ($)"
              labelPlacement="floating"
              value={formData.money} 
              onIonInput={(e) => handleInputChange('money', e.detail.value!)} 
              placeholder="Ej. 10"
            />
          </IonItem>
          {errors.money && <IonText color="danger" style={{ fontSize: '12px', paddingLeft: '8px', display: 'block', marginBottom: '16px', fontWeight: 'bold' }}>{errors.money}</IonText>}

              <IonButton 
                type="submit" 
                expand="block" 
                size="large" 
                style={{ '--border-radius': '10px', marginTop: '30px' }}
              >
                GUARDAR PERFIL Y JUGAR
              </IonButton>

            </form>

          </IonCardContent>
        </IonCard>

      </div>
    </Layout>
  );
};

export default Register;