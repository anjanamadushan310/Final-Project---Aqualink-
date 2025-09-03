import React, { useState, useEffect } from 'react';
import CurrentDeliveries from './CurrentDeliveries';
import DeliveryHistory from './DeliveryHistory';
import EarningsTracker from './EarningsTracker';

const DeliveryTracking = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  // Mock data for development
  const mockStats = {
    todayDeliveries: 8,
    activeDeliveries: 3,
    completedDeliveries: 156,
    todayEarnings: 4500,
    totalEarnings: 125000,
    avgRating: 4.8,
    totalDistance: 1250
  };

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  }, []);

  const formatPrice = (price) => {
    if (!price || isNaN(price)) return 'Rs.0.00';
    return `Rs.${parseFloat(price).toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const tabs = [
    { id: 'current', label: 'Current Deliveries', icon: '🚚' },
    { id: 'history', label: 'Delivery History', icon: '📋' },
    { id: 'earnings', label: 'Earnings Tracker', icon: '💰' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading delivery tracking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Delivery Tracking</h1>
              <p className="text-gray-600">Monitor your deliveries, track progress, and manage earnings</p>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 lg:mt-0">
              <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
                <div className="text-2xl font-bold text-blue-800">{stats.activeDeliveries}</div>
                <div className="text-xs text-blue-600">Active</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                <div className="text-2xl font-bold text-green-800">{stats.todayDeliveries}</div>
                <div className="text-xs text-green-600">Today</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center border border-purple-200">
                <div className="text-xl font-bold text-purple-800">{formatPrice(stats.todayEarnings)}</div>
                <div className="text-xs text-purple-600">Today's Earnings</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-800">{stats.avgRating}/5</div>
                <div className="text-xs text-yellow-600">Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-300">
          {activeTab === 'current' && <CurrentDeliveries />}
          {activeTab === 'history' && <DeliveryHistory />}
          {activeTab === 'earnings' && <EarningsTracker />}
        </div>
      </div>
    </div>
  );
};

export default DeliveryTracking;
