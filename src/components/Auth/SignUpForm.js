import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../services/api';
import '../../styles/SignUpForm.css';
import { Link } from 'react-router-dom';

import logo from '../../assets/MainTitle1.png';

const SignUpForm = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await signup({ userName, email, password });

      console.log('User signed up successfully:', response.data);

      localStorage.setItem('token', response.data.token);

      const role = response.data.role;  
      if (role === 'ADMIN') {
        navigate('/admin-dashboard');  
      } else if (role === 'USER') {
        navigate('/user-dashboard');  
      }
    } catch (error) {
      console.error('Error while signing up:', error.response || error);
      setErrorMessage('Error while signing up. Try again.');
    }
  };

  return (
    <div className="sign-up-page">
      {/* Imagen de título afuera del recuadro */}
      <img src={logo} alt="WhimsyPets" className="title-image" />
      
      <div className="sign-up-form-container">
        {errorMessage && <div>{errorMessage}</div>}
        <form onSubmit={handleSubmit} className="sign-up-form">
          <div>
            <label>Username</label>
            <input
              type="text"
              placeholder="Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Sign Up</button>
          <div className="create-account-link">
            <p>Have an account? <Link to="/signin">Sign In</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;