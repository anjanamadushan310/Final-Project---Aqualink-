import React, { useState } from 'react';

const DeliveryConfirmationModal = ({ order, onClose, onSubmit }) => {
  const [confirmationCode, setConfirmationCode] = useState('');
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (confirmationCode !== order.confirmationCode) {
      setError('Invalid confirmation code. Please check with your delivery person.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await onSubmit({
        confirmationCode,
        rating,
        feedback,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      setError('Failed to confirm delivery. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return [...Array(5)].map((_, index) => (
      <button
        key={index}
        type="button"
        onClick={() => setRating(index + 1)}
        className={`h-8 w-8 ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        } hover:text-yellow-400 transition duration-200`}
      >
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </button>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Confirm Delivery</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition duration-200"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Confirmation Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Confirmation Code *
            </label>
            <input
              type="text"
              maxLength={6}
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value.toUpperCase())}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-lg text-center ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="ABC123"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Ask the delivery person for the 6-character confirmation code
            </p>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rate Your Delivery Experience
            </label>
            <div className="flex items-center space-x-1">
              {renderStars()}
              <span className="ml-3 text-sm text-gray-600">({rating}/5)</span>
            </div>
          </div>

          {/* Feedback */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feedback (Optional)
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="How was your delivery experience? Any comments about the fish condition?"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-md hover:from-green-700 hover:to-emerald-700 transition duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || !confirmationCode}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Confirming...
                </div>
              ) : (
                'Confirm Delivery'
              )}
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-start space-x-2">
            <svg className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-xs text-blue-700">
              <p className="font-semibold">Need Help?</p>
              <p className="mt-1">If you don't have the confirmation code, please contact the delivery person at {order.deliveryPersonPhone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryConfirmationModal;
