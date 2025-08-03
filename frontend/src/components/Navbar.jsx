import React, { useState } from 'react';
import { Fish, Menu, X } from 'lucide-react';

// Mock Router Link component for demo
const Link = ({ to, children, className, ...props }) => (
  <a href={to} className={className} {...props}>{children}</a>
);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700 text-white shadow-2xl sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-full">
              <Fish className="h-8 w-8 text-cyan-300" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-200 bg-clip-text text-transparent">
              AquaLink
            </h1>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/shop" className="hover:text-cyan-300 transition-colors duration-200 font-medium">
              Shop
            </Link>
            <Link to="/about" className="hover:text-cyan-300 transition-colors duration-200 font-medium">
              About
            </Link>
            <Link to="/contact" className="hover:text-cyan-300 transition-colors duration-200 font-medium">
              Contact
            </Link>
            <Link to="/login" className="hover:text-cyan-300 transition-colors duration-200 font-medium">
              Login
            </Link>
            <Link to="/register" className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-2 rounded-full hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105">
              Register
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-cyan-300 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-blue-900 bg-opacity-95 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/shop" className="block px-3 py-2 text-white hover:text-cyan-300 transition-colors duration-200">
                Shop
              </Link>
              <Link to="/about" className="block px-3 py-2 text-white hover:text-cyan-300 transition-colors duration-200">
                About
              </Link>
              <Link to="/contact" className="block px-3 py-2 text-white hover:text-cyan-300 transition-colors duration-200">
                Contact
              </Link>
              <Link to="/login" className="block px-3 py-2 text-white hover:text-cyan-300 transition-colors duration-200">
                Login
              </Link>
              <Link to="/register" className="block px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-md hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 mx-3 text-center">
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;