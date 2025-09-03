import React, { useState, useEffect } from 'react';

const DeliveryHistory = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock delivery history data with confirmation details
  const mockDeliveries = [
    {
      id: 1,
      orderId: 'ORD001',
      quoteId: 'QT001',
      customerName: 'Saman Perera',
      customerPhone: '0771234567',
      deliveryAddress: '123 Main Street, Dehiwala',
      district: 'Colombo',
      town: 'Dehiwala',
      distance: 15,
      deliveryFee: 1200,
      status: 'DELIVERED',
      startTime: '2025-09-02T09:30:00',
      completedTime: '2025-09-02T11:15:00',
      deliveryTime: '1h 45m',
      rating: 5,
      feedback: 'Excellent service, fish arrived in perfect condition!',
      items: ['Gold Fish x5', 'Aquarium Filter x1'],
      // Confirmation details
      confirmationCode: 'ABC123',
      customerSignature: 'Saman Perera',
      deliveryNotes: 'Fish were healthy and active upon delivery. Customer was very satisfied.',
      deliveryLocation: { lat: 6.8566, lng: 79.8816 }
    },
    {
      id: 2,
      orderId: 'ORD002',
      quoteId: 'QT002',
      customerName: 'Kamal Silva',
      customerPhone: '0779876543',
      deliveryAddress: '456 Beach Road, Negombo',
      district: 'Gampaha',
      town: 'Negombo',
      distance: 25,
      deliveryFee: 1500,
      status: 'DELIVERED',
      startTime: '2025-09-01T14:00:00',
      completedTime: '2025-09-01T16:30:00',
      deliveryTime: '2h 30m',
      rating: 4,
      feedback: 'Good delivery, but slightly delayed',
      items: ['Fish Food Premium x2', 'Water Conditioner x1'],
      // Confirmation details
      confirmationCode: 'XYZ789',
      customerSignature: 'K. Silva',
      deliveryNotes: 'Minor delay due to traffic, but customer understood. Items delivered safely.',
      deliveryLocation: { lat: 7.2083, lng: 79.8358 }
    },
    {
      id: 3,
      orderId: 'ORD003',
      quoteId: 'QT003',
      customerName: 'Nimal Fernando',
      customerPhone: '0712345678',
      deliveryAddress: '789 Temple Road, Peradeniya',
      district: 'Kandy',
      town: 'Peradeniya',
      distance: 35,
      deliveryFee: 2200,
      status: 'CANCELLED',
      startTime: '2025-08-31T10:00:00',
      completedTime: null,
      deliveryTime: null,
      rating: null,
      feedback: 'Customer cancelled - not available',
      items: ['Large Aquarium Tank x1', 'Aquarium Stand x1'],
      confirmationCode: null,
      customerSignature: null,
      deliveryNotes: null,
      deliveryLocation: null
    },
    {
      id: 4,
      orderId: 'ORD004',
      quoteId: 'QT004',
      customerName: 'Priya Jayawardena',
      customerPhone: '0764567890',
      deliveryAddress: '321 Coral Gardens, Hikkaduwa',
      district: 'Galle',
      town: 'Hikkaduwa',
      distance: 45,
      deliveryFee: 1800,
      status: 'DELIVERED',
      startTime: '2025-08-30T08:00:00',
      completedTime: '2025-08-30T12:45:00',
      deliveryTime: '4h 45m',
      rating: 5,
      feedback: 'Perfect timing and great care with items',
      items: ['Tropical Fish Mix x10', 'Aquarium Plants x5'],
      // Confirmation details
      confirmationCode: 'DEF456',
      customerSignature: 'Priya J.',
      deliveryNotes: 'Long distance delivery completed successfully. Fish plants kept in optimal condition.',
      deliveryLocation: { lat: 6.1416, lng: 80.0992 }
    },
    {
      id: 5,
      orderId: 'ORD005',
      quoteId: 'QT005',
      customerName: 'Ruwan Wickramasinghe',
      customerPhone: '0751234567',
      deliveryAddress: '654 Station Road, Moratuwa',
      district: 'Colombo',
      town: 'Moratuwa',
      distance: 12,
      deliveryFee: 900,
      status: 'DELIVERED',
      startTime: '2025-08-29T16:30:00',
      completedTime: '2025-08-29T17:45:00',
      deliveryTime: '1h 15m',
      rating: 4,
      feedback: 'Quick and efficient delivery',
      items: ['Fish Tank Cleaner x1', 'pH Test Kit x1'],
      // Confirmation details
      confirmationCode: 'GHI789',
      customerSignature: 'R. Wickramasinghe',
      deliveryNotes: 'Quick delivery completed in excellent time. Customer appreciated the speed.',
      deliveryLocation: { lat: 6.7730, lng: 79.8816 }
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setDeliveries(mockDeliveries);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    filterDeliveries();
  }, [deliveries, dateFilter, statusFilter, searchTerm]);

  const filterDeliveries = () => {
    let filtered = [...deliveries];

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(delivery => delivery.status === statusFilter);
    }

    // Date filter
    if (dateFilter) {
      const today = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(delivery => 
            new Date(delivery.startTime).toDateString() === today.toDateString()
          );
          break;
        case 'week':
          filterDate.setDate(today.getDate() - 7);
          filtered = filtered.filter(delivery => 
            new Date(delivery.startTime) >= filterDate
          );
          break;
        case 'month':
          filterDate.setMonth(today.getMonth() - 1);
          filtered = filtered.filter(delivery => 
            new Date(delivery.startTime) >= filterDate
          );
          break;
      }
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(delivery =>
        delivery.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.town.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

    setFilteredDeliveries(filtered);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return `Rs.${parseFloat(price).toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-500';
      case 'CANCELLED': return 'bg-red-500';
      case 'RETURNED': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const renderStars = (rating) => {
    if (!rating) return <span className="text-gray-400">No rating</span>;
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`h-4 w-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search deliveries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="RETURNED">Returned</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setDateFilter('');
                setStatusFilter('');
                setSearchTerm('');
              }}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Delivery History Cards */}
      <div className="space-y-4">
        {filteredDeliveries.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No delivery history found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter || dateFilter 
                ? 'Try adjusting your filters to see more results.' 
                : 'Your completed deliveries will appear here.'
              }
            </p>
          </div>
        ) : (
          filteredDeliveries.map(delivery => (
            <div key={delivery.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Order #{delivery.orderId}</h3>
                    <p className="text-sm text-gray-500">{formatDate(delivery.startTime)} at {formatTime(delivery.startTime)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className={`${getStatusColor(delivery.status)} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                    {delivery.status}
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600">{formatPrice(delivery.deliveryFee)}</div>
                    {delivery.deliveryTime && (
                      <div className="text-sm text-gray-500">{delivery.deliveryTime}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Customer</h4>
                  <p className="text-gray-800">{delivery.customerName}</p>
                  <p className="text-sm text-gray-600">{delivery.customerPhone}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                  <p className="text-gray-800">{delivery.town}, {delivery.district}</p>
                  <p className="text-sm text-gray-600">{delivery.distance} km</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Items</h4>
                  <div className="text-sm text-gray-600">
                    {delivery.items.map((item, index) => (
                      <p key={index}>{item}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Delivery Confirmation Details */}
              {delivery.status === 'DELIVERED' && delivery.confirmationCode && (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Delivery Confirmed
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">Confirmation Code:</span>
                      <span className="font-mono font-bold text-green-700 bg-green-100 px-2 py-1 rounded">
                        {delivery.confirmationCode}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Received By:</span>
                      <span className="ml-2 font-semibold text-gray-900">{delivery.customerSignature}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Completed:</span>
                      <span className="ml-2 font-semibold text-gray-900">
                        {formatDate(delivery.completedTime)} at {formatTime(delivery.completedTime)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <span className="ml-2 font-semibold text-gray-900">{delivery.deliveryTime}</span>
                    </div>
                  </div>
                  {delivery.deliveryNotes && (
                    <div className="pt-3 border-t border-green-200">
                      <span className="text-gray-600 text-sm font-semibold">Delivery Notes:</span>
                      <p className="mt-1 text-gray-800 text-sm">{delivery.deliveryNotes}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Rating & Feedback */}
              {delivery.status === 'DELIVERED' && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Customer Rating</h4>
                      {renderStars(delivery.rating)}
                    </div>
                    {delivery.feedback && (
                      <div className="flex-1 ml-6">
                        <h4 className="font-semibold text-gray-900 mb-2">Feedback</h4>
                        <p className="text-gray-700 italic">"{delivery.feedback}"</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Cancelled/Returned Info */}
              {(delivery.status === 'CANCELLED' || delivery.status === 'RETURNED') && (
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Status Note
                  </h4>
                  <p className="text-red-700">{delivery.feedback}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DeliveryHistory;
