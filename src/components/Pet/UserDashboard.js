import React, { useState, useEffect } from 'react';
import { getUserPets, deletePet } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import '../../styles/UserDashboard.css';

const UserDashboard = () => {
  const [pets, setPets] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/signin');
      return;
    }

    const fetchUserPets = async () => {
      try {
        const response = await getUserPets(userId, token);
        setPets(response.data);
      } catch (err) {
        console.error('Failed to load pets.', err);
        setError('Failed to load pets. No pets found. Please create a pet.');
      }
    };

    fetchUserPets();
  }, [navigate]);

  const getPetImage = (pet) => {
    const { petColor, petType, asleep } = pet;
    const imageSuffix = asleep ? '_SLEEPING' : '';
    return require(`../../assets/pets/${petType}_${petColor}${imageSuffix}.png`);
  };

  const getZzzGif = (pet) => {
    if (pet.asleep) {
      return require('../../assets/emotions/zzz.gif'); 
    }
    return null; 
  };

  const getAccessoryImage = (accessory) => {
    switch (accessory) {
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

  const handlePetClick = (pet) => {
    const userId = localStorage.getItem('userId'); 
    const petId = pet.petId; 
    localStorage.setItem('petId', pet.petId);
    if (petId && userId) {
      console.log("Navigating to pet-dashboard with petId:", petId, "and userId:", userId);
      navigate(`/pet-dashboard?userId=${userId}&petId=${petId}`);
    } else {
      console.error("Missing petId or userId");
    }
  };

  const handleDelete = (petId) => {    
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (token && userId) {
      deletePet(userId, petId, token)
        .then(() => {
          setPets(pets.filter(pet => pet.petId !== petId)); // Eliminar la mascota del estado
          console.log('Pet deleted successfully');
        })
        .catch((err) => {
          console.error("Error deleting pet:", err);
        });
    }
  };

  return (
    <div className="user-dashboard">
      <div className="userdashboard-whimsy-logo-container">
        <h1 className="userdashboard-title-text">WhimsyGarden</h1>
      </div>
      {error && <p>{error}</p>}
      {pets.length > 0 ? (
        <div className="userdashboard-pets-container">
          {pets.map((pet) => (
              <div  key={pet.petId} 
                className="userdashboard-pet-card" 
                onClick={(e) => {
                e.stopPropagation();  // Evita la propagación del evento de clic
                handlePetClick(pet);
              }}
              >
              <div className="userdashboard-pet-image-container">
                <img
                  src={getPetImage(pet)}
                  alt={pet.petName}
                  className="userdashboard-pet-image"
                />

                  {getZzzGif(pet) && (
                    <img 
                      src={getZzzGif(pet)} 
                      alt="Sleeping zzz" 
                      className="userdashboard-zzz-gif"
                    />
                  )}

                  {pet.accessory && pet.accessory !== 'NONE' && (
                    <img
                      src={getAccessoryImage(pet.accessory)} 
                      alt={`accessory of ${pet.petName}`} 
                      className={`userdashboard-pet-accessory-image ${pet.petType.toLowerCase()} ${pet.accessory.toLowerCase()}`}
                    />
                  )}

                <img
                  src={require(`../../assets/backgrounds/${pet.location}.jpg`)}
                  alt={`background of ${pet.petName}`}
                  className="userdashboard-pet-background-image"
                />
              </div>

               <div className="userdashboard-pet-name-container">
                 <h2>{pet.petName}</h2>
              </div>

            <div className="userdashboard-status-bars">
              <div className="userdashboard-bar-container">
                <p>Happiness</p>
                <progress className="bar" value={pet.happiness} max={100} />
              </div>
              <div className="userdashboard-bar-container">
                <p>Hunger</p>
                <progress className="userdashboard-bar" value={pet.hunger} max={100} />
              </div>
            </div>

                    <button
                      className="userdashboard-delete-button"
                      onClick={(e) => { 
                        e.stopPropagation(); // Detiene la propagación del evento
                        e.preventDefault(); 
                        handleDelete(pet.petId); 
                      }}
                      >
                      <span className="userdashboard-delete-icon">X</span>
                    </button>
        </div>
          ))}
        </div>
      ) : (
        <p>No pets found. Please create a pet.</p>
      )}
      <button className="userdashboard-create-pet-button" onClick={() => navigate('/create-pet')}>
        Create New Pet
      </button>    
      <button className="logout-button" 
        onClick={() => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/signin');}}>       
        Logout
      </button>
    </div>
  );
};

export default UserDashboard;