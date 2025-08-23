
import React from 'react';
import { Fish } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({
  user,
  onLogout,
  dashboardName,
  onProfileClick,
  showProfileMenu,
  setShowProfileMenu,
 
}) {
  const navigate = useNavigate();

  // Handle dashboard selection with navigation
  const handleDashboardSelect = (role) => {
    // Convert role to URL-friendly format
    const dashboardPath = role.toLowerCase().replace('_', '-').replace('_', '-');        //replace(/_/g, '-');
    
    // Navigate to the dashboard route
    navigate(`/dashboard/${dashboardPath}`);
    
    // Close the profile menu
    setShowProfileMenu(false);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700 text-white shadow-2xl sticky top-0 z-50 backdrop-blur-sm">
      <div className="mx-14">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/"> 
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2 mt-2 rounded-full">
                <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-full"/>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-200 bg-clip-text text-transparent">
                AquaLink
              </h1>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="flex items-center space-x-6">
            {!dashboardName && (
              <>
                <Link to="/shopping-cart" className="text-white font-medium hover:underline">
                  Shopping Cart
                </Link>
                <Link to="/about" className="text-white font-medium hover:underline">
                  About
                </Link>
                <Link to="/contact" className="text-white font-medium hover:underline">
                  Contact Us
                </Link>
              </>
            )}

            
            

            {/* Auth Buttons */}
            {!user && (
              <>
                <button 
                  onClick={() => window.dispatchEvent(new Event('show-login'))}
                  className="text-white font-medium hover:underline"
                >
                  Login
                </button>
                <button 
                  onClick={() => navigate("/register")}
                  className="ml-2 bg-cyan-400 hover:bg-cyan-500 text-white px-4 py-1 rounded-full font-bold transition"
                >
                  Register
                </button>
              </>
            )}

            {/* Profile Button */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu((prev) => !prev)}
                  className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-cyan-300 border-2 border-white flex items-center justify-center text-xl text-white focus:outline-none"
                  title="Profile"
                >
                  <span>{user.nicNumber ? user.nicNumber[0].toUpperCase() : "U"}</span>
                </button>

                {/* Profile Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg py-2 z-20">
                    {user.roles?.map((role) => (
                      <button
                        key={role}
                        className="block w-full px-4 py-2 text-left hover:bg-cyan-100 text-gray-700"
                        onClick={() => handleDashboardSelect(role)}
                      >
                        {role === "SHOP_OWNER"
                          ? "Shop Owner Dashboard"
                          : role === "FARM_OWNER"
                          ? "Farm Owner Dashboard"
                          : role === "COLLECTOR"
                          ? "Collector  Dashboard"
                          : role === "SERVICE_PROVIDER"
                          ? "Service Provider Dashboard"
                          : role === "INDUSTRIAL_STUFF_SELLER"
                          ? "Industrial Stuff Seller Dashboard"
                          : role === "DELIVERY_PERSON"
                          ? "Delivery Person Dashboard"
                          : role === "ADMIN"
                          ? "Admin Dashboard"
                          
                          : `${role} Dashboard`}
                      </button>
                    ))}
                    <hr className="my-1" />
                    <button
                      className="block w-full px-4 py-2 text-left hover:bg-cyan-100 text-red-600"
                      onClick={onLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
