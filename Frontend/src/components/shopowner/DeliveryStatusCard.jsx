import React from 'react';

const DeliveryStatusCard = ({ order, onConfirmDelivery }) => {
  const formatPrice = (price) => {
    return `Rs.${parseFloat(price).toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ORDERED': return 'bg-gray-500';
      case 'CONFIRMED': return 'bg-blue-500';
      case 'PICKED_UP': return 'bg-yellow-500';
      case 'IN_TRANSIT': return 'bg-purple-500';
      case 'ARRIVED': return 'bg-orange-500';
      case 'DELIVERED': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status, completed) => {
    if (completed) {
      return (
        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    }
    return (
      <div className="w-3 h-3 bg-white rounded-full"></div>
    );
  };

  const getCurrentStatusText = (status) => {
    switch (status) {
      case 'ORDERED': return 'Order Placed';
      case 'CONFIRMED': return 'Order Confirmed';
      case 'PICKED_UP': return 'Out for Delivery';
      case 'IN_TRANSIT': return 'On the Way';
      case 'ARRIVED': return 'Delivery Person Arrived';
      case 'DELIVERED': return 'Delivered';
      default: return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">Order #{order.orderId}</h3>
            <p className="text-blue-100 mt-1">Expected: {formatTime(order.estimatedDelivery)}</p>
          </div>
          <div className={`${getStatusColor(order.status)} px-4 py-2 rounded-full flex items-center space-x-2`}>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="font-semibold">{getCurrentStatusText(order.status)}</span>
          </div>
        </div>
      </div>

      {/* Current Status */}
      <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V7M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900">
              {getCurrentStatusText(order.status)}
            </h4>
            <p className="text-gray-600">{order.currentLocation}</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Delivery Progress</h4>
        <div className="relative">
          {order.timeline.map((step, index) => (
            <div key={step.status} className="flex items-center mb-4 last:mb-0">
              <div className="relative flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.completed ? getStatusColor(step.status) : 'bg-gray-300'
                }`}>
                  {getStatusIcon(step.status, step.completed)}
                </div>
                {index < order.timeline.length - 1 && (
                  <div className={`absolute top-8 left-4 w-0.5 h-8 ${
                    step.completed ? 'bg-blue-500' : 'bg-gray-300'
                  }`} style={{ transform: 'translateX(-50%)' }}></div>
                )}
              </div>
              <div className="ml-4 flex-1">
                <p className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                  {getCurrentStatusText(step.status)}
                </p>
                {step.time && (
                  <p className="text-sm text-gray-600">
                    {new Date(step.time).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Details */}
      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Items */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                  <div>
                    <span className="text-gray-900">{item.name}</span>
                    <span className="text-sm text-gray-600 ml-2">x{item.quantity}</span>
                  </div>
                  <span className="font-medium text-gray-900">{formatPrice(item.price)}</span>
                </div>
              ))}
              <div className="flex justify-between items-center py-2 font-semibold">
                <span>Delivery Fee:</span>
                <span>{formatPrice(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between items-center py-2 font-bold text-lg border-t border-gray-300">
                <span>Total:</span>
                <span className="text-green-600">{formatPrice(order.totalAmount + order.deliveryFee)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Delivery Information</h4>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-600">Delivery Person:</span>
                <div className="font-medium text-gray-900">{order.deliveryPersonName}</div>
                <a href={`tel:${order.deliveryPersonPhone}`} className="text-blue-600 hover:text-blue-800">
                  {order.deliveryPersonPhone}
                </a>
              </div>
              <div>
                <span className="text-gray-600">Delivery Address:</span>
                <div className="font-medium text-gray-900">{order.deliveryAddress}</div>
              </div>
              {order.specialInstructions && (
                <div>
                  <span className="text-gray-600">Special Instructions:</span>
                  <div className="font-medium text-gray-900">{order.specialInstructions}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          {order.status === 'ARRIVED' && order.confirmationRequired && (
            <button
              onClick={() => onConfirmDelivery(order)}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Confirm Delivery
            </button>
          )}
          
          <button className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Track on Map
          </button>

          <button className="border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call Driver
          </button>
        </div>

        {/* Confirmation Code Display */}
        {order.confirmationCode && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6a2 2 0 012-2m0 0V7a2 2 0 012-2h4a2 2 0 012 2v2M9 7h6" />
              </svg>
              <div>
                <p className="font-semibold text-yellow-800">Your Confirmation Code</p>
                <p className="text-yellow-700">Share this code with the delivery person: 
                  <span className="font-mono font-bold text-lg ml-2 bg-yellow-100 px-2 py-1 rounded">
                    {order.confirmationCode}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryStatusCard;
