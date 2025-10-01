import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { toast } from 'react-toastify';
import { districtToTowns } from "../../components/user-profile/locationData";
import deliveryService from "../../services/deliveryService";

const EnhancedDeliveryRequest = () => {
  const { cartItems, totalAmount, clearCart } = useContext(CartContext);
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { sellerId, businessName } = location.state || {};
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [availableTowns, setAvailableTowns] = useState([]);
  const [createdOrder, setCreatedOrder] = useState(null); // Store the initial order created on page load
  const [deliveryAddress, setDeliveryAddress] = useState({
    place: '',
    street: '',
    district: '',
    town: ''
  });

  useEffect(() => {
    // Load user's profile data
    const loadUserProfile = async () => {
      try {
        console.log('Loading profile with token:', token ? 'Present' : 'Missing');

        const response = await axios.get('http://localhost:8080/api/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const profile = response.data;
        console.log('Full profile data:', JSON.stringify(profile, null, 2));

        // Extract address fields exactly as they are in UserProfile entity
        const district = profile.addressDistrict || '';
        const town = profile.addressTown || '';

        console.log('Extracted address data:', {
          district,
          town,
          isDistrictValid: district ? district in districtToTowns : false,
          availableTownsForDistrict: district ? districtToTowns[district] : []
        });

        // Set the address state with the exact field names from UserProfile entity
        const updatedAddress = {
          place: profile.addressPlace || '',
          street: profile.addressStreet || '',
          district: district,
          town: town
        };

        console.log('Setting delivery address state:', updatedAddress);
        
        // First update available towns for the district
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
          
          // If current town is not valid for this district, clear it
          if (town && !towns.includes(town)) {
            console.log('Town', town, 'is not valid for district', district, '- clearing town');
            updatedAddress.town = '';
          } else if (town) {
            // Keep the valid town
            console.log('Keeping valid town:', town, 'for district:', district);
            updatedAddress.town = town;
          }
        } else {
          // Clear towns if no district
          console.log('No district selected, clearing towns');
          setAvailableTowns([]);
          updatedAddress.town = '';
        }

        // Now set the address with potentially cleared town
        console.log('Final address state to set:', updatedAddress);
        setDeliveryAddress(updatedAddress);

      } catch (error) {
        console.error('Error loading profile:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
        }
        toast.error('Failed to load your address information. Please enter it manually.');
      }
    };

    // Create initial order when page loads
    const createInitialOrder = async () => {
      if (!cartItems || cartItems.length === 0) {
        console.log('No cart items, skipping initial order creation');
        return;
      }

      try {
        const requestData = {
          sellerId,
          businessName,
          items: cartItems.map(item => ({
            cartItemId: item.id,
            productName: item.name,
            productType: item.type || 'FISH',
            quantity: item.quantity,
            price: item.price,
            sellerId: item.sellerId,
            sellerName: item.sellerName
          })),
          subtotal: totalAmount,
          preferences: {
            quotesExpireAfter: 24 // Default 24 hours
          }
        };

        console.log('Creating initial order with data:', requestData);

        const response = await deliveryService.createInitialOrder(requestData);
        
        if (response.success && response.data) {
          console.log('Initial order created successfully:', response.data);
          setCreatedOrder(response.data);
        } else {
          console.error('Failed to create initial order:', response.message);
        }

      } catch (error) {
        console.error('Error creating initial order:', error);
        // Don't show error to user for background order creation
      }
    };

    if (token) {
      loadUserProfile();
      createInitialOrder(); // Create initial order after loading profile
    } else {
      console.log('No token available, skipping profile load and order creation');
    }
  }, [token, cartItems, totalAmount, sellerId, businessName]);

  // Handle district/town state synchronization
  useEffect(() => {
    console.log('District changed. Current state:', {
      district: deliveryAddress.district,
      town: deliveryAddress.town
    });

    if (deliveryAddress.district) {
      const availableTownsForDistrict = districtToTowns[deliveryAddress.district] || [];
      console.log('Available towns for', deliveryAddress.district, ':', availableTownsForDistrict);
      
      setAvailableTowns(availableTownsForDistrict);

      // Validate if current town is valid for the selected district
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
    
    // Use the exact field names from UserProfile entity
    const fieldName = name === 'district' ? 'district' : 
                     name === 'town' ? 'town' :
                     name === 'place' ? 'place' :
                     name === 'street' ? 'street' : name;
    
    if (name === 'district') {
      // When district changes, update district and reset town
      setDeliveryAddress(prev => {
        console.log('Updating district to:', value);
        return {
          ...prev,
          district: value,
          town: '' // Reset town when district changes
        };
      });
      
      // Load towns for selected district
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

  const handleSubmitQuoteRequest = async () => {
    setSending(true);
    setError(null);

    try {
      // Check if we have a created order from page load
      if (!createdOrder || !createdOrder.orderId) {
        toast.error('Order not initialized. Please refresh the page and try again.');
        setSending(false);
        return;
      }

      const requestData = {
        orderId: createdOrder.orderId, // Include the order ID to update existing order
        sessionId: crypto.randomUUID(),
        sellerId: sellerId,
        businessName: businessName,
        items: cartItems.map(item => ({
          cartItemId: item.cartItemId,
          productName: item.productName,
          productType: item.productType,
          quantity: item.quantity,
          price: item.price,
          sellerId: item.sellerId,
          sellerName: item.sellerName
        })),
        subtotal: totalAmount,
        preferences: preferences,
        deliveryAddress: {
          place: deliveryAddress.place.trim(),
          street: deliveryAddress.street.trim(),
          district: deliveryAddress.district,
          town: deliveryAddress.town
        }
      };

      console.log('Submitting quote request with data:', requestData);
      console.log('Created order data:', createdOrder);
      console.log('Delivery address being sent:', requestData.deliveryAddress);

      // Validate delivery address
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
        orderId: requestData.orderId,
        deliveryAddress: requestData.deliveryAddress,
        fullRequestData: requestData
      });

      const response = await deliveryService.createQuoteRequest(requestData);
      
      console.log('Backend response received:', response);

      if (response.success && response.data) {
        toast.success('Delivery quote request sent successfully! Delivery persons will be notified.');
        clearCart(); // Clear the cart after successful request
        
        // Prepare order data for quote acceptance page
        const orderData = {
          sessionId: response.data.sessionId || requestData.sessionId,
          orderId: response.data.orderId || createdOrder.orderId,
          sellerId: sellerId,
          businessName: businessName,
          items: requestData.items,
          subtotal: requestData.subtotal,
          deliveryAddress: requestData.deliveryAddress,
          preferences: requestData.preferences,
          status: 'PENDING',
          createdAt: new Date().toISOString()
        };

        // Store order data in localStorage for QuoteAcceptance component
        localStorage.setItem('aqualink_order_data', JSON.stringify(orderData));
        
        // Navigate to quote acceptance page
        navigate('/shop-owner/quote-acceptance');
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
      
      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.cartItemId} className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">{item.productName}</p>
                <p className="text-sm text-gray-600">
                  Quantity: {item.quantity} | Type: {item.productType}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">Rs.{item.price * item.quantity}</p>
                <p className="text-sm text-gray-600">Rs.{item.price} each</p>
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center pt-2">
            <p className="font-semibold">Total:</p>
            <p className="font-semibold">Rs.{totalAmount}</p>
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Delivery Address</h3>
        <div className="grid grid-cols-1 gap-4">
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
              {Object.keys(districtToTowns).sort().map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>
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
                {availableTowns.sort().map(town => (
                  <option key={town} value={town}>{town}</option>
                ))}
              </select>
              {!deliveryAddress.district && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-400">⚠️</span>
                </div>
              )}
            </div>
            {!deliveryAddress.district && (
              <p className="mt-1 text-sm text-gray-500">Please select a district first</p>
            )}
          </div>
        </div>
      </div>

      {/* Quote Preferences */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Quote Preferences</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quotes should expire after:
            </label>
            <select
              value={preferences.quotesExpireAfter}
              onChange={(e) => handleQuoteExpiryChange(parseInt(e.target.value))}
              className="w-full border rounded-md py-2 px-3"
            >
              <option value={24}>24 hours</option>
              <option value={48}>48 hours</option>
              <option value={72}>72 hours</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Submit Button */}
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
