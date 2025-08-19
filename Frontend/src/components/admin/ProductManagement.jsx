// src/components/ProductManagement.jsx
import React, { useState } from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  EyeIcon,
  PencilSquareIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const ProductManagement = () => {
  const [filter, setFilter] = useState('pending');

  const products = [
    {
      id: 1,
      name: 'Premium Goldfish',
      category: 'Freshwater Fish',
      seller: 'AquaStore Ltd.',
      price: '$25.99',
      status: 'pending',
      image: '🐠',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Neon Tetra School',
      category: 'Tropical Fish',
      seller: 'Fish Paradise',
      price: '$12.99',
      status: 'approved',
      image: '🐟',
      createdAt: '2024-01-12'
    },
    {
      id: 3,
      name: 'Betta Fish',
      category: 'Fighting Fish',
      seller: 'Tropical Haven',
      price: '$18.99',
      status: 'rejected',
      image: '🐠',
      createdAt: '2024-01-10'
    }
  ];

  const filteredProducts = products.filter(product => 
    filter === 'all' || product.status === filter
  );

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return badges[status] || badges.pending;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: '1,254', color: 'bg-blue-500' },
          { label: 'Pending Review', value: '23', color: 'bg-yellow-500' },
          { label: 'Approved', value: '1,187', color: 'bg-green-500' },
          { label: 'Rejected', value: '44', color: 'bg-red-500' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className={`w-8 h-8 ${stat.color} rounded-lg mb-2`}></div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        {['all', 'pending', 'approved', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium capitalize ${
              filter === status
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="aspect-square bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center">
              <span className="text-6xl">{product.image}</span>
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(product.status)} capitalize`}>
                  {product.status}
                </span>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{product.category}</p>
              <p className="text-sm text-gray-500 mb-2">by {product.seller}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-teal-600">{product.price}</span>
                <div className="flex space-x-1">
                  <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                    <PencilSquareIcon className="w-4 h-4" />
                  </button>
                  {product.status === 'pending' && (
                    <>
                      <button className="p-1 text-green-600 hover:bg-green-100 rounded">
                        <CheckCircleIcon className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-100 rounded">
                        <XCircleIcon className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductManagement;
