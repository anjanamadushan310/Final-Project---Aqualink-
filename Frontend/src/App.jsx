
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/home/Navbar";
import LoginForm from "./pages/Login"
import RegistrationForm from "./components/RegistrationForm";
import HomePage from "./pages/HomePage";
import OrderUI from "./pages/OrderUI";
import useAuth from "./hooks/useAuth";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import ShopOwnerDashboard from "./pages/dashboards/ShopOwnerDashboard";
import FarmOwnerDashboard from "./pages/dashboards/FarmOwnerDashboard";
import CollectorDashboard from "./pages/dashboards/CollectorDashboard";
import ServiceProviderDashboard from "./pages/dashboards/ServiceProviderDashboard";
import IndustrialStuffSellerDashboard from "./pages/dashboards/IndustrialStuffSellerDashboard";
import DeliveryPersonDashboard from "./pages/dashboards/DeliveryPersonDashboard";


import ProductApprove from "./components/admin/ProductApprove";
import FishAdsForm from "./components/farmowner/FishAdsForm";
import UserProfile from "./pages/UserProfile";
import Cart from './pages/Cart';
import AboutPage from './pages/AboutPage';
import Contact from './pages/Contact';



const App = () => {
  const { user, login, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const handleLogin = (data, navigate) => {
  login(data, navigate);
};

  // "Open login" global event for nav"
  useEffect(() => {
    const f = () => setShowLogin(true);
    window.addEventListener("show-login", f);
    return () => window.removeEventListener("show-login", f);
  }, []);

  // When logout, close profile menu
  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    
  };

  return (
    <Router>
      <div>
        
        {/* Navbar */}
        <Navbar
          user={user}
          onLogout={handleLogout}
          onProfileClick={() => setShowProfileMenu((s) => !s)}
          showProfileMenu={showProfileMenu}
          setShowProfileMenu={setShowProfileMenu}
        />

        {/* Login Modal */}
        {showLogin && (
        <LoginForm
        onLogin={handleLogin}
       onClose={() => setShowLogin(false)}
        />
        )}

        {/* Main Content */}
        <main className="w-full mt-10">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegistrationForm setShowLogin={setShowLogin} />} />
            <Route path="/orderUI" element={<OrderUI />} />
            <Route path="/shopping-cart" element={<Cart />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<Contact/>} />
            
            
            
            
            {/* Protected Dashboard Routes */}
            <Route path="/dashboard/shop-owner" element={<ShopOwnerDashboard />}/>
            <Route path="/dashboard/Farm-Owner" element={<FarmOwnerDashboard />}/>
            <Route path="/dashboard/Collector" element={<CollectorDashboard />}/>
            <Route path="/dashboard/Service-Provider" element={<ServiceProviderDashboard />}/>
            <Route path="/dashboard/Industrial-Stuff-Seller" element={<IndustrialStuffSellerDashboard/>}/>
            <Route path="/dashboard/Delivery-Person" element={<DeliveryPersonDashboard />}/>
            <Route path="/dashboard/admin" element={<AdminDashboard />} />

            <Route path="/productaprove" element={<ProductApprove />} />

            //not completed
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/fish-ads-form" element={<FishAdsForm />} />

    
          </Routes>
        </main>
      </div>
     
    </Router>
  );
};

// Wrapper component to handle dynamic dashboard types
const DashboardWrapper = () => {
  const { dashboardType } = useParams();
  return <Dashboard dashboardName={dashboardType.toUpperCase()} />;
};

export default App;