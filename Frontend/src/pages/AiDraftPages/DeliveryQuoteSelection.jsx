import React, { useState, useEffect } from 'react';

const DeliveryQuoteSelection = ({ orderId }) => {
  const [quotes, setQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock delivery quotes from different delivery persons
  const mockQuotes = [
    {
      id: 1,
      deliveryPersonName: 'Kamal Perera',
      deliveryPersonPhoto: '/api/placeholder/50/50',
      rating: 4.8,
      totalDeliveries: 245,
      quotedPrice: 1200,
      estimatedTime: '2-3 hours',
      validUntil: '2025-09-04T18:00:00',
      priceBreakdown: 'Base delivery: Rs.500\nDistance (15km): Rs.750\nTotal: Rs.1200',
      specialNotes: 'Experienced with live fish delivery. Temperature controlled transport available.',
      responseTime: '2025-09-03T10:30:00',
      phone: '0771234567'
    },
    {
      id: 2,
      deliveryPersonName: 'Saman Fernando',
      deliveryPersonPhoto: '/api/placeholder/50/50',
      rating: 4.6,
      totalDeliveries: 189,
      quotedPrice: 1500,
      estimatedTime: '1-2 hours',
      validUntil: '2025-09-04T20:00:00',
      priceBreakdown: 'Base delivery: Rs.600\nDistance (15km): Rs.750\nExpress service: Rs.150\nTotal: Rs.1500',
      specialNotes: 'Express delivery service. Specialized fish transport containers.',
      responseTime: '2025-09-03T10:45:00',
      phone: '0779876543'
    },
    {
      id: 3,
      deliveryPersonName: 'Nimal Silva',
      deliveryPersonPhoto: '/api/placeholder/50/50',
      rating: 4.9,
      totalDeliveries: 312,
      quotedPrice: 1000,
      estimatedTime: '3-4 hours',
      validUntil: '2025-09-04T16:00:00',
      priceBreakdown: 'Base delivery: Rs.500\nDistance (15km): Rs.500\nTotal: Rs.1000',
      specialNotes: 'Affordable standard delivery. Good experience with aquarium supplies.',
      responseTime: '2025-09-03T11:00:00',
      phone: '0712345678'
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setQuotes(mockQuotes);
      setLoading(false);
    }, 1500);
  }, []);

  const formatPrice = (price) => {
    return `Rs.${parseFloat(price).toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <svg
        key={index}
        className={`h-4 w-4 ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const handleAcceptQuote = async (quote) => {
    setSelectedQuote(quote);
    try {
      // Accept the selected quote
      await acceptDeliveryQuote(orderId, quote.id);
      
      // Show success message and redirect to tracking
      alert(`Quote accepted! ${quote.deliveryPersonName} will deliver your order.`);
      
    } catch (error) {
      console.error('Failed to accept quote:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900">Finding Available Delivery Partners...</h3>
          <p className="text-gray-600 mt-2">We're getting quotes from delivery persons in your area</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Delivery Partner</h2>
        <p className="text-gray-600">Select the best delivery option for your fish order</p>
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-blue-800 text-sm">
              <strong>Order #{orderId}</strong> - Choose your preferred delivery partner from the options below
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {quotes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Delivery Partners Available</h3>
            <p className="text-gray-600">Sorry, no delivery partners are available in your area right now. Please try again later.</p>
          </div>
        ) : (
          quotes.map(quote => (
            <div key={quote.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition duration-200">
              {/* Quote Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={quote.deliveryPersonPhoto}
                    alt={quote.deliveryPersonName}
                    className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{quote.deliveryPersonName}</h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex">{renderStars(quote.rating)}</div>
                      <span className="text-sm text-gray-600">({quote.rating}/5)</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-600">{quote.totalDeliveries} deliveries</span>
                    </div>
                    <a href={`tel:${quote.phone}`} className="text-sm text-blue-600 hover:text-blue-800">
                      {quote.phone}
                    </a>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{formatPrice(quote.quotedPrice)}</div>
                  <div className="text-sm text-gray-600">Delivery Fee</div>
                  <div className="text-sm text-gray-500 mt-1">ETA: {quote.estimatedTime}</div>
                </div>
              </div>

              {/* Quote Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Price Breakdown</h4>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-medium">
                      {quote.priceBreakdown}
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Delivery Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Time:</span>
                      <span className="font-medium">{quote.estimatedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quote Valid Until:</span>
                      <span className="font-medium">{formatTime(quote.validUntil)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Response Time:</span>
                      <span className="font-medium">{formatTime(quote.responseTime)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Notes */}
              {quote.specialNotes && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Delivery Notes
                  </h4>
                  <p className="text-gray-800 text-sm">{quote.specialNotes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => handleAcceptQuote(quote)}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Accept This Quote
                </button>

                <button className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Message Driver
                </button>

                <button className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-4 rounded-lg transition duration-200">
                  View Profile
                </button>
              </div>

              {/* Urgency Indicator */}
              {new Date(quote.validUntil) - new Date() < 2 * 60 * 60 * 1000 && (
                <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <svg className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-orange-800 text-sm font-medium">
                      ⚡ Limited Time: This quote expires soon!
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Help Section */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help Choosing?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <span><strong>Lowest Price:</strong> Best value option</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span><strong>Fastest Delivery:</strong> Quick service</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span><strong>Highest Rating:</strong> Best customer reviews</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryQuoteSelection;
