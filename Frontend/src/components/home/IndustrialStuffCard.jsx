import React, { useState } from 'react';
import { ShoppingCartIcon, StarIcon, TruckIcon } from '@heroicons/react/24/outline';

const IndustrialStuffCard = ({ industrial, onPurchaseSuccess }) => {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handlePurchase = async () => {
    try {
      setIsPurchasing(true);
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const purchaseData = {
        industrialId: industrial.id,
        quantity: quantity,
        userId: user.id
      };

      const response = await fetch(`http://localhost:8080/api/industrial/${industrial.id}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(purchaseData),
      });

      if (response.ok) {
        const message = await response.text();
        alert(message || 'Item added to cart successfully!');
        if (onPurchaseSuccess) {
          onPurchaseSuccess();
        }
      } else {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Failed to purchase item');
      }
    } catch (error) {
      console.error('Error purchasing item:', error);
      alert(`Failed to add item to cart: ${error.message}`);
    } finally {
      setIsPurchasing(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const truncateDescription = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getStockStatus = () => {
    if (!industrial.inStock || industrial.stock <= 0) {
      return { text: 'Out of Stock', className: 'bg-red-100 text-red-800' };
    } else if (industrial.stock <= 5) {
      return { text: 'Low Stock', className: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { text: 'In Stock', className: 'bg-green-100 text-green-800' };
    }
  };

  const stockStatus = getStockStatus();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden">
        {industrial.imageUrls && industrial.imageUrls.length > 0 ? (
          <img
            src={industrial.imageUrls[0]}
            alt={industrial.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.target.src = '/images/default-industrial.jpg';
            }}
          />
        ) : (
          <div className="h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
            <div className="text-4xl text-white">🔧</div>
          </div>
        )}
        
        {/* Stock Badge */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${stockStatus.className}`}>
            {stockStatus.text}
          </span>
        </div>
      </div>

      <div className="p-4">
        {/* Product Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {industrial.name}
        </h3>
        
        {/* Category */}
        {industrial.category && (
          <div className="mb-2">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {industrial.category}
            </span>
          </div>
        )}
        
        {/* Description */}
        {industrial.description && (
          <div className="mb-3">
            <p className="text-gray-600 text-sm">
              {showFullDescription 
                ? industrial.description 
                : truncateDescription(industrial.description)
              }
            </p>
            {industrial.description.length > 100 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-blue-600 text-xs hover:underline mt-1"
              >
                {showFullDescription ? 'Show Less' : 'Read More'}
              </button>
            )}
          </div>
        )}

        {/* Rating and Sales Info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {industrial.rating > 0 && (
              <div className="flex items-center">
                <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-1">
                  {industrial.rating.toFixed(1)}
                </span>
              </div>
            )}
            {industrial.reviewCount > 0 && (
              <span className="text-xs text-gray-500">
                ({industrial.reviewCount} reviews)
              </span>
            )}
          </div>
          
          {industrial.soldCount > 0 && (
            <span className="text-xs text-gray-600">
              <span className="font-medium text-blue-600">{industrial.soldCount}</span> sold
            </span>
          )}
        </div>

        {/* Stock Information */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">
            Stock: <span className="font-medium">{industrial.stock}</span>
          </span>
          {industrial.district && (
            <div className="flex items-center text-xs text-gray-500">
              <TruckIcon className="h-3 w-3 mr-1" />
              {industrial.district}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-bold text-blue-600">
            {formatPrice(industrial.price)}
          </span>
        </div>

        {/* Quantity Selector and Add to Cart */}
        <div className="space-y-3">
          {industrial.inStock && industrial.stock > 0 && (
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Qty:</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                {Array.from({ length: Math.min(10, industrial.stock) }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button 
            onClick={handlePurchase}
            disabled={isPurchasing || !industrial.inStock || industrial.stock <= 0}
            className={`w-full px-4 py-2 rounded-md font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
              isPurchasing || !industrial.inStock || industrial.stock <= 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
            }`}
          >
            <ShoppingCartIcon className="h-4 w-4" />
            <span>
              {isPurchasing 
                ? 'Adding...' 
                : !industrial.inStock || industrial.stock <= 0
                ? 'Out of Stock'
                : 'Add to Cart'
              }
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndustrialStuffCard;
