import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { createPet } from '../../services/api'; 
import '../../styles/createPet.css'; 

const CreatePet = () => {
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('');
  const [petColor, setPetColor] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const userId = localStorage.getItem("userId");
    console.log(userId);
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem('role');
  
    if (!petName || !petType || !petColor) {
      setError("Please fill all fields.");
      return;
    }
  
    const newPet = {
      petName,
      petType,
      petColor,
      userId
    };
  
    try {
      console.log("Token:", token);
      const response = await createPet(newPet, token);
      const createdPet = response.data;
  
      localStorage.setItem('petId', createdPet.petId);
  
      if (userRole === 'ADMIN') {
        navigate('/admin-dashboard');  
      } else {
        navigate(`/pet-dashboard?userId=${userId}&petId=${createdPet.petId}`); 
      }
    } catch (err) {
      console.error('Error creating pet:', err);
      setError('Failed to create pet.');
    }
  };

  const userRole = localStorage.getItem("role"); 
  const dashboardLink = userRole === 'ADMIN' ? '/admin-dashboard' : '/user-dashboard';

  return (
    <div className="create-pet-container">
      <div className="form-container">
        <div className="title-container">
          <h2>Craft Your Magical Creature</h2>
        </div>
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Creature Name</label>
            <input
              type="text"
              placeholder="Bestow a Name Upon Your Pet"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
            />
          </div>
          <div>
            <label>Nature of Your Creature</label>
            <select
              value={petType}
              onChange={(e) => setPetType(e.target.value)}
            >
              <option value="" disabled>Choose Your Creature’s Nature</option>
              <option value="FROG">Frog</option>
              <option value="MUSHROOM">Mushroom</option>
              <option value="FAIRY">Fairy</option>
            </select>
          </div>
          <div>
            <label>Aura Shade</label>
            <select
              value={petColor}
              onChange={(e) => setPetColor(e.target.value)}
            >
              <option value="" disabled>Choose an Aura Shade</option>
              <option value="GREEN">Green</option>
              <option value="RED">Red</option>
              <option value="BLUE">Blue</option>
              <option value="PINK">Pink</option>
            </select>
          </div>
          <button type="submit">Create</button>

          <div className="whimsylink-container">
            <Link to={dashboardLink} className="whimsylink">
            🎔Go back to Your WhimsyGarden🎔
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePet;