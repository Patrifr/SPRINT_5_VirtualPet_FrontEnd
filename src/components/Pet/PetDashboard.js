import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Link } from 'react-router-dom';
import { getPetDetails, updatePet } from '../../services/api'; 
import '../../styles/PetDashboard.css';

const PetDashboard = () => {
  const navigate = useNavigate();

  const [pet, setPet] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('FOREST');
  const [selectedAccessory, setSelectedAccessory] = useState('NONE');
  const [loading, setLoading] = useState(true);
  const [showHeart, setShowHeart] = useState(false);

  // Fetch the pet details from the API when the component is mounted
  useEffect(() => {
    const fetchPetDetails = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId'); // Obtener el userId desde localStorage
      if (!token || !userId) {
        console.error("Token or userId not found!");
        navigate('/signin');
        return;
      }

      try {
        // Se obtiene petId de pet, no de URL
        const petIdFromLocalStorage = localStorage.getItem('petId'); // Si guardas el petId en el localStorage
        if (!petIdFromLocalStorage) {
          console.error("PetId not found in localStorage.");
          return;
        }

        const response = await getPetDetails(userId, petIdFromLocalStorage, token);  // Solo pasamos el petId y userId
        if (response && response.data) {
          setPet(response.data); // Guardamos los detalles de la mascota
          setLoading(false);  // Cambiamos a false cuando los detalles se han cargado
        }
      } catch (err) {
        console.error('Error fetching pet details:', err);
        setLoading(false);
      }
    };

    fetchPetDetails();
  }, [navigate]);

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value); 
    if (pet && pet.petId) {

      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId'); 

      if (token && userId) {
        const petUpdateRequest = {
          location: e.target.value,
        };

        updatePet(pet.petId, userId, petUpdateRequest, token)
          .then((response) => {
            console.log("Location updated successfully:", response.data);
            setPet(response.data);
          })
          .catch((err) => {
            console.error("Error updating location:", err);
          });
      }
    }
  };

  const handleAccessoryChange = (e) => {
    setSelectedAccessory(e.target.value); // Cambia el valor del accesorio

    if (pet && pet.petId) {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (token && userId) {
        const petUpdateRequest = {
          accessory: e.target.value,
        };

        updatePet(pet.petId, userId, petUpdateRequest, token)
          .then((response) => {
            console.log("Accessory updated successfully:", response.data);
            setPet(response.data); // Actualizamos el estado con los nuevos datos de la mascota
          })
          .catch((err) => {
            console.error("Error updating accessory:", err);
          });
      }
    }
  };

  useEffect(() => {
    if (pet && pet.accessory) {
      setSelectedAccessory(pet.accessory);  // Sincroniza el accesorio del pet con el estado
    }
  }, [pet]);

  useEffect(() => {
    if (pet && pet.location) {
      setSelectedLocation(pet.location);  // Sincroniza la localización del pet con el estado
    }
  }, [pet]);

  const handleInteraction = (interactionType) => {
    // Verificamos que la mascota esté cargada correctamente
    if (!pet || !pet.petId) {
      console.error("Pet or Pet ID is not loaded yet.");
      return;
    }
  
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!token || !userId) {
      console.error("Token or userId not found!");
      return;
    }
  
    const petUpdateRequest = {
      petInteraction: interactionType, 
    };
  
    switch (interactionType) {
      case 'PET':
        petUpdateRequest.petInteraction = 'PET';
        break;
      case 'FEED':
        petUpdateRequest.petInteraction = 'FEED';
        break;
      default:
        console.error("Invalid interaction type");
        return;
    }
  
    if (interactionType === 'PET') {
      setShowHeart(true); // Hacemos visible el GIF
      setTimeout(() => setShowHeart(false), 2000); // Lo ocultamos después de 2 segundos
    }

    updatePet(pet.petId, userId, petUpdateRequest, token)
      .then((response) => {
        console.log(`${interactionType} interaction updated successfully:`, response.data);
        setPet(response.data); 
      })
      .catch((err) => {
        console.error("Error updating interaction:", err);
      });
  };

  const getAccessoryImage = () => {
    switch (selectedAccessory) {
      case 'CROWN':
        return require('../../assets/accessories/CROWN.gif');
      case 'FLOWER':
        return require('../../assets/accessories/FLOWER.png');
      case 'LEAF':
        return require('../../assets/accessories/LEAF.png');
      default:
        return null; 
    }
  };

  const getPetImage = (pet) => {
    const { petColor, petType, asleep } = pet;
    const imageSuffix = asleep ? '_SLEEPING' : ''; // Verifica si está dormida
    return require(`../../assets/pets/${petType}_${petColor}${imageSuffix}.png`);
  };
  
  const getZzzGif = (pet) => {
    // Si la mascota está dormida, mostrar el gif
    if (pet.asleep) {
      return require('../../assets/emotions/zzz.gif'); // Ruta de tu gif de zzz
    }
    return null; // Si no está dormida, no mostrar nada
  };

  const userRole = localStorage.getItem("role");  

  const dashboardLink = userRole === 'ADMIN' ? '/admin-dashboard' : '/user-dashboard';

  if (loading) {
    return <p>Loading pet details...</p>;
  }

  if (!pet) {
    return <p>No pet data available.</p>;
  }

  return (
    <div className="petdashboard-container">
      <div className="petdashboard-content">
        <div className="petdashboard-pet-container">
  
          <div className="petdashboard-pet-image-container">
             <img 
              src={getPetImage(pet)} 
              alt={pet.petName} 
              className={`petdashboard-pet-image ${pet.petType.toLowerCase()}`} 
            />

  
          {getZzzGif(pet) && (
              <img 
                src={getZzzGif(pet)} 
                alt="Sleeping zzz" 
                className="petdashboard-zzz-gif"
              />
          )}
          </div>
  
          <div className="petdashboard-pet-background-container">
            <img 
              src={require(`../../assets/backgrounds/${selectedLocation}.jpg`)} 
              alt={`background of ${pet.petName}`} 
              className="petdashboard-pet-background-image"
            />
          </div>
  
          <div className="petdashboard-pet-accessory-container">
            {selectedAccessory !== 'NONE' && (
              <img 
                src={getAccessoryImage()}
                alt={`accessory of ${pet.petName}`} 
                className={`petdashboard-pet-accessory-image ${pet.petType.toLowerCase()} ${selectedAccessory.toLowerCase()}`}
              />
            )}
          </div>
  
          <div className="petdashboard-status-bars">
            <div className="petdashboard-bar-container">
              <p>Happiness</p>
              <progress value={pet.happiness} max="100" className="bar"></progress>
            </div>
            <div className="petdashboard-bar-container">
              <p>Hunger</p>
              <progress value={pet.hunger} max="100" className="bar"></progress>
            </div>
          </div>
        </div>
  
        <div className="petdashboard-info-container">
        
          <div className="petdashboard-name-container">
            <h1>{pet.petName}</h1>
          </div>

          <div className="petdashboard-pet-interactions">
            <div className="petdashboard-selector-container">
                <label htmlFor="location-selector" className="petdashboard-selector-label">Fairylands</label>
                  <select
                    id="location-selector"
                    value={selectedLocation}
                    onChange={handleLocationChange}
                  >
                    <option value="FOREST">Mystwood</option>
                    <option value="LAKE">Silvermist Lake</option>
                    <option value="COTTAGE">Pixie Hollow Cottage</option>
                  </select>
              </div>

              <div className="petdashboard-selector-container">
                  <label htmlFor="accessory-selector" className="petdashboard-selector-label">Embellishments</label>
                    <select
                      id="accessory-selector"
                      value={selectedAccessory}
                      onChange={handleAccessoryChange}
                    >
                      <option value="NONE">None</option>
                      <option value="CROWN">Silverthorn Crown</option>
                      <option value="FLOWER">Starlight Blossom</option>
                      <option value="LEAF">Elderwood Leaf</option>
                    </select>
            </div>
          </div>
          <div className="petdashboard-action-buttons">
            <button onClick={() => handleInteraction('FEED')}>Offer a Treat</button>
            <button onClick={() => handleInteraction('PET')}>Cuddle Your Creature</button>
          </div>

          <div className="whimsy-link-container">
            <Link to={dashboardLink} className="whimsy-link">
              🎔Your WhimsyGarden🎔
            </Link>
          </div>

          {showHeart && (
            <img
              src={require('../../assets/emotions/heart.gif')} // Asegúrate de tener un GIF llamado heart.gif en assets
              alt="Heart"
              className={`heart-gif ${pet.petType.toLowerCase()}`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PetDashboard;