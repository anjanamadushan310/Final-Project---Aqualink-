import React, { useState, useEffect } from 'react';

const QuoteAcceptance = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [orderData, setOrderData] = useState(null);

  // Mock quotes data
  const mockQuotes = [
    {
      id: 1,
      deliveryPersonName: 'Saman Express',
      deliveryPersonPhone: '0771234567',
      deliveryFee: 1200,
      estimatedDeliveryTime: '45 minutes',
      rating: 4.8,
      completedDeliveries: 245,
      specialOffers: 'Free packaging for live fish',
      quoteValidUntil: '2025-09-06T22:00:00',
      notes: 'Experienced with aquarium equipment delivery'
    },
    {
      id: 2,
      deliveryPersonName: 'Quick Delivery Service',
      deliveryPersonPhone: '0779876543',
      deliveryFee: 1500,
      estimatedDeliveryTime: '35 minutes',
      rating: 4.6,
      completedDeliveries: 189,
      specialOffers: 'Same-day delivery guarantee',
      quoteValidUntil: '2025-09-06T21:30:00',
      notes: 'Express service available'
    },
    {
      id: 3,
      deliveryPersonName: 'Express Logistics',
      deliveryPersonPhone: '0765432109',
      deliveryFee: 900,
      estimatedDeliveryTime: '60 minutes',
      rating: 4.7,
      completedDeliveries: 198,
      specialOffers: 'Cheapest rate in area',
      quoteValidUntil: '2025-09-06T23:00:00',
      notes: 'Budget-friendly option'
    }
  ];

  // Mock order data
  const mockOrderData = {
    items: [
      { name: 'Gold Fish', quantity: 5, price: 500, total: 2500 },
      { name: 'Aquarium Filter', quantity: 1, price: 3500, total: 3500 }
    ],
    subtotal: 6000,
    deliveryAddress: '123 Main Street, Dehiwala',
    customerPhone: '0771111111'
  };

  useEffect(() => {
    setTimeout(() => {
      setQuotes(mockQuotes.sort((a, b) => a.deliveryFee - b.deliveryFee)); // Sort by price
      setOrderData(mockOrderData);
      setLoading(false);
    }, 1000);
  }, []);

  const formatPrice = (price) => {
    return `Rs.${parseFloat(price).toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getQuoteValidityStatus = (validUntil) => {
    const now = new Date();
    const expiry = new Date(validUntil);
    const diffMinutes = Math.floor((expiry - now) / (1000 * 60));
    
    if (diffMinutes <= 0) return { status: 'expired', text: 'Expired', color: 'text-red-600' };
    if (diffMinutes <= 15) return { status: 'expiring', text: `Expires in ${diffMinutes}m`, color: 'text-orange-600' };
    return { status: 'valid', text: `Valid for ${diffMinutes}m`, color: 'text-green-600' };
  };

  const acceptQuote = () => {
    if (!selectedQuote) return;
    
    const quote = quotes.find(q => q.id === selectedQuote);
    
    // Store selected quote data
    localStorage.setItem('selectedQuote', JSON.stringify({
      ...quote,
      orderData: orderData
    }));
    
    // Redirect to checkout
    window.location.href = '/checkout';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quotes from delivery partners...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Delivery Quotes</h1>
          <p className="text-gray-600">Compare quotes and select the best delivery option</p>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Items:</h3>
              {orderData?.items.map((item, index) => (
                <div key={index} className="flex justify-between py-1">
                  <span className="text-gray-600">{item.name} x {item.quantity}</span>
                  <span className="font-semibold">{formatPrice(item.total)}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Subtotal:</span>
                  <span className="text-blue-600">{formatPrice(orderData?.subtotal)}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Delivery To:</h3>
              <p className="text-gray-600 mb-1">📍 {orderData?.deliveryAddress}</p>
              <p className="text-gray-600">📞 {orderData?.customerPhone}</p>
            </div>
          </div>
        </div>

        {/* Quotes Comparison */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Available Quotes ({quotes.length})</h2>
            <p className="text-sm text-gray-600">Sorted by price (lowest first)</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {quotes.map(quote => {
              const validity = getQuoteValidityStatus(quote.quoteValidUntil);
              const isSelected = selectedQuote === quote.id;
              const isExpired = validity.status === 'expired';

              return (
                <div 
                  key={quote.id}
                  className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : isExpired 
                        ? 'border-red-200 bg-red-50 cursor-not-allowed opacity-60'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                  onClick={() => !isExpired && setSelectedQuote(quote.id)}
                >
                  {/* Quote Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{quote.deliveryPersonName}</h3>
                      <p className="text-gray-600 text-sm">{quote.deliveryPersonPhone}</p>
                    </div>
                    <div className={`text-right ${isSelected ? 'text-blue-600' : 'text-gray-900'}`}>
                      <div className="text-2xl font-bold">{formatPrice(quote.deliveryFee)}</div>
                      <div className="text-sm text-gray-600">Delivery Fee</div>
                    </div>
                  </div>

                  {/* Quote Details */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Delivery Time:</span>
                      <span className="font-semibold text-gray-900">{quote.estimatedDeliveryTime}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">⭐</span>
                        <span className="font-semibold">{quote.rating}</span>
                        <span className="text-gray-600 text-sm ml-1">({quote.completedDeliveries})</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Valid Until:</span>
                      <span className={`font-semibold text-sm ${validity.color}`}>
                        {validity.text}
                      </span>
                    </div>
                  </div>

                  {/* Special Offers */}
                  {quote.specialOffers && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="text-green-800 text-sm font-semibold">🎉 Special Offer:</div>
                      <div className="text-green-700 text-sm">{quote.specialOffers}</div>
                    </div>
                  )}

                  {/* Notes */}
                  {quote.notes && (
                    <div className="mt-3 text-gray-600 text-sm">
                      💬 {quote.notes}
                    </div>
                  )}

                  {/* Total Cost Preview */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Cost:</span>
                      <span className={isSelected ? 'text-blue-600' : 'text-gray-900'}>
                        {formatPrice(orderData?.subtotal + quote.deliveryFee)}
                      </span>
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="mt-4 flex items-center justify-center text-blue-600">
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-semibold">Selected</span>
                    </div>
                  )}

                  {isExpired && (
                    <div className="mt-4 flex items-center justify-center text-red-600">
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-semibold">Quote Expired</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Accept Quote Button */}
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <button 
            onClick={acceptQuote}
            disabled={!selectedQuote}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {selectedQuote ? 'Accept Quote & Continue to Checkout' : 'Please Select a Quote'}
          </button>
          <p className="text-gray-600 text-sm mt-3">
            {selectedQuote 
              ? 'Proceed with the selected delivery option'
              : 'Choose the best quote from available options'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuoteAcceptance;
