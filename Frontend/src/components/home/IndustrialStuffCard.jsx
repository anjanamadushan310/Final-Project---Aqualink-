import React, { useState } from 'react';

const IndustrialStuffCard = ({ industrial, onPurchaseSuccess }) => {
  const [isPurchasing, setIsPurchasing] = useState(false);

  const handlePurchase = async () => {
    try {
      setIsPurchasing(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:8080/api/industrial/${industrial.id}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          industrialId: industrial.id,
          // Add other purchase details as needed
        }),
      });

      if (response.ok) {
        alert('Item added to cart successfully!');
        if (onPurchaseSuccess) {
          onPurchaseSuccess();
        }
      } else {
        throw new Error('Failed to purchase item');
      }
    } catch (error) {
      console.error('Error purchasing item:', error);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Item Image */}
      <div className="h-48 overflow-hidden">
        {industrial.imageUrl ? (
          <img
            src={industrial.imageUrl}
            alt={industrial.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <div className="text-4xl text-white">🐠</div>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Item Name */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{industrial.name}</h3>
        
        {/* Item Description */}
        <p className="text-gray-600 mb-4 line-clamp-3">{industrial.description}</p>
        
        {/* How Many Sold */}
        <div className="flex items-center mb-3">
          <span className="text-sm text-gray-600">
            <span className="font-medium text-blue-600">{industrial.soldCount || 0}</span> sold
          </span>
        </div>

        {/* Category and Price */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {industrial.category}
          </span>
          <span className="text-lg font-bold text-blue-600">
            {industrial.price}
          </span>
        </div>

        {/* Stock Status */}
        <div className="mb-4">
          <span className={`text-xs px-2 py-1 rounded-full ${
            industrial.inStock !== false 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {industrial.inStock !== false ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button 
          onClick={handlePurchase}
          disabled={isPurchasing || industrial.inStock === false}
          className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${
            isPurchasing || industrial.inStock === false
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isPurchasing ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default IndustrialStuffCard;
