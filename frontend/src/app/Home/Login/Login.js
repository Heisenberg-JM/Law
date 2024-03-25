import React, { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons';
import {toast} from 'react-toastify';


const Login = ({ setToken, toggleLoginForm }) => { // Receive toggleLoginForm as a prop

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleChange = (e) => { 
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include', // Include credentials to send cookies
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      setToken(data.token); // Set token in parent component
     
      if(data.userType === 'staff'){
        toast.success('Staff Login successful');
        navigate('/sdashboard'); // Redirect to dashboard after successful login
      }
      else{
        toast.success('User Login successful');
        navigate('/dashboard'); // Redirect to dashboard after successful login}
      }
      
    } catch (error) {
      toast.error(error.message)
      setError('Invalid email or password');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
           <button id="buttt" className="close-btn" onClick={toggleLoginForm}>
                <FontAwesomeIcon icon={faAnglesLeft} />
          </button>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <span className="input-icon">
            <FaUser />
          </span>
          <input type="email" 
          placeholder="Email" 
          name="email"
          onChange={handleChange} required />
        </div>
        <div className="input-group">
          <span className="input-icon">
            <FaLock />
          </span>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            name="password"
            onChange={handleChange} required
          />
          <span className="password-icon" onClick={togglePasswordVisibility}>
            {showPassword ? <RiEyeFill /> : <RiEyeOffFill />}
          </span>
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
        {error && <p className="error-message">{error}</p>}
        
{/* <button id="buttt" className="close-btn" onClick={toggleLoginForm}>
              <h2 className="logo" id="data">
            SHE-GUARDIANS
                </h2>        
        </button> */}
   

      </form>
    </div>
  );
};

export default Login;
