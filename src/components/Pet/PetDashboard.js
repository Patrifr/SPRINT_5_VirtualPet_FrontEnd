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
  const [showNom, setShowNom] = useState(false);

  useEffect(() => {
    const fetchPetDetails = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId'); 
      
      if (!token || !userId) {
        console.error("Token or userId not found!");
        navigate('/signin');
        return;
      }

      try {
        const petIdFromLocalStorage = localStorage.getItem('petId');
        if (!petIdFromLocalStorage) {
          console.error("PetId not found in localStorage.");
          return;
        }

        const response = await getPetDetails(petIdFromLocalStorage, token);
        if (response && response.data) {
          setPet(response.data);
          setLoading(false);
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

      if (token) {
        const petUpdateRequest = {
          location: e.target.value,
        };

        updatePet(pet.petId, petUpdateRequest, token)
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

      if (token) {
        const petUpdateRequest = {
          accessory: e.target.value,
        };

        updatePet(pet.petId, petUpdateRequest, token)
          .then((response) => {
            console.log("Accessory updated successfully:", response.data);
            setPet(response.data); 
          })
          .catch((err) => {
            console.error("Error updating accessory:", err);
          });
      }
    }
  };

  useEffect(() => {
    if (pet && pet.accessory) {
      setSelectedAccessory(pet.accessory);  
    }
  }, [pet]);

  useEffect(() => {
    if (pet && pet.location) {
      setSelectedLocation(pet.location);  
    }
  }, [pet]);

  const handleInteraction = (interactionType) => {
    if (!pet || !pet.petId) {
      console.error("Pet or Pet ID is not loaded yet.");
      return;
    }
  
    const token = localStorage.getItem('token');

    if (!token) {
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
      setShowHeart(true); 
      setTimeout(() => setShowHeart(false), 2000); 
    }

    if (interactionType === 'FEED') {
      setShowNom(true); 
      setTimeout(() => setShowNom(false), 2500); 
    }

    updatePet(pet.petId, petUpdateRequest, token)
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
    if (pet.asleep) {
      return require('../../assets/emotions/zzz.gif'); 
    }
    return null; 
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
              src={require('../../assets/emotions/heart.gif')}
              alt="Heart"
              className={`heart-gif ${pet.petType.toLowerCase()}`}
            />
          )}

          {showNom && (
            <img
              src={require('../../assets/emotions/nomnomnom.gif')} 
              alt="Nomnom"
              className={`Nomnom-gif ${pet.petType.toLowerCase()}`}
            />
          )}

        </div>
      </div>
    </div>
  );
};

export default PetDashboard;