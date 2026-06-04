import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  IonItem, 
  IonInput, 
  IonButton, 
  IonCard, 
  IonCardContent, 
  IonText,
  IonLoading,
  IonSelect,       // 🛠️ Importamos componentes de selección
  IonSelectOption  
} from '@ionic/react';
import Layout from '../components/Layout';
import { useGame } from '../context/GameContext';
import { API_ROUTES } from '../data/apiRoutes';

export interface GenreNode {
  id: number;
  name: string;
  type: string;        
  parent_type: string | null; 
  description: string;
}

export interface GenreGroup {
  parent: GenreNode;
  children: GenreNode[];
}

export type GenreResponse = GenreGroup[];

const Register: React.FC = () => {
  const history = useHistory();
  const { registerUser } = useGame();
  
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [categoryData, setCategoryData] = useState<GenreResponse | null>(null);

  // 🛠️ Estado auxiliar para saber qué padre se seleccionó y filtrar sus hijos
  const [parentTypeSelected, setParentTypeSelected] = useState<string>('');

  // 1. Estado para almacenar los datos del formulario (Añadimos category_id)
  const [formData, setFormData] = useState({
    name: '',
    user_name: '',
    age: 18,
    money: 10,
    category_id: null as number | null // 🛠️ Aquí guardaremos el ID del hijo
  });

  // 2. Estado para almacenar los mensajes de error por cada campo (Añadimos category_id)
  const [errors, setErrors] = useState({
    name: '',
    user_name: '',
    age: '',
    money: '',
    category_id: '' // 🛠️ Error si no selecciona género
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' }); 
  };

  // 🛠️ Manejador específico cuando cambia el primer combo (Padre)
  const handleParentChange = (parentType: string) => {
    setParentTypeSelected(parentType);
    // Reiniciamos el hijo en el formulario por si ya había elegido uno de otra categoría
    setFormData((prev) => ({ ...prev, category_id: null }));
    setErrors((prev) => ({ ...prev, category_id: '' }));
  };

  // 3. Función validadora
  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { name: '', user_name: '', age: '', money: '', category_id: '' };

    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio.';
      isValid = false;
    } else if (!nameRegex.test(formData.name)) {
      newErrors.name = 'El nombre no debe contener números ni caracteres especiales.';
      isValid = false;
    }

    const usernameLength = formData.user_name.trim().length;
    if (usernameLength <= 5 || usernameLength >= 10) {
      newErrors.user_name = 'El username debe tener entre 6 y 9 caracteres.';
      isValid = false;
    }

    if (formData.age < 15 || formData.age > 80) {
      newErrors.age = 'La edad permitida debe estar entre 15 y 80 años.';
      isValid = false;
    }

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

    // 🛠️ Validación del subgénero obligatorio
    if (!formData.category_id) {
      newErrors.category_id = 'Debes seleccionar un subgénero para tu aventura.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setShowLoading(true);
    try {
      // 🛠️ IMPORTANTE: Pasamos los datos incluyendo de forma limpia el category_id
      const exito = await registerUser({
        name: formData.name,
        user_name: formData.user_name,
        age: Number(formData.age),
        money: Number(formData.money),
        final_goal: "",
        hp: 100,
        energy: 100,
        is_sick: false,
        // @ts-ignore (En caso de que no hayas actualizado la interfaz UserProfile en el contexto aún)
        category_id: formData.category_id 
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

  useEffect(() => {
    const fetchCategory = async () => {           
      try {        
        const response = await fetch(API_ROUTES.getCategory, {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setCategoryData(data);
        }
      } catch (error) {
        console.error("Error al traer el catalogo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, []);

  // 🛠️ Buscamos los hijos del padre actualmente seleccionado para alimentar el segundo combo
  const currentChildren = categoryData?.find(group => group.parent.type === parentTypeSelected)?.children || [];

  if (loading) {
    return (
      <IonLoading isOpen={loading} message="Consultando catálogo de géneros..." spinner="crescent" mode="ios" />
    );
  }

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
                  fill="solid"  
                  mode="md"     
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

              {/* 🛠️ COMBO 1: CATEGORÍA PRINCIPAL (PADRES) */}
              <IonItem lines="none" style={{ marginBottom: '16px' }}>
                <IonSelect 
                  fill="solid"
                  mode="md"
                  label="Categoría de Historia"
                  labelPlacement="floating"
                  placeholder="Selecciona una categoría"
                  value={parentTypeSelected}
                  onIonChange={(e) => handleParentChange(e.detail.value)}
                >
                  {categoryData?.map((group) => (
                    <IonSelectOption key={group.parent.id} value={group.parent.type}>
                      {group.parent.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              {/* 🛠️ COMBO 2: SUBGÉNERO (CHILDREN) - Bloqueado hasta que elija un Padre */}
              <IonItem lines="none" style={{ marginBottom: errors.category_id ? '4px' : '16px' }}>
                <IonSelect 
                  fill="solid"
                  mode="md"
                  label="Subgénero / Trama"
                  labelPlacement="floating"
                  placeholder={parentTypeSelected ? "Selecciona la trama" : "Primero elige una categoría"}
                  disabled={!parentTypeSelected} // Se deshabilita dinámicamente
                  value={formData.category_id}
                  onIonChange={(e) => handleInputChange('category_id', e.detail.value)}
                >
                  {currentChildren.map((child) => (
                    <IonSelectOption key={child.id} value={child.id}>
                      {child.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
              {errors.category_id && <IonText color="danger" style={{ fontSize: '12px', paddingLeft: '8px', display: 'block', marginBottom: '16px', fontWeight: 'bold' }}>{errors.category_id}</IonText>}

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