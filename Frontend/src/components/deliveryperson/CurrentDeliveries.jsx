import React, { useState, useEffect } from 'react';
import DeliveryConfirmationCode from './DeliveryConfirmationCode';

const CurrentDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState({});

  // Mock current deliveries data with confirmation fields
  const mockDeliveries = [
    {
      id: 1,
      orderId: 'ORD001',
      quoteId: 'QT001',
      customerName: 'Saman Perera',
      customerPhone: '0771234567',
      pickupAddress: 'Aqualink Store, Colombo 03',
      deliveryAddress: '123 Main Street, Dehiwala',
      district: 'Colombo',
      town: 'Dehiwala',
      distance: 15,
      deliveryFee: 1200,
      status: 'PICKED_UP',
      startTime: '2025-09-03T09:30:00',
      estimatedDelivery: '2025-09-03T11:30:00',
      specialInstructions: 'Handle live fish carefully',
      customerLocation: { lat: 6.8566, lng: 79.8816 },
      currentLocation: { lat: 6.8400, lng: 79.8700 },
      items: [
        { name: 'Gold Fish', quantity: 5, special: true },
        { name: 'Aquarium Filter', quantity: 1, special: false }
      ],
      // Confirmation fields
      confirmationCode: null,
      customerSignature: null,
      deliveryNotes: null,
      completedAt: null,
      deliveryLocation: null
    },
    {
      id: 2,
      orderId: 'ORD002',
      quoteId: 'QT002',
      customerName: 'Kamal Silva',
      customerPhone: '0779876543',
      pickupAddress: 'Aqualink Store, Colombo 03',
      deliveryAddress: '456 Beach Road, Negombo',
      district: 'Gampaha',
      town: 'Negombo',
      distance: 25,
      deliveryFee: 1500,
      status: 'IN_TRANSIT',
      startTime: '2025-09-03T08:00:00',
      estimatedDelivery: '2025-09-03T10:00:00',
      specialInstructions: 'Call before arrival',
      customerLocation: { lat: 7.2083, lng: 79.8358 },
      currentLocation: { lat: 6.9500, lng: 79.8500 },
      items: [
        { name: 'Fish Food Premium', quantity: 2, special: false },
        { name: 'Water Conditioner', quantity: 1, special: false }
      ],
      confirmationCode: null,
      customerSignature: null,
      deliveryNotes: null,
      completedAt: null,
      deliveryLocation: null
    },
    {
      id: 3,
      orderId: 'ORD003',
      quoteId: 'QT003',
      customerName: 'Nimal Fernando',
      customerPhone: '0712345678',
      pickupAddress: 'Aqualink Store, Colombo 03',
      deliveryAddress: '789 Temple Road, Peradeniya',
      district: 'Kandy',
      town: 'Peradeniya',
      distance: 35,
      deliveryFee: 2200,
      status: 'ARRIVED',
      startTime: '2025-09-03T07:00:00',
      estimatedDelivery: '2025-09-03T11:00:00',
      specialInstructions: 'Large tank - need assistance unloading',
      customerLocation: { lat: 7.2572, lng: 80.5970 },
      currentLocation: { lat: 7.2572, lng: 80.5970 },
      items: [
        { name: 'Large Aquarium Tank', quantity: 1, special: true },
        { name: 'Aquarium Stand', quantity: 1, special: true }
      ],
      confirmationCode: null,
      customerSignature: null,
      deliveryNotes: null,
      completedAt: null,
      deliveryLocation: null
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setDeliveries(mockDeliveries);
      setLoading(false);
    }, 800);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ASSIGNED': return 'bg-blue-500';
      case 'PICKED_UP': return 'bg-yellow-500';
      case 'IN_TRANSIT': return 'bg-purple-500';
      case 'ARRIVED': return 'bg-orange-500';
      case 'DELIVERED': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ASSIGNED': return 'Ready to Pick';
      case 'PICKED_UP': return 'Picked Up';
      case 'IN_TRANSIT': return 'In Transit';
      case 'ARRIVED': return 'Arrived';
      case 'DELIVERED': return 'Delivered';
      default: return status;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Not started';
    return new Date(timeString).toLocaleTimeString('en-US', {
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

  const updateDeliveryStatus = (deliveryId, newStatus) => {
    setDeliveries(prevDeliveries =>
      prevDeliveries.map(delivery =>
        delivery.id === deliveryId
          ? {
              ...delivery,
              status: newStatus,
              startTime: newStatus === 'PICKED_UP' && !delivery.startTime 
                ? new Date().toISOString() 
                : delivery.startTime
            }
          : delivery
      )
    );
  };

  const handleDeliveryConfirmation = async (deliveryId, confirmationData) => {
    try {
      setDeliveries(prevDeliveries =>
        prevDeliveries.map(delivery =>
          delivery.id === deliveryId
            ? {
                ...delivery,
                status: 'DELIVERED',
                confirmationCode: confirmationData.confirmationCode,
                customerSignature: confirmationData.customerSignature,
                deliveryNotes: confirmationData.deliveryNotes,
                completedAt: confirmationData.timestamp,
                deliveryLocation: confirmationData.location
              }
            : delivery
        )
      );

      setShowConfirmation(prev => ({ ...prev, [deliveryId]: false }));
      alert('Delivery confirmed successfully!');
      
    } catch (error) {
      console.error('Error confirming delivery:', error);
      throw error;
    }
  };

  const getNextAction = (status) => {
    switch (status) {
      case 'ASSIGNED': return { action: 'PICKED_UP', label: 'Mark as Picked Up', color: 'bg-blue-600' };
      case 'PICKED_UP': return { action: 'IN_TRANSIT', label: 'Start Delivery', color: 'bg-yellow-600' };
      case 'IN_TRANSIT': return { action: 'ARRIVED', label: 'Mark as Arrived', color: 'bg-purple-600' };
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {deliveries.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">🚚</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Deliveries</h3>
          <p className="text-gray-600">You don't have any deliveries in progress right now.</p>
        </div>
      ) : (
        deliveries.map(delivery => (
          <div key={delivery.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V7M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Order #{delivery.orderId}</h3>
                    <p className="text-gray-600">Quote #{delivery.quoteId}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className={`${getStatusColor(delivery.status)} text-white px-4 py-2 rounded-full font-semibold flex items-center space-x-2`}>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span>{getStatusText(delivery.status)}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{formatPrice(delivery.deliveryFee)}</div>
                    <div className="text-sm text-gray-500">Delivery Fee</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer & Location Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Customer Information
                    </h4>
                    <div className="space-y-2">
                      <p className="font-semibold text-gray-900">{delivery.customerName}</p>
                      <p className="text-gray-600 flex items-center">
                        <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <a href={`tel:${delivery.customerPhone}`} className="text-blue-600 hover:text-blue-800">
                          {delivery.customerPhone}
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Delivery Location
                    </h4>
                    <div className="space-y-2">
                      <p className="font-semibold text-gray-900">{delivery.town}, {delivery.district}</p>
                      <p className="text-sm text-gray-600">{delivery.deliveryAddress}</p>
                      <p className="text-sm text-green-700 font-medium">{delivery.distance} km distance</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Timeline */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="h-5 w-5 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Timeline
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Started:</span>
                        <span className="font-semibold">{formatTime(delivery.startTime)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ETA:</span>
                        <span className="font-semibold">{formatTime(delivery.estimatedDelivery)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      Items ({delivery.items.length})
                    </h4>
                    <div className="space-y-2">
                      {delivery.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-900">
                            {item.name} x{item.quantity}
                            {item.special && (
                              <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full">
                                Special
                              </span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Instructions */}
              {delivery.specialInstructions && (
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Special Instructions
                  </h4>
                  <p className="text-gray-800">{delivery.specialInstructions}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                {getNextAction(delivery.status) && (
                  <button
                    onClick={() => updateDeliveryStatus(delivery.id, getNextAction(delivery.status).action)}
                    className={`${getNextAction(delivery.status).color} hover:opacity-90 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center`}
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {getNextAction(delivery.status).label}
                  </button>
                )}

                {delivery.status === 'ARRIVED' && (
                  <button
                    onClick={() => setShowConfirmation(prev => ({ ...prev, [delivery.id]: true }))}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Confirm Delivery
                  </button>
                )}

                <div className="flex space-x-3">
                  <button className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-lg transition duration-200">
                    View on Map
                  </button>
                  <button className="border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold py-3 px-6 rounded-lg transition duration-200">
                    Call Customer
                  </button>
                </div>
              </div>

              {/* Delivery Confirmation Component */}
              <DeliveryConfirmationCode
                deliveryId={delivery.id}
                isVisible={showConfirmation[delivery.id] || false}
                onConfirmDelivery={(confirmationData) => handleDeliveryConfirmation(delivery.id, confirmationData)}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CurrentDeliveries;
