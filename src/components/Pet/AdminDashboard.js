import React, { useState, useEffect } from 'react';
import { getAll, deletePet } from '../../services/api'; // Asegúrate de que `deletePet` también esté implementado
import { useNavigate } from 'react-router-dom';
import '../../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [pets, setPets] = useState([]);
  const [error, setError] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token'); // Obtener el token del localStorage

    if (!token) {
      navigate('/signin');
      return;
    }

    const fetchAllPets = async () => {
      try {
        const response = await getAll(token);  // Pasar el token en los encabezados
        setPets(response.data);
      } catch (err) {
        console.error('Failed to load pets.', err);
        setError('Failed to load pets. No pets found.');
      }
    };

    fetchAllPets();
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

  const handleDeleteClick = (petId) => {
      setPetToDelete(petId);  
      setShowConfirmDelete(true); 
    };
  
    const handleConfirmDelete = () => {
      const token = localStorage.getItem('token');
      if (token && petToDelete) {
        deletePet(petToDelete, token)
          .then(() => {
            setPets(pets.filter(pet => pet.petId !== petToDelete)); 
            console.log('Pet deleted successfully');
            setShowConfirmDelete(false);
            setPetToDelete(null); 
          })
          .catch((err) => {
            console.error("Error deleting pet:", err);
          });
      }
    };
  
    const handleCancelDelete = () => {
      setShowConfirmDelete(false); 
      setPetToDelete(null); 
    };

  return (
    <div className="admin-dashboard">
      <div className="admindashboard-whimsy-logo-container">
        <h1 className="admindashboard-title-text">WhimsyGarden</h1>
      </div>
      {error && <p>{error}</p>}
      {pets.length > 0 ? (
        <div className="admindashboard-pets-container">
          {pets.map((pet) => (
              <div  key={pet.petId} 
              className="userdashboard-pet-card" 
              onClick={(e) => {
              e.stopPropagation();  // Evita la propagación del evento de clic
              handlePetClick(pet);
            }}
            >
              <div className="admindashboard-pet-image-container">
                <img
                  src={getPetImage(pet)}
                  alt={pet.petName}
                  className="admindashboard-pet-image"
                />
                
                {getZzzGif(pet) && (
                    <img 
                      src={getZzzGif(pet)} 
                      alt="Sleeping zzz" 
                      className="admindashboard-zzz-gif"
                    />
                  )}

                  {pet.accessory && pet.accessory !== 'NONE' && (
                    <img
                      src={getAccessoryImage(pet.accessory)} 
                      alt={`accessory of ${pet.petName}`} 
                      className={`admindashboard-pet-accessory-image ${pet.petType.toLowerCase()} ${pet.accessory.toLowerCase()}`}
                    />
                  )}

                <img
                  src={require(`../../assets/backgrounds/${pet.location}.jpg`)}
                  alt={`background of ${pet.petName}`}
                  className="admindashboard-pet-background-image"
                />

              </div>

              <div className="admindashboard-pet-name-container">
                <h2>{pet.petName}</h2>
              </div>
              
              <div className="admindashboard-user-name-container">
                <p className="userdashboard-pet-owner">Owner: {pet.userName}</p>
              </div>

              <div className="admindashboard-status-bars">
              <div className="admindashboard-bar-container">
                <p>Happiness</p>
                <progress className="admindashboard-bar" value={pet.happiness} max={100} />
              </div>
              <div className="admindashboard-bar-container">
                <p>Hunger</p>
                <progress className="admindashboard-bar" value={pet.hunger} max={100} />
              </div>
            </div>

                      <button
                      className="userdashboard-delete-button"
                      onClick={(e) => { 
                        e.stopPropagation(); // Detiene la propagación del evento
                        e.preventDefault(); 
                       handleDeleteClick(pet.petId)
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
      <button className="create-pet-button" onClick={() => navigate('/create-pet')}>
        Create New Pet
      </button>
      <button className="logout-button" 
        onClick={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          navigate('/signin');
        }}>
        Logout
      </button>

      {showConfirmDelete && (
        <div className="confirm-delete-modal">
          <div className="confirm-delete-content">
            <p>Do you wish to release this magical creature?</p>
            <button onClick={handleConfirmDelete} className="confirm-button">Set Them Free</button>
            <button onClick={handleCancelDelete} className="cancel-button">Cancel</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;