import React, { useState } from 'react';
import Login from './Login/Login'; // Import Login component
import Register from './Register/Register'; // Import Register component
import './Home.css';

const Home = ({ setToken }) => { // Pass setToken as a prop
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const toggleLoginForm = () => {
    setShowLoginForm(!showLoginForm);
    setShowRegisterForm(false);
  };

  const toggleRegisterForm = () => {
    setShowRegisterForm(!showRegisterForm);
    setShowLoginForm(false);
  };

  return (
    <div className="home">
      <section className={`showcase ${showLoginForm || showRegisterForm ? 'active' : ''}`}>
        <header>
          <h2 className="logo" id="data">
            SHE-GUARDIANS
          </h2>
          <div className="ggle" onClick={toggleLoginForm}></div>
        </header>
        <div className="overlay"></div>
        <div className="text">
          <h2>Empowering Women on the Go</h2>
          <h4>Welcome to 'She-Guardians': Your Safe Haven in the City</h4>
          <p>
            At 'She-Guardians,' In collaboration with 'Ente Koodu' a government lead movement, we understand the challenges faced by women when traveling for official purposes. Our project provides a safe and welcoming space for women, girls, 
            and boys below 12 years old during their visits to the city
          </p>
          <button onClick={toggleLoginForm}>LOGIN</button>
          <button onClick={toggleRegisterForm}>Create a new user</button>
        </div>
        <ul className="social">
          <li>
            <a href="https://github.com/TeamDatapirates">
              <i className="fa fa-github"></i>
            </a>
          </li>
        </ul>
      </section>

      {showLoginForm && (
        <div className="login-form-container animate__animated animate__slideInLeft">
          <Login setToken={setToken} toggleLoginForm={toggleLoginForm} /> {/* Pass toggleLoginForm as a prop */}
        </div>
      )}

      {showRegisterForm && (
        <div className="register-form-container animate__animated animate__slideInLeft">
          <Register toggleRegisterForm={toggleRegisterForm} /> {/* Pass toggleRegisterForm as a prop */}
        </div>
      )}
    </div>
  );
};

export default Home;
