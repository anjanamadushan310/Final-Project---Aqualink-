import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  UserPlusIcon, 
  CubeIcon, 
  UsersIcon,
  StarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  PhotoIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const menuItems = [
    { id: 'user-verification', label: 'User Verification', icon: UserPlusIcon, path: '/dashboard/user-verification' },
    { id: 'product-management', label: 'Fish Ads Management', icon: CubeIcon, path: '/dashboard/fish-ads' },
    { id: 'Stuff-management', label: 'Stuff Management', icon: CubeIcon, path: '/dashboard/stuff-management' },
    { id: 'Service-management', label: 'Service Management', icon: CubeIcon, path: '/dashboard/service-management' },
    { id: 'user-management', label: 'User Management', icon: UsersIcon, path: '/dashboard/user-management' },
    { id: 'reviews', label: 'Reviews Management', icon: StarIcon, path: '/dashboard/reviews' },
    { id: 'earnings', label: 'Earnings & Payments', icon: CurrencyDollarIcon, path: '/dashboard/earnings' },
    { id: 'banners', label: 'Banner Management', icon: PhotoIcon, path: '/dashboard/banners' },
  ];

  return (
    <>
      {/* Mobile sidebar overlay */}
      <div 
        className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden ${
          sidebarOpen ? 'opacity-100 z-40' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 z-50 w-64 h-full bg-gradient-to-br from-blue-900  via-blue-800 to-cyan-800 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-blue-700">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="bg-white bg-opacity-20 p-2 mt-2 rounded-full">
                <img src="/logo.png" alt="AquaLink Logo" className="w-8 h-8 rounded-full"/>
              </div>
            <h2 className="text-xl font-bold">Admin</h2>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-cyan-800"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `w-full flex items-center space-x-3 px-3 py-3 mb-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-lg'
                      : 'text-blue-100 hover:bg-teal-600 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
