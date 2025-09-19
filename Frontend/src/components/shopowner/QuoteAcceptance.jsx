import React, { useState, useEffect } from 'react';

const QuoteAcceptance = () => {
  const [quotes, setQuotes] = useState([]);
  const [orderData, setOrderData] = useState(null);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sortBy, setSortBy] = useState('price');

  useEffect(() => {
    loadOrderAndQuotes();
  }, []);

  const loadOrderAndQuotes = () => {
    const savedOrder = JSON.parse(localStorage.getItem('aqualink_order_data') || 'null');
    const savedQuotes = JSON.parse(localStorage.getItem('aqualink_received_quotes') || 'null');
    
    if (!savedOrder || !savedQuotes) {
      alert('No quotes found. Please start from cart.');
      window.location.href = '/cart';
      return;
    }

    if (savedOrder.sessionId !== savedQuotes.sessionId) {
      alert('Session mismatch. Please start over.');
      window.location.href = '/cart';
      return;
    }

    // ADD delivery date to each quote in mock data
    const quotesWithDeliveryDate = savedQuotes.quotes.map(quote => ({
      ...quote,
      deliveryDate: getRandomDeliveryDate() // Add delivery date to existing quotes
    }));

    setOrderData(savedOrder);
    setQuotes(quotesWithDeliveryDate);
    setLoading(false);
  };

  // Helper function to generate random delivery dates (1-3 days from today)
  const getRandomDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * 3) + 1);
    return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  };

  // Helper function to format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return `Rs.${parseFloat(price).toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const getQuoteStatus = (quote) => {
    const now = new Date();
    const expiry = new Date(quote.quoteValidUntil);
    
    if (now > expiry) {
      return { status: 'expired', text: 'Quote Expired', color: 'text-red-600' };
    }

    const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    const hoursUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60));
    
    if (daysUntilExpiry < 1) {
      return { 
        status: 'expiring_soon', 
        text: `Expires in ${hoursUntilExpiry}h`, 
        color: 'text-orange-600' 
      };
    }
    
    return { 
      status: 'valid', 
      text: `Valid for ${daysUntilExpiry} more day(s)`, 
      color: 'text-green-600' 
    };
  };

  const getSortedQuotes = () => {
    const validQuotes = quotes.filter(quote => {
      const status = getQuoteStatus(quote);
      return status.status === 'valid' || status.status === 'expiring_soon';
    });

    return [...validQuotes].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.deliveryFee - b.deliveryFee;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
  };

  const placeOrder = async () => {
    if (!selectedQuote) {
      alert('Please select a delivery quote first');
      return;
    }

    const quote = quotes.find(q => q.id === selectedQuote);
    const status = getQuoteStatus(quote);
    
    if (status.status === 'expired') {
      alert('Selected quote is no longer valid. Please choose another quote.');
      setSelectedQuote(null);
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate order placement API call
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Create order object
      const finalOrder = {
        orderId: 'ORD' + Date.now(),
        sessionId: orderData.sessionId,
        items: orderData.items,
        subtotal: orderData.subtotal,
        deliveryFee: quote.deliveryFee,
        totalAmount: orderData.subtotal + quote.deliveryFee,
        paymentMethod: paymentMethod,
        deliveryPartner: {
          name: quote.deliveryPersonName,
          rating: quote.rating,
          completedDeliveries: quote.completedDeliveries
        },
        deliveryDate: quote.deliveryDate, // Use quote's delivery date instead of preferences
        orderDate: new Date().toISOString(),
        status: 'CONFIRMED'
      };

      // Store order in localStorage (in real app, this would be sent to server)
      const existingOrders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
      existingOrders.push(finalOrder);
      localStorage.setItem('customerOrders', JSON.stringify(existingOrders));

      // Clear cart and quote data
      localStorage.removeItem('selected_delivery_quote');
      localStorage.removeItem('aqualink_order_data');
      localStorage.removeItem('aqualink_received_quotes');

      alert(`Order placed successfully! Order ID: ${finalOrder.orderId}`);
      
      // Redirect to order confirmation
      window.location.href = `/order-confirmation/${finalOrder.orderId}`;

    } catch (error) {
      alert('Failed to place order. Please try again.');
      console.error('Order placement error:', error);
    } finally {
      setIsProcessing(false);
    }
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

  const sortedQuotes = getSortedQuotes();
  const expiredQuotes = quotes.filter(quote => {
    const status = getQuoteStatus(quote);
    return status.status === 'expired';
  });

  const selectedQuoteData = selectedQuote ? quotes.find(q => q.id === selectedQuote) : null;
  const totalAmount = selectedQuoteData ? orderData.subtotal + selectedQuoteData.deliveryFee : orderData.subtotal;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Quote & Complete Order</h1>
          <p className="text-gray-600">Choose your delivery partner and payment method to place your order</p>
        </div>

        {/* REMOVED: Order Information section with delivery date display */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quotes Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sorting Controls */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Available Quotes ({sortedQuotes.length})
                </h2>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="price">Price (Low to High)</option>
                    <option value="rating">Rating (High to Low)</option>
                  </select>
                </div>
              </div>
              
              {expiredQuotes.length > 0 && (
                <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-orange-800 text-sm">
                    ⚠️ {expiredQuotes.length} quote(s) have expired and are not shown
                  </p>
                </div>
              )}
            </div>

            {/* Quotes Display */}
            {sortedQuotes.length === 0 ? (
              <div className="bg-white p-12 rounded-lg shadow-sm text-center">
                <div className="text-6xl mb-4">😔</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Valid Quotes Available</h3>
                <p className="text-gray-600 mb-6">
                  All quotes have expired or are no longer valid for your delivery date.
                </p>
                <div className="space-x-4">
                  <button 
                    onClick={() => window.location.href = '/delivery-request'}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                  >
                    Request New Quotes
                  </button>
                  <button 
                    onClick={() => window.location.href = '/cart'}
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
                  >
                    Back to Cart
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedQuotes.map((quote, index) => {
                  const status = getQuoteStatus(quote);
                  const isSelected = selectedQuote === quote.id;
                  const isValid = status.status === 'valid' || status.status === 'expiring_soon';

                  return (
                    <div 
                      key={quote.id}
                      className={`bg-white border-2 rounded-lg p-6 cursor-pointer transition-all ${
                        isSelected && isValid
                          ? 'border-blue-500 bg-blue-50 shadow-md' 
                          : !isValid
                            ? 'border-red-200 bg-red-50 cursor-not-allowed opacity-60'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                      onClick={() => isValid && setSelectedQuote(quote.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center mb-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                              isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                            }`}>
                              {isSelected && (
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <h3 className="font-bold text-xl text-gray-900">{quote.deliveryPersonName}</h3>
                          </div>

                          <div className="grid grid-cols-2 gap-4 ml-9">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Rating:</span>
                              <div className="flex items-center">
                                <span className="text-yellow-500 mr-1">⭐</span>
                                <span className="font-semibold">{quote.rating}</span>
                              </div>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-gray-600">Total Deliveries:</span>
                              <span className="font-semibold">{quote.completedDeliveries}</span>
                            </div>

                            {/* ADDED: Delivery Date Display */}
                            <div className="flex justify-between">
                              <span className="text-gray-600">Delivery Date:</span>
                              <span className="font-semibold text-green-700">{formatDate(quote.deliveryDate)}</span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-gray-600">Quote Status:</span>
                              <span className={`font-semibold ${status.color}`}>{status.text}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right ml-6">
                          <div className="text-2xl font-bold text-gray-900">{formatPrice(quote.deliveryFee)}</div>
                          <div className="text-sm text-gray-600">Delivery Fee</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Payment Method Section */}
            {selectedQuote && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={paymentMethod === 'Cash on Delivery'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-blue-600"
                    />
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">💵</span>
                      <div>
                        <div className="font-semibold">Cash on Delivery</div>
                        <div className="text-sm text-gray-600">Pay when the order is delivered</div>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Bank Transfer"
                      checked={paymentMethod === 'Bank Transfer'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-blue-600"
                    />
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🏦</span>
                      <div>
                        <div className="font-semibold">Bank Transfer</div>
                        <div className="text-sm text-gray-600">Pay in advance via bank transfer</div>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Mobile Payment"
                      checked={paymentMethod === 'Mobile Payment'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-blue-600"
                    />
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">📱</span>
                      <div>
                        <div className="font-semibold">Mobile Payment</div>
                        <div className="text-sm text-gray-600">Pay via mobile banking or digital wallet</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              {/* Items */}
              <div className="space-y-3 mb-4">
                {orderData?.items?.map((item, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-600">Qty: {item.quantity} × {formatPrice(item.price)}</div>
                    </div>
                    <div className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">{formatPrice(orderData?.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee:</span>
                  <span className="font-semibold">
                    {selectedQuoteData ? formatPrice(selectedQuoteData.deliveryFee) : 'Select quote'}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              {/* Selected Payment Method Display */}
              {selectedQuote && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="text-blue-800 text-sm font-medium">Payment Method:</div>
                  <div className="text-blue-900 font-semibold">{paymentMethod}</div>
                </div>
              )}

              {/* Place Order Button */}
              <button 
                onClick={placeOrder}
                disabled={!selectedQuote || isProcessing}
                className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing Order...
                  </div>
                ) : selectedQuote ? (
                  `Place Order - ${formatPrice(totalAmount)}`
                ) : (
                  'Select Quote to Continue'
                )}
              </button>

              {!selectedQuote && (
                <p className="text-orange-600 text-sm text-center mt-2 font-medium">
                  Please select a delivery quote first
                </p>
              )}

              <p className="text-xs text-gray-600 text-center mt-3">
                By placing this order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteAcceptance;
