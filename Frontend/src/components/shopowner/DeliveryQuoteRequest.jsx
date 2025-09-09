import React, { useState, useEffect } from 'react';

const EnhancedDeliveryRequest = () => {
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [selectedPersons, setSelectedPersons] = useState([]);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const mockDeliveryPersons = [
    {
      id: 1,
      name: 'Saman Express',
      rating: 4.8,
      completedDeliveries: 245,
      isAvailable: true
    },
    {
      id: 2,
      name: 'Quick Delivery Service',
      rating: 4.6,
      completedDeliveries: 189,
      isAvailable: true
    },
    {
      id: 3,
      name: 'Fast Track Delivery',
      rating: 4.9,
      completedDeliveries: 321,
      isAvailable: false
    },
    {
      id: 4,
      name: 'Express Logistics',
      rating: 4.7,
      completedDeliveries: 198,
      isAvailable: true
    },
    {
      id: 5,
      name: 'Premium Delivery Co',
      rating: 4.9,
      completedDeliveries: 156,
      isAvailable: true
    }
  ];

  useEffect(() => {
    const savedOrder = JSON.parse(localStorage.getItem('aqualink_order_data') || 'null');
    
    if (!savedOrder || savedOrder.status !== 'REQUESTING_QUOTES') {
      alert('No order data found. Please start from cart.');
      window.location.href = '/cart';
      return;
    }

    setOrderData(savedOrder);
    setTimeout(() => {
      setDeliveryPersons(mockDeliveryPersons);
      setLoading(false);
    }, 1000);
  }, []);

  const togglePersonSelection = (personId) => {
    setSelectedPersons(prev => 
      prev.includes(personId) 
        ? prev.filter(id => id !== personId)
        : [...prev, personId]
    );
  };

  const selectAll = () => {
    const availablePersons = deliveryPersons.filter(person => person.isAvailable).map(person => person.id);
    setSelectedPersons(availablePersons);
  };

  const clearSelection = () => {
    setSelectedPersons([]);
  };

  const sendQuoteRequests = async () => {
    if (selectedPersons.length === 0) {
      alert('Please select at least one delivery partner');
      return;
    }

    setSending(true);

    const requestData = {
      ...orderData,
      selectedDeliveryPersons: selectedPersons,
      requestSentAt: new Date().toISOString(),
      status: 'QUOTES_REQUESTED'
    };

    localStorage.setItem('aqualink_order_data', JSON.stringify(requestData));

    // Simulate sending requests and generate quotes
    setTimeout(() => {
      const quotes = generateQuotesFromSelectedPersons(selectedPersons, orderData);
      localStorage.setItem('aqualink_received_quotes', JSON.stringify({
        sessionId: orderData.sessionId,
        quotes: quotes,
        receivedAt: new Date().toISOString()
      }));

      setSending(false);
      alert(`Quote requests sent to ${selectedPersons.length} delivery partners!`);
      window.location.href = '/quote-acceptance';
    }, 2500);
  };

  const generateQuotesFromSelectedPersons = (selectedIds, orderData) => {
    const selectedPersons = deliveryPersons.filter(person => selectedIds.includes(person.id));
    
    return selectedPersons.map(person => {
      const preferences = orderData.preferences;
      
      // Base delivery fee calculation
      let baseFee = 800 + Math.floor(Math.random() * 400); // 800-1200 base
      
      // Adjust based on person's rating (higher rating = higher fee)
      baseFee += Math.floor(person.rating * 100);

      return {
        id: `Q${person.id.toString().padStart(3, '0')}`,
        deliveryPersonId: person.id,
        deliveryPersonName: person.name,
        deliveryPersonPhone: `077${Math.floor(1000000 + Math.random() * 9000000)}`,
        deliveryFee: baseFee,
        estimatedDeliveryTime: '45-90 minutes',
        rating: person.rating,
        completedDeliveries: person.completedDeliveries,
        specialOffers: getSpecialOffer(person),
        quoteValidUntil: preferences.quotesExpireOn,
        canDeliverOn: preferences.preferredDeliveryDate,
        notes: `Professional delivery service provider`,
        coverageArea: 'Western Province'
      };
    });
  };

  const getSpecialOffer = (person) => {
    const offers = [
      'Best price guarantee - will match any lower quote',
      'Express handling - priority delivery',
      'Free specialized packaging for live fish',
      'White glove service - careful handling guaranteed',
      'Reliable delivery service'
    ];
    return offers[Math.floor(Math.random() * offers.length)];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading delivery partners...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Request Delivery Quotes</h1>
          <p className="text-gray-600">Select delivery partners to send quote requests for your order</p>
        </div>

        {/* Order Information Display */}
        {orderData?.preferences && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
            <h2 className="text-lg font-bold text-blue-900 mb-3">Order Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white p-4 rounded-lg">
                <div className="text-blue-600 font-semibold mb-1">📅 Delivery Date</div>
                <div className="text-gray-900 text-lg font-semibold">
                  {new Date(orderData.preferences.preferredDeliveryDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric', 
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <div className="text-blue-600 font-semibold mb-1">⏰ Quote Response Time</div>
                <div className="text-gray-900 text-lg font-semibold">
                  {orderData.preferences.quotesExpireAfter} day{orderData.preferences.quotesExpireAfter > 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Details</h2>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Items:</h3>
            <div className="space-y-2">
              {orderData?.items.map((item, index) => (
                <div key={index} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-700">{item.name} x {item.quantity}</span>
                  <span className="font-semibold text-gray-900">Rs.{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="font-bold text-lg">Subtotal:</span>
                <span className="font-bold text-lg text-blue-600">Rs.{orderData?.subtotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selection Controls */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Available Delivery Partners ({deliveryPersons.filter(p => p.isAvailable).length})
            </h2>
            <div className="space-x-3">
              <button 
                onClick={selectAll}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                Select All Available
              </button>
              <button 
                onClick={clearSelection}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Selected: <span className="font-semibold">{selectedPersons.length}</span> delivery partners
            </p>
            <p className="text-xs text-gray-500">
              They will receive your quote request and respond within your specified timeframe
            </p>
          </div>
        </div>

        {/* Delivery Partners List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deliveryPersons.map(person => (
            <div 
              key={person.id} 
              className={`bg-white rounded-lg shadow-sm border-2 transition-all cursor-pointer ${
                selectedPersons.includes(person.id) 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : person.isAvailable 
                    ? 'border-gray-200 hover:border-gray-300 hover:shadow-md' 
                    : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
              }`}
              onClick={() => person.isAvailable && togglePersonSelection(person.id)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{person.name}</h3>
                    </div>
                  </div>
                  
                  {person.isAvailable ? (
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                      selectedPersons.includes(person.id) 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'border-gray-300 hover:border-blue-300'
                    }`}>
                      {selectedPersons.includes(person.id) && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  ) : (
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm font-medium">Unavailable</span>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">⭐</span>
                      <span className="font-semibold text-lg">{person.rating}</span>
                    </div>
                    <div className="text-gray-600 text-sm">
                      {person.completedDeliveries} deliveries
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Send Requests Button */}
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <button 
            onClick={sendQuoteRequests}
            disabled={selectedPersons.length === 0 || sending}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {sending ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Sending Requests to {selectedPersons.length} Partners...
              </div>
            ) : (
              `Send Quote Requests to ${selectedPersons.length} Partners`
            )}
          </button>
          <p className="text-gray-600 text-sm mt-3">
            {selectedPersons.length === 0 
              ? 'Please select delivery partners to send quote requests'
              : `Quote requests will be sent to ${selectedPersons.length} delivery partners`
            }
          </p>
          
          {selectedPersons.length > 0 && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-green-800 text-sm font-medium">
                📋 Selected Partners: {deliveryPersons
                  .filter(p => selectedPersons.includes(p.id))
                  .map(p => p.name)
                  .join(', ')
                }
              </div>
              <div className="text-green-700 text-xs mt-1">
                They will have {orderData?.preferences.quotesExpireAfter} day{orderData?.preferences.quotesExpireAfter > 1 ? 's' : ''} to respond with quotes
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedDeliveryRequest;
