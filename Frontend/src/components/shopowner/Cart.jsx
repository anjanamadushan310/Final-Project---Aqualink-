import React, { useState } from 'react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Gold Fish', price: 500, quantity: 5 },
    { id: 2, name: 'Aquarium Filter', price: 3500, quantity: 1 }
  ]);
  
  const [orderPreferences, setOrderPreferences] = useState({
    quotesExpireAfter: 1 // Default to 1 hour
  });

  const [isRequestingSent, setIsRequestingSent] = useState(false);

  const formatPrice = (price) => {
    return `Rs.${parseFloat(price).toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(id);
      return;
    }
    setCartItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handlePreferenceChange = (field, value) => {
    setOrderPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const requestDeliveryQuotes = () => {
    if (cartItems.length === 0) {
      alert('Cart is empty!');
      return;
    }

    setIsRequestingSent(true);

    const quoteExpiryDate = new Date();
    // Calculating expiry by hours
    quoteExpiryDate.setHours(quoteExpiryDate.getHours() + orderPreferences.quotesExpireAfter);

    const orderData = {
      sessionId: 'SESSION_' + Date.now(),
      items: cartItems,
      subtotal: getTotalAmount(),
      preferences: {
        ...orderPreferences,
        quotesExpireOn: quoteExpiryDate.toISOString()
      },
      createdAt: new Date().toISOString(),
      status: 'REQUESTING_QUOTES'
    };

    localStorage.setItem('aqualink_order_data', JSON.stringify(orderData));

    setTimeout(() => {
      alert('Quote request prepared successfully!');
      window.location.href = '/delivery-request';
    }, 1500);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">Review your items and request delivery quotes</p>
        </div>

        {/* Cart Items */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Cart Items ({cartItems.length})</h2>
            
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600">Add some items to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                      <p className="text-gray-600">{formatPrice(item.price)} each</p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 font-semibold"
                        >
                          -
                        </button>
                        <span className="font-semibold text-lg w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 font-semibold"
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="text-right min-w-0">
                        <div className="font-bold text-lg">{formatPrice(item.price * item.quantity)}</div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cart Summary */}
        {cartItems.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Subtotal ({cartItems.length} items):</span>
                  <span className="font-semibold">{formatPrice(getTotalAmount())}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery fee:</span>
                  <span>To be determined by quotes</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Current Total:</span>
                    <span className="text-blue-600">{formatPrice(getTotalAmount())}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">+ delivery fee (will be added after quote selection)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quote Response Time Preference Section */}
        {cartItems.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quote Request Settings</h2>
              
              <div className="max-w-md">
                {/* Quote Expiry Preference */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How long should delivery partners have to respond?
                  </label>
                  <select
                    value={orderPreferences.quotesExpireAfter}
                    onChange={(e) => handlePreferenceChange('quotesExpireAfter', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  >
                    <option value={1}>1 Hour</option>
                    <option value={2}>2 Hours</option>
                    <option value={3}>3 Hours</option>
                    <option value={4}>4 Hours</option>
                    <option value={5}>5 Hours</option>
                    <option value={6}>6 Hours</option>
                    <option value={7}>7 Hours</option>
                    <option value={8}>8 Hours</option>
                    <option value={9}>9 Hours</option>
                    <option value={10}>10 Hours</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Delivery partners will have this much time to send quotes
                  </p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Quote Request Summary:</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <div>📦 Items: {cartItems.length} item{cartItems.length > 1 ? 's' : ''}</div>
                  <div>💰 Subtotal: {formatPrice(getTotalAmount())}</div>
                  <div>⏰ Quote Response Time: {orderPreferences.quotesExpireAfter} hour{orderPreferences.quotesExpireAfter > 1 ? 's' : ''}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Request Quotes Button */}
        {cartItems.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 text-center">
              <button 
                onClick={requestDeliveryQuotes}
                disabled={isRequestingSent}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
              >
                {isRequestingSent ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Preparing Request...
                  </>
                ) : (
                  'Request Delivery Quotes'
                )}
              </button>
              <p className="text-gray-600 text-sm mt-3">
                Get quotes from multiple delivery partners and choose the best option
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
