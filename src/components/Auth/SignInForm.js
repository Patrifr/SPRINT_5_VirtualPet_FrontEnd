import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; 
import { signin } from '../../services/api';
import '../../styles/SignInForm.css';

import logo from '../../assets/MainTitle1.png'


const SignInForm = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('userName:', userName);  
    console.log('password:', password); 

    try {
      const response = await signin({ userName, password });

      console.log('User signed in successfully:', response.data);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('role', response.data.role)

      const role = response.data.role;  
      if (role === 'ADMIN') {
        navigate('/admin-dashboard');  
      } else if (role === 'USER') {
        navigate('/user-dashboard');  
      }
    } catch (error) {
      console.error('Error while signing in:', error.response || error);
      setErrorMessage('Error while signing in. Try again.');
    }
  };

  return (
    <div className="sign-in-page">
      <img src={logo}  alt="WhimsyPets" className="title-image" />
      {errorMessage && <div>{errorMessage}</div>}
      <form onSubmit={handleSubmit} className="sign-in-form">
        <div>
          <label>Username</label>
          <input 
            type="userName" 
            placeholder="Name" 
            value={userName} 
            onChange={(e) => setUserName(e.target.value)} 
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
        <button type="submit">Sign In</button>
        <div className="create-account-link">
        <p>Don't have an account? <Link to="/signup">Create an account</Link></p>
      </div>
      </form>      
    </div>
  );
};

export default SignInForm;