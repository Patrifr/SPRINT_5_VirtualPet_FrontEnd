import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SignUpForm from './components/Auth/SignUpForm';
import SignInForm from './components/Auth/SignInForm';
import UserDashboard from './components/Pet/UserDashboard';
import AdminDashboard from './components/Pet/AdminDashboard';
import CreatePet from './components/Pet/createPet';
import PetDashboard from './components/Pet/PetDashboard'; 

import './index.css'; 

import logo from './assets/MainTitle1.png';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={(
          <div className="welcome-page">

            <img src={logo} alt="WhimsyPets" className="welcome-title" />
            
            <div className="welcome-buttons">
              <Link to="/signup">
              <button className="btn jersey-10-regular">Sign Up</button>
              </Link>
              <Link to="/signin">
              <button className="btn jersey-10-regular">Sign In</button>
              </Link>
            </div>
          </div>
        )} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/signin" element={<SignInForm />} />
        <Route path="/user-dashboard" element={<UserDashboard />} /> 
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/create-pet" element={<CreatePet />} />
        <Route path="/pet-dashboard" element={<PetDashboard />} />
        </Routes>
    </Router>
  );
};

export default App;