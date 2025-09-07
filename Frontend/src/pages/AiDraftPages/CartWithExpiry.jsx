import React, { useState, useEffect } from 'react';

const CartWithExpiry = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Gold Fish', price: 500, quantity: 5, image: '/fish1.jpg' },
    { id: 2, name: 'Aquarium Filter', price: 3500, quantity: 1, image: '/filter.jpg' }
  ]);
  const [expiryTime, setExpiryTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRequestingSent, setIsRequestingSent] = useState(false);

  // Timer Effect
  useEffect(() => {
    if (!expiryTime) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(expiryTime).getTime();
      const difference = expiry - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
        setCartItems([]);
        setExpiryTime(null);
        alert('Cart expired! Items have been removed.');
      } else {
        setTimeLeft(Math.floor(difference / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryTime]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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

  const requestDeliveryQuotes = () => {
    if (cartItems.length === 0) {
      alert('Cart is empty!');
      return;
    }

    // Set expiry time - 1 hour from now
    const expiryDate = new Date(Date.now() + 3600 * 1000);
    setExpiryTime(expiryDate.toISOString());
    setIsRequestingSent(true);

    // Simulate API call to send quote requests
    setTimeout(() => {
      alert('Quote requests sent to delivery partners!');
      // Redirect to quote viewing page
      window.location.href = '/quotes';
    }, 2000);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">Review your items and request delivery quotes</p>
        </div>

        {/* Timer Display */}
        {expiryTime && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center">
              <svg className="h-8 w-8 text-red-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-center">
                <h3 className="text-lg font-bold text-red-800">Cart Expires In:</h3>
                <div className="text-2xl font-mono font-bold text-red-800">
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>
          </div>
        )}

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
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                      onError={(e) => {e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>'}}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-gray-600">{formatPrice(item.price)} each</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="font-semibold text-lg w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{formatPrice(item.price * item.quantity)}</div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
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
              <div className="space-y-2">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">{formatPrice(getTotalAmount())}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery fee:</span>
                  <span>To be determined by quotes</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Items Total:</span>
                    <span className="text-blue-600">{formatPrice(getTotalAmount())}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Request Quotes Button */}
        {cartItems.length > 0 && !expiryTime && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 text-center">
              <button 
                onClick={requestDeliveryQuotes}
                disabled={isRequestingSent}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRequestingSent ? 'Sending Requests...' : 'Request Delivery Quotes'}
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

export default CartWithExpiry;
