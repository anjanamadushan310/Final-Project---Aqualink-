import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/home/Navbar";
import LoginForm from "./pages/Login"
import Dashboard from "./components/home/Dashboard";
import RegistrationForm from "./components/RegistrationForm";
import HomePage from "./pages/HomePage";
import OrderUI from "./pages/OrderUI";
import ProductDetails from "./pages/ProductDetails";
import useAuth from "./hooks/useAuth";

import Footer from './components/home/Footer';


const App = () => {
  const { user, login, logout } = useAuth();

  const [showLogin, setShowLogin] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [dashboard, setDashboard] = useState(null);

  // "Open login" global event for nav
  useEffect(() => {
    const f = () => setShowLogin(true);
    window.addEventListener("show-login", f);
    return () => window.removeEventListener("show-login", f);
  }, []);

  // When logout, close profile menu and reset dashboard
  const handleLogout = () => {
    logout();
    setDashboard(null);
    setShowProfileMenu(false);
  };

  // Handle dashboard selection
  const handleDashboardSelect = (role) => {
    setDashboard(role);
  };

  return (
    <Router>
      <div>
        {/* Navbar */}
        <Navbar
          user={user}
          onLogout={handleLogout}
          dashboardName={dashboard}
          onProfileClick={() => setShowProfileMenu((s) => !s)}
          showProfileMenu={showProfileMenu}
          setShowProfileMenu={setShowProfileMenu}
          onDashboardSelect={handleDashboardSelect}
        />

        {/* Login Modal */}
        {showLogin && (
          <LoginForm
            onLogin={login}
            onClose={() => setShowLogin(false)}
          />
        )}

        {/* Main Content */}
        <main className="w-full mt-10">
          {/* If logged in and dashboard selected, show dashboard */}
          {user && dashboard && <Dashboard dashboardName={dashboard} />}

          {/* If logged in but no dashboard selected */}
          {user && !dashboard && (
            <div>
              <HomePage/>
            </div>
          )}

          {/* If not logged in */}
          {!user && (
            <>
              <Routes>
                <Route path="/register" element={<RegistrationForm setShowLogin={setShowLogin} />}  />
                <Route path="/" element={<HomePage />} />
                <Route path="/orderUI" element={<OrderUI />} />
                <Route path="/product" element={<ProductDetails />} />
                {/* You can add more public routes here */}
              </Routes>
              
            </>
          )}
        </main>
      </div>
       <Footer />
    </Router>
  );
};

export default App;
