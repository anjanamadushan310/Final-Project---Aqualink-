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
  onDashboardSelect,
})
{

const navigate = useNavigate();
  return (
    <nav className="bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700 text-white shadow-2xl sticky top-0 z-50 backdrop-blur-sm">
      <div className="mx-14">
        <div className="flex justify-between items-cente h-16">
          {/* Logo */}
         <a href='/'> <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-2 mt-2 rounded-full">
              <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-full"/>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-200 bg-clip-text text-transparent">
              AquaLink
            </h1>
          </div></a>

          {/* Desktop Menu */}
          {/* Links */}
      <div className="flex items-center space-x-6">
        {!dashboardName && <>
          <a href="/shopping-cart" className="text-white font-medium">Shopping Cart</a>
          <a href="/about" className="text-white font-medium">About</a>
          <a href="/contact" className="text-white font-medium">Contact Us</a>
        </>}
        {/* Dashboard name */}
        {dashboardName && (
          <span className="text-white bg-cyan-900 px-3 py-1 rounded-full font-semibold shadow">
            {dashboardName}
          </span>
        )}

        {/* Auth Buttons */}
        {!user && (
          <>
            <button  onClick={() => window.dispatchEvent(new Event('show-login'))}
              className="text-white font-medium hover:underline"
            >Login</button>
            <button onClick={() => navigate("/register")}
              className="ml-2 bg-cyan-400 hover:bg-cyan-500 text-white px-4 py-1 rounded-full font-bold transition"
            >Register</button>
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
              {/* Show initials or icon */}
              <span>{user.nicNumber ? user.nicNumber[0].toUpperCase() : "U"}</span>
            </button>
            {/* Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg py-2 z-20">
                {user.roles?.map((role, i) => (
                  <button
                    key={role}
                    className="block w-full px-4 py-2 text-left hover:bg-cyan-100 text-gray-700"
                    onClick={() => {
                      setShowProfileMenu(false);
                      onDashboardSelect(role);
                    }}
                  >
                    {role === "SHOP_OWNER"
                      ? "Shop Owner"
                      : role === "FARM_OWNER"
                      ? "Farm Owner"
                      : role}
                  </button>
                ))}
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
