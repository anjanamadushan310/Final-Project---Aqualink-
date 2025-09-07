import React, { useState, useEffect } from 'react';

const DeliveryQuoteRequest = () => {
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [selectedPersons, setSelectedPersons] = useState([]);
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Mock delivery persons data
  const mockDeliveryPersons = [
    {
      id: 1,
      name: 'Saman Express',
      phone: '0771234567',
      rating: 4.8,
      completedDeliveries: 245,
      averageDeliveryTime: '45 min',
      coverageArea: 'Colombo, Dehiwala, Mount Lavinia',
      isAvailable: true
    },
    {
      id: 2,
      name: 'Quick Delivery Service',
      phone: '0779876543',
      rating: 4.6,
      completedDeliveries: 189,
      averageDeliveryTime: '35 min',
      coverageArea: 'Colombo, Negombo, Gampaha',
      isAvailable: true
    },
    {
      id: 3,
      name: 'Fast Track Delivery',
      phone: '0712345678',
      rating: 4.9,
      completedDeliveries: 321,
      averageDeliveryTime: '40 min',
      coverageArea: 'Colombo, Kandy, Kurunegala',
      isAvailable: false
    },
    {
      id: 4,
      name: 'Express Logistics',
      phone: '0765432109',
      rating: 4.7,
      completedDeliveries: 198,
      averageDeliveryTime: '50 min',
      coverageArea: 'All Western Province',
      isAvailable: true
    }
  ];

  // Mock cart data
  const mockCartData = {
    items: [
      { name: 'Gold Fish', quantity: 5, price: 500 },
      { name: 'Aquarium Filter', quantity: 1, price: 3500 }
    ],
    total: 6000,
    deliveryAddress: '123 Main Street, Dehiwala',
    customerPhone: '0771111111',
    specialInstructions: 'Handle live fish carefully'
  };

  useEffect(() => {
    setTimeout(() => {
      setDeliveryPersons(mockDeliveryPersons);
      setCartData(mockCartData);
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

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`Quote requests sent to ${selectedPersons.length} delivery partners!`);
      
      // Redirect to quote acceptance page
      window.location.href = '/quote-acceptance';
    } catch (error) {
      alert('Failed to send requests. Please try again.');
    } finally {
      setSending(false);
    }
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
          <p className="text-gray-600">Select delivery partners to send quote requests</p>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Items:</h3>
              <ul className="space-y-1">
                {cartData?.items.map((item, index) => (
                  <li key={index} className="text-gray-600">
                    {item.name} x {item.quantity} - Rs.{(item.price * item.quantity).toLocaleString()}
                  </li>
                ))}
              </ul>
              <div className="mt-2 pt-2 border-t">
                <p className="font-semibold">Total: Rs.{cartData?.total.toLocaleString()}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Delivery Details:</h3>
              <p className="text-gray-600 mb-1">📍 {cartData?.deliveryAddress}</p>
              <p className="text-gray-600 mb-1">📞 {cartData?.customerPhone}</p>
              <p className="text-gray-600">📝 {cartData?.specialInstructions}</p>
            </div>
          </div>
        </div>

        {/* Selection Controls */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Available Delivery Partners ({deliveryPersons.filter(p => p.isAvailable).length})</h2>
            <div className="space-x-3">
              <button 
                onClick={selectAll}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
              >
                Select All Available
              </button>
              <button 
                onClick={clearSelection}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Clear Selection
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Selected: {selectedPersons.length} delivery partners
          </p>
        </div>

        {/* Delivery Partners List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deliveryPersons.map(person => (
            <div 
              key={person.id} 
              className={`bg-white rounded-lg shadow-sm border-2 transition-all cursor-pointer ${
                selectedPersons.includes(person.id) 
                  ? 'border-blue-500 bg-blue-50' 
                  : person.isAvailable 
                    ? 'border-gray-200 hover:border-gray-300' 
                    : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
              }`}
              onClick={() => person.isAvailable && togglePersonSelection(person.id)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{person.name}</h3>
                      <p className="text-gray-600 text-sm">{person.phone}</p>
                    </div>
                  </div>
                  
                  {person.isAvailable ? (
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                      selectedPersons.includes(person.id) 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {selectedPersons.includes(person.id) && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  ) : (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">Unavailable</span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">⭐</span>
                      <span className="font-semibold">{person.rating}</span>
                    </div>
                    <div className="text-gray-600 text-sm">
                      {person.completedDeliveries} deliveries
                    </div>
                  </div>
                  
                  <div className="text-gray-600 text-sm">
                    ⏱️ Avg delivery: {person.averageDeliveryTime}
                  </div>
                  
                  <div className="text-gray-600 text-sm">
                    📍 Coverage: {person.coverageArea}
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
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Sending Requests...
              </div>
            ) : (
              `Send Quote Requests (${selectedPersons.length})`
            )}
          </button>
          <p className="text-gray-600 text-sm mt-3">
            Quote requests will be sent to selected delivery partners
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryQuoteRequest;
