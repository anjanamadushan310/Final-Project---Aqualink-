// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import AdminDashboard from './components/AdminDashboard';
import HomePage from './pages/HomePage';
const App = () => {
  return (
    <Router>
      <Routes>

        {/* Home Page route */}
        <Route path="/" element={<HomePage />} />

        {/* Registration Form route */}
        <Route path="/register" element={<RegistrationForm />} />

        {/* Admin Dashboard route */}
        <Route path="/admin" element={<AdminDashboard />} />
        
      </Routes>
    </Router>
  );
};

export default App;
