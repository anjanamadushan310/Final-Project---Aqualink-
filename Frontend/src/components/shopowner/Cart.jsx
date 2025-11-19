// with options to update quantities, remove items, clear cart, and start a delivery request.

import React, { useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  // Cart context: holds cart data and operations
  const { 
    cartItems, 
    cartCount, 
    totalAmount, 
    loading, 
    updateCartItem, 
    removeFromCart, 
    clearCart, 
    refreshCart 
  } = useCart();

  // Auth context: used to check if user is logged in and who the user is
  const { isAuthenticated, user } = useAuth();

  // React Router navigation hook
  const navigate = useNavigate();

  // Logs whenever authentication status, cart items, count, or loading changes
  useEffect(() => {
    console.log('Cart component mounted, authentication status:', isAuthenticated());
    console.log('Cart items:', cartItems);
    console.log('Cart count:', cartCount);
    console.log('Loading state:', loading);
    
    if (!isAuthenticated()) {
      console.log('User not authenticated for cart access');
      // You could redirect to login here if needed
    }
  }, [isAuthenticated, cartItems, cartCount, loading]);

  // Formats a numeric price as a currency string in Rs.
  const formatPrice = (price) => {
    return `Rs.${parseFloat(price).toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };


  const getTotalAmount = () => {
    return totalAmount || 0;
  };

  // Returns an object keyed by sellerId with per-seller grouped items and totals
  const groupItemsBySeller = (items) => {
    if (!items || items.length === 0) return {};
    
    return items.reduce((groups, item) => {
      const sellerId = item.sellerId || 'unknown';
      const businessName = item.businessName || item.sellerName || 'Unknown Business';
      const isOwnItem = user && user.userId === item.sellerId;
      
      if (!groups[sellerId]) {
        groups[sellerId] = {
          sellerId,
          businessName,
          sellerName: item.sellerName,
          isOwnItem,
          items: [],
          totalAmount: 0
        };
      }
      
      groups[sellerId].items.push(item);
      groups[sellerId].totalAmount += (item.price * item.quantity);
      
      return groups;
    }, {});
  };

  // Converts grouped object into array and sorts so user's own items appear first
  const getSellerGroups = () => {
    const groups = Object.values(groupItemsBySeller(cartItems || []));
    return groups.sort((a, b) => {
      if (a.isOwnItem && !b.isOwnItem) return -1;
      if (!a.isOwnItem && b.isOwnItem) return 1;
      return 0;
    });
  };

  // Handles quantity changes, includes auth check and basic error handling
  const updateQuantity = async (cartItemId, newQuantity) => {
    if (!isAuthenticated()) {
      alert('Please log in to modify your cart.');
      return;
    }
    
    // If quantity is below 1, treat as remove
    if (newQuantity < 1) {
      await removeItem(cartItemId);
      return;
    }

    try {
      await updateCartItem(cartItemId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
      if (error.message.includes('Authentication failed')) {
        alert('Your session has expired. Please log in again.');
      } else {
        alert('Failed to update quantity. Please try again.');
      }
    }
  };

  
  // Removes an item from the cart with auth and error handling
  const removeItem = async (cartItemId) => {
    if (!isAuthenticated()) {
      alert('Please log in to modify your cart.');
      return;
    }
    
    try {
      await removeFromCart(cartItemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
      if (error.message.includes('Authentication failed')) {
        alert('Your session has expired. Please log in again.');
      } else {
        alert('Failed to remove item. Please try again.');
      }
    }
  };

  // ===== Main Render =====
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header + Refresh Button */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
              <p className="text-gray-600">Review your items and request delivery quotes</p>
            </div>
            <button
              onClick={() => refreshCart && refreshCart()}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh Cart'}
            </button>
          </div>
        </div>

        {/* Authentication Notice */}
        {!isAuthenticated() && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-yellow-600 mr-3">⚠️</div>
              <div>
                <h3 className="text-yellow-800 font-semibold">Authentication Required</h3>
                <p className="text-yellow-700 text-sm">
                  Please log in to access your cart and make purchases.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Cart Items Section */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Cart Items ({cartItems ? cartItems.length : 0})
            </h2>
            
            {/* Loading State */}
            {loading && (
              <div className="text-center py-8">
                <div className="text-lg text-gray-600">Loading cart...</div>
              </div>
            )}
            
            {/* Empty Cart State */}
            {!loading && (!cartItems || cartItems.length === 0) ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600">Add some items to get started!</p>
              </div>
            ) : (
              // Non-empty Cart Content
              !loading && (
                <div className="space-y-6">
                  {/* Loop over each seller group */}
                  {getSellerGroups().map((sellerGroup) => (
                    <div 
                      key={sellerGroup.sellerId} 
                      className="border border-gray-300 rounded-lg p-4 bg-gray-50"
                    >
                      {/* Seller Header Row */}
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                          {/* Avatar-like circle with first letter of business */}
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              sellerGroup.isOwnItem ? 'bg-green-100' : 'bg-blue-100'
                            }`}
                          >
                            <span
                              className={`font-bold text-sm ${
                                sellerGroup.isOwnItem ? 'text-green-600' : 'text-blue-600'
                              }`}
                            >
                              {sellerGroup.businessName.charAt(0).toUpperCase()}
                            </span>
                          </div>

                          {/* Seller Name + Tag */}
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-bold text-lg text-gray-900">
                                {sellerGroup.businessName}
                              </h3>
                              {sellerGroup.isOwnItem && (
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                                  Your Items
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              Seller: {sellerGroup.sellerName}
                              {sellerGroup.isOwnItem && ' (You)'}
                            </p>
                          </div>
                        </div>

                        {/* Group Total */}
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Group Total</div>
                          <div
                            className={`font-bold text-lg ${
                              sellerGroup.isOwnItem ? 'text-green-600' : 'text-blue-600'
                            }`}
                          >
                            {formatPrice(sellerGroup.totalAmount)}
                          </div>
                        </div>
                      </div>
                      
                      {/* Items List for this Seller */}
                      <div className="space-y-3">
                        {sellerGroup.items.map((item) => (
                          <div 
                            key={item.cartItemId} 
                            className="bg-white rounded-lg p-4 border border-gray-200"
                          >
                            <div className="flex items-center justify-between">
                              {/* Product Info */}
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 text-lg">
                                  {item.productName}
                                </h4>
                                <p className="text-gray-600">
                                  {formatPrice(item.price)} each
                                </p>
                                <p className="text-sm text-gray-500 capitalize">
                                  {item.productType}
                                </p>
                              </div>
                              
                              {/* Quantity Controls + Line Total + Remove */}
                              <div className="flex items-center space-x-4">
                                {/* Quantity Buttons */}
                                <div className="flex items-center space-x-3">
                                  <button 
                                    onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 font-semibold"
                                  >
                                    -
                                  </button>
                                  <span className="font-semibold text-lg w-8 text-center">
                                    {item.quantity}
                                  </span>
                                  <button 
                                    onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 font-semibold"
                                  >
                                    +
                                  </button>
                                </div>
                                
                                {/* Line Total + Remove Action */}
                                <div className="text-right min-w-0">
                                  <div className="font-bold text-lg">
                                    {formatPrice(item.price * item.quantity)}
                                  </div>
                                  <button 
                                    onClick={() => removeItem(item.cartItemId)}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Delivery Options per Seller */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        {/* For sellers that are not the current user */}
                        {!sellerGroup.isOwnItem && (
                          <div className="flex space-x-4">
                            {/* Placeholder button for courier service */}
                            <button
                              onClick={() => {
                                alert('This feature is not available yet.');
                              }}
                              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg"
                            >
                              🚚 Delivery with Courier Service
                            </button>

                            {/* Aqualink flow: saves order data to localStorage then navigates */}
                            <button
                              onClick={() => {
                                const orderData = {
                                  sessionId: 'SESSION_' + Date.now() + '_' + sellerGroup.sellerId,
                                  sellerId: sellerGroup.sellerId,
                                  businessName: sellerGroup.businessName,
                                  items: sellerGroup.items,
                                  subtotal: sellerGroup.totalAmount,
                                  createdAt: new Date().toISOString(),
                                  status: 'REQUESTING_QUOTES'
                                };
                                localStorage.setItem('aqualink_order_data', JSON.stringify(orderData));
                                navigate('/delivery-request');
                              }}
                              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-lg"
                            >
                              🌊 Delivery with Aqualink
                            </button>
                          </div>
                        )}
                        
                        {/* For user's own items: info message instead of delivery options */}
                        {sellerGroup.isOwnItem && (
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                            <div className="text-gray-600 mb-2">
                              <span className="text-sm">💡 These are your own products</span>
                            </div>
                            <p className="text-xs text-gray-500">
                              You cannot request delivery quotes for your own items. 
                              These items will need to be handled separately or purchased by other customers.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>

        {/* Overall Cart Summary (only when there are items) */}
        {!loading && cartItems && cartItems.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Overall Cart Summary</h2>
              
              {/* High-level totals */}
              <div className="space-y-3">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Total Items:</span>
                  <span className="font-semibold">{cartItems.length} items</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Sellers:</span>
                  <span className="font-semibold">
                    {getSellerGroups().length} seller
                    {getSellerGroups().length > 1 ? 's' : ''}
                  </span>
                </div>

                {/* Grand Total */}
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Grand Total:</span>
                    <span className="text-blue-600">
                      {formatPrice(getTotalAmount())}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    + delivery fees (will be added after quote selection)
                  </p>
                </div>
                
                {/* Breakdown by Seller */}
                <div className="border-t pt-3 mt-3">
                  <h4 className="font-semibold text-gray-700 mb-2">Breakdown by Seller:</h4>
                  <div className="space-y-2">
                    {getSellerGroups().map((group) => (
                      <div key={group.sellerId} className="flex justify-between text-sm">
                        <span className="text-gray-600">{group.businessName}:</span>
                        <span className="font-medium">
                          {formatPrice(group.totalAmount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Clear Cart Button */}
                <div className="border-t pt-3 mt-3">
                  <button 
                    onClick={async () => {
                      if (!isAuthenticated()) {
                        alert('Please log in to modify your cart.');
                        return;
                      }
                      
                      if (window.confirm(
                        'Are you sure you want to clear your entire cart? This will remove all items from all sellers.'
                      )) {
                        try {
                          await clearCart();
                        } catch (error) {
                          if (error.message.includes('Authentication failed')) {
                            alert('Your session has expired. Please log in again.');
                          } else {
                            alert('Failed to clear cart. Please try again.');
                          }
                        }
                      }
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg text-sm"
                  >
                    Clear Entire Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Placeholder for future global quote request settings */}
        {/* Global Quote Request Settings - for setting default preferences */}
      </div>
    </div>
  );
};

export default Cart;
