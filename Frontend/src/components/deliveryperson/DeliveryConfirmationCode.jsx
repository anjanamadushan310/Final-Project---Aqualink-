import React, { useState } from 'react';

const DeliveryConfirmationCode = ({ deliveryId, onConfirmDelivery, isVisible = false }) => {
  const [confirmationCode, setConfirmationCode] = useState('');
  const [customerSignature, setCustomerSignature] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateConfirmationCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setConfirmationCode(code);
    return code;
  };

  const validateCode = (code) => {
    return /^[A-Z0-9]{6}$/.test(code);
  };

  const handleConfirmDelivery = async () => {
    if (!validateCode(confirmationCode)) {
      setError('Please enter a valid 6-character confirmation code (A-Z, 0-9)');
      return;
    }

    if (!customerSignature.trim()) {
      setError('Customer signature is required');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const confirmationData = {
        deliveryId,
        confirmationCode: confirmationCode.toUpperCase(),
        customerSignature,
        deliveryNotes,
        timestamp: new Date().toISOString(),
        location: await getCurrentLocation()
      };

      await onConfirmDelivery(confirmationData);
      
      setConfirmationCode('');
      setCustomerSignature('');
      setDeliveryNotes('');
      
    } catch (error) {
      setError('Failed to confirm delivery. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentLocation = () => {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }),
          () => resolve({ lat: null, lng: null })
        );
      } else {
        resolve({ lat: null, lng: null });
      }
    });
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6 mt-4">
      <div className="flex items-center space-x-2 mb-4">
        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-green-800">Delivery Confirmation</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Confirmation Code *
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              maxLength={6}
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value.toUpperCase())}
              className={`flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-lg text-center ${
                error && error.includes('confirmation code') ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="ABC123"
            />
            <button
              type="button"
              onClick={generateConfirmationCode}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-200 text-sm"
            >
              Generate
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Enter the 6-character code provided to the customer or generate a new one
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Customer Name/Signature *
          </label>
          <input
            type="text"
            value={customerSignature}
            onChange={(e) => setCustomerSignature(e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              error && error.includes('signature') ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Customer full name or signature"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Notes (Optional)
          </label>
          <textarea
            value={deliveryNotes}
            onChange={(e) => setDeliveryNotes(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            rows={3}
            placeholder="Any additional notes about the delivery (condition of items, special instructions followed, etc.)"
          />
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <button
          onClick={handleConfirmDelivery}
          disabled={isSubmitting || !confirmationCode || !customerSignature}
          className="w-full py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-md hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Confirming Delivery...
            </>
          ) : (
            <>
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Complete Delivery
            </>
          )}
        </button>
      </div>

      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-3">
        <div className="flex items-start space-x-2">
          <svg className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-xs text-blue-700">
            <p className="font-semibold">Confirmation Process:</p>
            <ul className="mt-1 space-y-1">
              <li>• Share the confirmation code with the customer</li>
              <li>• Get customer's name or signature for verification</li>
              <li>• Add any relevant delivery notes</li>
              <li>• Complete delivery to update order status</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryConfirmationCode;
