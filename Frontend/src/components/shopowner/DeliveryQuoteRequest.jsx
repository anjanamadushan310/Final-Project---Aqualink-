import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { toast } from 'react-toastify';
import { districtToTowns } from "../../components/user-profile/locationData.jsx";
import deliveryService from "../../services/deliveryService";
import { ENV } from "../../config/env.js";

const EnhancedDeliveryRequest = () => {
  const { cartItems, totalAmount, clearCart, refreshCart } = useContext(CartContext);
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { sellerId, businessName } = location.state || {};

  // ===== Local State =====
  const [sending, setSending] = useState(false);           
  const [error, setError] = useState(null);                
  const [availableTowns, setAvailableTowns] = useState([]); 
  const [addressLoaded, setAddressLoaded] = useState(false); 

  // Ref to prevent repeated initial load logic
  const initialLoadRef = useRef(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    place: '',
    street: '',
    district: '',
    town: ''
  });

  useEffect(() => {
    if (initialLoadRef.current) {
      console.log('Initial load already completed, skipping useEffect');
      return;
    }

    console.log('Running initial load useEffect');
    initialLoadRef.current = true;

    // Debug logging for cart data on entry
    console.log('DeliveryQuoteRequest - Cart Data:', {
      cartItems,
      totalAmount,
      cartItemsLength: cartItems?.length,
      firstItem: cartItems?.length > 0 ? cartItems[0] : null
    });

    // Check for order data stored in localStorage by Cart component
    const storedOrderData = localStorage.getItem('aqualink_order_data');
    if (storedOrderData) {
      try {
        const orderData = JSON.parse(storedOrderData);
        console.log('Found stored order data from Cart:', orderData);
        
        // If cart context is empty we still have fallback items from stored data
        if ((!cartItems || cartItems.length === 0) && orderData.items && orderData.items.length > 0) {
          console.log('Using stored order data as cart is empty');
          
        }
      } catch (error) {
        console.error('Error parsing stored order data:', error);
      }
    }

    // Load logged-in user's saved address from profile and pre-fill delivery form
    const loadUserProfile = async () => {
      if (addressLoaded) {
        console.log('Address already loaded, skipping profile load');
        return;
      }

      try {
        console.log('Loading profile with token:', token ? 'Present' : 'Missing');

        const response = await axios.get(`${ENV.API_URL}/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const profile = response.data;
        console.log('Full profile data:', JSON.stringify(profile, null, 2));

        // Extract address fields (matching UserProfile entity fields)
        const district = profile.addressDistrict || '';
        const town = profile.addressTown || '';

        console.log('Extracted address data:', {
          district,
          town,
          isDistrictValid: district ? district in districtToTowns : false,
          availableTownsForDistrict: district ? districtToTowns[district] : []
        });

        // Prepare updated address from profile
        const updatedAddress = {
          place: profile.addressPlace || '',
          street: profile.addressStreet || '',
          district: district,
          town: town
        };

        console.log('Setting delivery address state (first time only):', updatedAddress);
        
        // Setup available towns for selected district
        if (district) {
          const towns = districtToTowns[district] || [];
          console.log('Setting available towns:', {
            district,
            townsFound: towns.length > 0,
            towns,
            currentTown: town,
            isTownValid: towns.includes(town)
          });
          setAvailableTowns(towns);
          
          // Validate town against district's towns list
          if (town && !towns.includes(town)) {
            console.log('Town', town, 'is not valid for district', district, '- clearing town');
            updatedAddress.town = '';
          } else if (town) {
            console.log('Keeping valid town:', town, 'for district:', district);
            updatedAddress.town = town;
          }
        } else {
          console.log('No district selected, clearing towns');
          setAvailableTowns([]);
          updatedAddress.town = '';
        }

        // Save final address state
        setDeliveryAddress(updatedAddress);
        setAddressLoaded(true);

      } catch (error) {
        console.error('Error loading profile:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
        }
        toast.error('Failed to load your address information. Please enter it manually.');
        setAddressLoaded(true); // Prevent repeated attempts on error
      }
    };

    // Only load profile and refresh cart if we have a token
    if (token) {
      refreshCart();
      loadUserProfile();
    } else {
      console.log('No token available, skipping profile load');
    }

  }, [token]);

  // Whenever district changes, update available towns list and validate selected town
  useEffect(() => {
    console.log('District changed. Current state:', {
      district: deliveryAddress.district,
      town: deliveryAddress.town
    });

    if (deliveryAddress.district) {
      const availableTownsForDistrict = districtToTowns[deliveryAddress.district] || [];
      console.log('Available towns for', deliveryAddress.district, ':', availableTownsForDistrict);
      
      setAvailableTowns(availableTownsForDistrict);

      // Reset town if it doesn't belong to selected district
      if (deliveryAddress.town && !availableTownsForDistrict.includes(deliveryAddress.town)) {
        console.log('Current town is not valid for selected district, resetting town');
        setDeliveryAddress(prev => ({
          ...prev,
          town: ''
        }));
      }
    } else {
      console.log('No district selected, clearing towns');
      setAvailableTowns([]);
      if (deliveryAddress.town) {
        setDeliveryAddress(prev => ({
          ...prev,
          town: ''
        }));
      }
    }
  }, [deliveryAddress.district, deliveryAddress.town]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    console.log('Address field change:', name, value);
    
 
    const fieldName = name === 'district' ? 'district' : 
                     name === 'town' ? 'town' :
                     name === 'place' ? 'place' :
                     name === 'street' ? 'street' : name;
    
    if (name === 'district') {
      // When district changes, reset town and load its towns
      setDeliveryAddress(prev => {
        console.log('Updating district to:', value);
        return {
          ...prev,
          district: value,
          town: '' 
        };
      });
      
      const townsForDistrict = districtToTowns[value] || [];
      console.log('Setting available towns for district:', value, townsForDistrict);
      setAvailableTowns(townsForDistrict);
    } else {
      setDeliveryAddress(prev => ({
        ...prev,
        [fieldName]: value
      }));
    }
  };


  const [preferences, setPreferences] = useState({
    quotesExpireAfter: 24,
    quotesExpireOn: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  });

  // ===== Submit Quote Request =====
  const handleSubmitQuoteRequest = async () => {
    setSending(true);
    setError(null);

    try {
   
      let itemsToUse = cartItems;
      let totalToUse = totalAmount;

      if (!cartItems || cartItems.length === 0) {
        const storedOrderData = localStorage.getItem('aqualink_order_data');
        if (storedOrderData) {
          try {
            const orderData = JSON.parse(storedOrderData);
            itemsToUse = orderData.items;
            totalToUse = orderData.subtotal;
          } catch (error) {
            console.error('Error parsing stored order data for submission:', error);
          }
        }
      }

      // Recalculate total based on items for accuracy
      const calculatedTotal = itemsToUse && itemsToUse.length > 0 
        ? itemsToUse.reduce((sum, item) => {
            const itemPrice = parseFloat(item.price) || 0;
            const itemQuantity = parseInt(item.quantity) || 0;
            return sum + (itemPrice * itemQuantity);
          }, 0)
        : 0;

      const finalTotal = calculatedTotal > 0 ? calculatedTotal : (totalToUse || 0);

      // Build request payload to backend
      const requestData = {
        sessionId: crypto.randomUUID(),
        sellerId: sellerId,
        businessName: businessName,
        items: itemsToUse.map(item => ({
          cartItemId: item.cartItemId,
          productName: item.productName,
          productType: item.productType,
          quantity: item.quantity,
          price: item.price,
          sellerId: item.sellerId,
          sellerName: item.sellerName
        })),
        subtotal: finalTotal,
        preferences: {
          quotesExpireAfter: preferences.quotesExpireAfter,
          quotesExpireOn: new Date(preferences.quotesExpireOn).toISOString()
        },
        deliveryAddress: {
          place: deliveryAddress.place.trim(),
          street: deliveryAddress.street.trim(),
          district: deliveryAddress.district,
          town: deliveryAddress.town
        }
      };

      console.log('Submitting quote request with data:', requestData);
      console.log('Delivery address being sent:', requestData.deliveryAddress);

      // Basic client-side address validation before sending
      if (!deliveryAddress.place.trim()) {
        toast.error('Please enter the place/building name');
        return;
      }
      if (!deliveryAddress.street.trim()) {
        toast.error('Please enter the street address');
        return;
      }
      if (!deliveryAddress.district) {
        toast.error('Please select a district');
        return;
      }
      if (!deliveryAddress.town) {
        toast.error('Please select a town');
        return;
      }

      console.log('About to send request to backend with address data:', {
        deliveryAddress: requestData.deliveryAddress,
        fullRequestData: requestData
      });

      // Call delivery service to create the quote request
      const response = await deliveryService.createQuoteRequest(requestData);
      
      console.log('=== Backend Response Debug ===');
      console.log('Full response object:', response);
      console.log('response.success:', response?.success);
      console.log('response.data:', response?.data);
      console.log('response.data.orderId:', response?.data?.orderId);
      console.log('response.data.sessionId:', response?.data?.sessionId);
      console.log('Type of orderId:', typeof response?.data?.orderId);
      console.log('================================');

      if (response.success && response.data) {
        // On success: inform user, clear cart, store order info, and navigate
        toast.success('Delivery quote request sent successfully! Delivery persons will be notified.');
        clearCart();

        // Prepare order data for a later quote acceptance screen
        const orderData = {
          sessionId: response.data.sessionId || requestData.sessionId,
          orderId: response.data.orderId,
          sellerId: sellerId,
          businessName: businessName,
          items: requestData.items,
          subtotal: requestData.subtotal,
          deliveryAddress: requestData.deliveryAddress,
          preferences: requestData.preferences,
          status: 'PENDING',
          createdAt: new Date().toISOString()
        };

        console.log('=== Order Data to Store ===');
        console.log('orderData object:', orderData);
        console.log('orderData.orderId:', orderData.orderId);
        console.log('===========================');

        // Persist order data in localStorage for the QuoteAcceptance component
        localStorage.setItem('aqualink_order_data', JSON.stringify(orderData));
   
        const stored = localStorage.getItem('aqualink_order_data');
        console.log('=== Verification of Storage ===');
        console.log('Stored in localStorage:', stored);
        console.log('Parsed back:', JSON.parse(stored));
        console.log('================================');
        
        // Navigate to shop-owner dashboard with quote-acceptance active
        navigate('/dashboard/shop-owner', { state: { activeComponent: 'quote-acceptance' } });
      } else {
        throw new Error(response.message || 'Failed to submit quote request');
      }
    } catch (error) {
      console.error('Error submitting quote request:', error);
      const errorMessage = error.message || error.response?.data?.message || 'Failed to submit quote request';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSending(false);
    }
  };


  const handleQuoteExpiryChange = (hours) => {
    setPreferences({
      quotesExpireAfter: hours,
      quotesExpireOn: new Date(Date.now() + hours * 60 * 60 * 1000).toISOString()
    });
  };

  
  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Page</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Request Delivery Quotes</h2>
      
      {/* ===== Order Summary Card ===== */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
        {(() => {
          // Decide which items and totals to show (cart vs stored data)
          let itemsToShow = cartItems;
          let totalToShow = totalAmount;

          if (!cartItems || cartItems.length === 0) {
            const storedOrderData = localStorage.getItem('aqualink_order_data');
            if (storedOrderData) {
              try {
                const orderData = JSON.parse(storedOrderData);
                itemsToShow = orderData.items;
                totalToShow = orderData.subtotal;
                console.log('Displaying stored order data in summary:', { itemsToShow, totalToShow });
              } catch (error) {
                console.error('Error parsing stored order data for display:', error);
              }
            }
          }

          // If we have items, render them with totals; otherwise, show a debug-like empty state
          return itemsToShow && itemsToShow.length > 0 ? (
            <div className="space-y-4">
              {itemsToShow.map((item, index) => {
                console.log(`Item ${index}:`, item);
                const itemTotal = (item.price && item.quantity) ? (item.price * item.quantity) : 0;
                return (
                  <div 
                    key={item.cartItemId || index} 
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">{item.productName || 'Unknown Product'}</p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity || 0} | Type: {item.productType || 'Unknown'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Rs.{itemTotal.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">
                        Rs.{item.price || 0} each
                      </p>
                    </div>
                  </div>
                );
              })}
              <div className="flex justify-between items-center pt-2">
                <p className="font-semibold">Total:</p>
                <p className="font-semibold">
                  Rs.{(() => {
                    // Always recompute total from visible items to avoid mismatches
                    const calculatedTotal = itemsToShow.reduce((sum, item) => {
                      const itemPrice = parseFloat(item.price) || 0;
                      const itemQuantity = parseInt(item.quantity) || 0;
                      return sum + (itemPrice * itemQuantity);
                    }, 0);
                    
                    return calculatedTotal > 0
                      ? calculatedTotal.toFixed(2)
                      : (totalToShow ? totalToShow.toFixed(2) : '0.00');
                  })()}
                </p>
              </div>
            </div>
          ) : (
            // No items found: show debug helpers for troubleshooting
            <div className="text-center py-8 text-gray-500">
              <p>No items found</p>
              <p className="text-sm">Cart Items: {JSON.stringify(cartItems)}</p>
              <p className="text-sm">Total Amount: {totalAmount}</p>
              <p className="text-sm">
                Stored Data: {localStorage.getItem('aqualink_order_data') ? 'Found' : 'Not found'}
              </p>
            </div>
          );
        })()}
      </div>

      {/* ===== Delivery Address Card ===== */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Delivery Address</h3>
          {addressLoaded && (
            <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              ✏️ Loaded from profile - Edit as needed
            </div>
          )}
        </div>

        {/* Address Form Fields */}
        <div className="grid grid-cols-1 gap-4">
          {/* Place / Building */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Place/Building
            </label>
            <input
              type="text"
              name="place"
              value={deliveryAddress.place}
              onChange={handleAddressChange}
              className="w-full border rounded-md py-2 px-3"
              placeholder="Enter building or place name"
            />
          </div>

          {/* Street Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Street Address
            </label>
            <input
              type="text"
              name="street"
              value={deliveryAddress.street}
              onChange={handleAddressChange}
              className="w-full border rounded-md py-2 px-3"
              placeholder="Enter street address"
            />
          </div>

          {/* District Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              District
            </label>
            <select
              name="district"
              value={deliveryAddress.district || ''}
              onChange={handleAddressChange}
              className="w-full border rounded-md py-2 px-3"
            >
              <option value="">Select District</option>
              {Object.keys(districtToTowns)
                .sort()
                .map(district => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
            </select>
          </div>

          {/* Town Selector (depends on district) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Town
            </label>
            <div className="relative">
              <select
                name="town"
                value={deliveryAddress.town || ''}
                onChange={handleAddressChange}
                className={`w-full border rounded-md py-2 px-3 ${!deliveryAddress.district ? 'bg-gray-100' : 'bg-white'}`}
                disabled={!deliveryAddress.district}
              >
                <option value="">
                  {!deliveryAddress.district ? 'Select district first' : 'Select Town'}
                </option>
                {availableTowns
                  .sort()
                  .map(town => (
                    <option key={town} value={town}>
                      {town}
                    </option>
                  ))}
              </select>
              {!deliveryAddress.district && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-400">⚠️</span>
                </div>
              )}
            </div>
            {!deliveryAddress.district && (
              <p className="mt-1 text-sm text-gray-500">
                Please select a district first
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ===== Quote Preferences Card ===== */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Quote Preferences</h3>
        <div className="space-y-4">
          {/* Expiry Time Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quotes should expire after:
            </label>
            <select
              value={preferences.quotesExpireAfter}
              onChange={(e) => handleQuoteExpiryChange(parseInt(e.target.value))}
              className="w-full border rounded-md py-2 px-3"
            >
              <option value={12}>12 hours</option>
              <option value={24}>24 hours</option>
              <option value={36}>36 hours</option>
            </select>
          </div>
        </div>
      </div>

      {/* ===== Inline Error Message (non-blocking) ===== */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* ===== Submit Button Row ===== */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmitQuoteRequest}
          disabled={sending}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {sending ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Submitting...
            </div>
          ) : (
            'Submit Quote Request'
          )}
        </button>
      </div>
    </div>
  );
};

export default EnhancedDeliveryRequest;
