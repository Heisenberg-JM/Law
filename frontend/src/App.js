import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css/animate.min.css';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import Home from './app/Home/Home';
import Dashboard from './app/DashBoard/DashBoard';
import SDashboard from './app/DashBoard/SDashBoard';


function App() {
  const [token, setToken] = useState('');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home setToken={setToken}  />} />
        <Route path="/home" element={<Home setToken={setToken}  />} />
        <Route path="/sdashboard" element={<SDashboard token={token} />} />
        <Route path="/dashboard" element={<Dashboard token={token} />} />
      </Routes>
      <ToastContainer theme='dark'/>
    </Router>
  );
}

export default App;
