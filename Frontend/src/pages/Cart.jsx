import React, { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingCart, Shield, RefreshCw, Truck } from 'lucide-react';
import Footer from '../components/home/Footer';

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      company: "AquaLife Fisheries",
      name: "Goldfish Premium",
      price: 200.00,
      quantity: 4,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQP5_ehUjF34-YR2D5ROkcQ1A8ZoFxLe7siQ&s",
      deliveryFee: 500.00,
      deliveryConfirmed: true
    },
    {
      id: 2,
      company: "AquaLife Fisheries", 
      name: "Betta Fish",
      price: 90.00,
      quantity: 4,
      image: "data:image/jpeg;base64,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",
      deliveryFee: 900.00,
      deliveryConfirmed: true
    },
    {
      id: 3,
      company: "Ocean Paradise",
      name: "Angel Fish",
      price: 10.00,
      quantity: 10,
      image: "data:image/jpeg;base64,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",
      deliveryFee: 2000.00,
      deliveryConfirmed: true
    }
  ]);

  const updateQuantity = (id, change) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalDelivery = () => {
    return cartItems.reduce((total, item) => total + item.deliveryFee, 0);
  };

  const getGrandTotal = () => {
    return getSubtotal() + getTotalDelivery();
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-blue-900 mb-2 flex items-center justify-center gap-3">
            <ShoppingCart className="w-10 h-10" />
            Shopping Cart
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
                {/* Company Header */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4">
                  <h3 className="font-semibold text-lg">{item.company}</h3>
                </div>
                
                {/* Item Details */}
                <div className="p-6">
                  <div className="flex items-center gap-6">
                    {/* Fish Image */}
                    <div className="w-24 h-24 rounded-lg overflow-hidden shadow-md flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    
                    {/* Item Info */}
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h4>
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-2xl font-bold text-blue-600">
                          Rs. {item.price.toFixed(2)} / piece
                        </span>
                        <span className="text-gray-600">
                          Total: Rs. {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-gray-700 font-medium">Quantity:</span>
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-2 hover:bg-gray-100 text-gray-600"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 font-semibold text-lg bg-red-50 text-red-600 min-w-[60px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-2 hover:bg-gray-100 text-gray-600"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      
                      {/* Delivery Status */}
                      <div className="flex items-center gap-2 text-green-600">
                        <Truck className="w-5 h-5" />
                        <span className="font-medium">Delivery Confirmed</span>
                        <span className="text-gray-600">- Rs. {item.deliveryFee.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6 sticky top-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Order Summary ({totalItems} items)
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-700">Item Subtotal</span>
                  <span className="font-semibold">Rs. {getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-700">Delivery Fee</span>
                  <span className="font-semibold">Rs. {getTotalDelivery().toFixed(2)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold text-blue-900">
                    <span>Subtotal</span>
                    <span>Rs. {getGrandTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                🐟 Checkout
              </button>

              {/* Security Features */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  You're Protected by AquaLink.lk
                </p>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-green-600" />
                    <span>AquaLink.lk Logistics</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;