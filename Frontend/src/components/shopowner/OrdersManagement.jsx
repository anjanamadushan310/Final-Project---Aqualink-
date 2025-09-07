import React, { useState, useEffect } from 'react';

// Toggle Button Group Component
const ToggleButtonGroup = ({ options, selected, onChange }) => {
  return (
    <div className="inline-flex rounded-md shadow-sm" role="group">
      {options.map(({ value, label }, index) => {
        const isFirst = index === 0;
        const isLast = index === options.length - 1;
        
        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={`
              px-4 py-2 text-sm font-medium border focus:outline-none focus:z-10
              ${isFirst ? 'rounded-l-md' : ''} 
              ${isLast ? 'rounded-r-md' : ''} 
              ${!isFirst ? '-ml-px' : ''}
              ${selected === value 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }
            `}
            aria-pressed={selected === value}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock order data - Customer UI
  const mockOrders = [
    {
      id: 1,
      orderId: 'ORD001',
      orderDate: '2025-09-01',
      deliveryDate: '2025-09-01T18:30:00',
      status: 'DELIVERED',
      totalAmount: 7200,
      deliveryFee: 1200,
      orderTotal: 6000,
      deliveryPerson: 'Saman Delivery Service',
      products: [
        {
          id: 'P001',
          name: 'Gold Fish',
          quantity: 5,
          unitPrice: 500,
          totalPrice: 2500,
          productReview: {
            rating: 5,
            comment: 'Beautiful and healthy fish! Exactly as described.',
            reviewDate: '2025-09-02T10:00:00'
          }
        },
        {
          id: 'P002',
          name: 'Aquarium Filter (Premium)',
          quantity: 1,
          unitPrice: 3500,
          totalPrice: 3500,
          productReview: {
            rating: 4,
            comment: 'Good quality filter. Works well but slightly noisy.',
            reviewDate: '2025-09-02T10:15:00'
          }
        }
      ],
      deliveryReview: {
        rating: 5,
        comment: 'Excellent delivery service! Fish arrived in perfect condition.',
        reviewDate: '2025-09-01T19:00:00'
      }
    },
    {
      id: 2,
      orderId: 'ORD002',
      orderDate: '2025-09-03',
      deliveryDate: null,
      status: 'SHIPPED',
      totalAmount: 12500,
      deliveryFee: 2500,
      orderTotal: 10000,
      trackingNumber: 'TRK123456789',
      deliveryPerson: 'Express Delivery Co.',
      estimatedDelivery: '2025-09-07',
      shippedDate: '2025-09-05T14:30:00',
      confirmationCode: 'XYZ98765', // Code for customer to give to delivery person
      products: [
        {
          id: 'P010',
          name: 'Complete Aquarium Kit (50L)',
          quantity: 1,
          unitPrice: 8000,
          totalPrice: 8000,
          productReview: null
        },
        {
          id: 'P011',
          name: 'Aquarium Heater (100W)',
          quantity: 1,
          unitPrice: 2000,
          totalPrice: 2000,
          productReview: null
        }
      ],
      deliveryReview: null
    },
    {
      id: 3,
      orderId: 'ORD003',
      orderDate: '2025-09-06',
      deliveryDate: null,
      status: 'SHIPPED',
      totalAmount: 8900,
      deliveryFee: 1400,
      orderTotal: 7500,
      trackingNumber: 'TRK987654321',
      deliveryPerson: 'Quick Delivery Service',
      estimatedDelivery: '2025-09-08',
      shippedDate: '2025-09-06T10:15:00',
      confirmationCode: 'qqq', // No confirmation code yet
      products: [
        {
          id: 'P008',
          name: 'Aquarium LED Light',
          quantity: 1,
          unitPrice: 4500,
          totalPrice: 4500,
          productReview: null
        },
        {
          id: 'P009',
          name: 'Aquarium Gravel (5kg)',
          quantity: 3,
          unitPrice: 1000,
          totalPrice: 3000,
          productReview: null
        }
      ],
      deliveryReview: null
    },
    {
      id: 4,
      orderId: 'ORD004',
      orderDate: '2025-09-04',
      deliveryDate: null,
      status: 'PROCESSING',
      totalAmount: 4200,
      deliveryFee: 1500,
      orderTotal: 2700,
      estimatedProcessing: '2025-09-07',
      products: [
        {
          id: 'P003',
          name: 'Fish Food Premium (500g)',
          quantity: 2,
          unitPrice: 750,
          totalPrice: 1500,
          productReview: null
        },
        {
          id: 'P004',
          name: 'Water Conditioner',
          quantity: 1,
          unitPrice: 1200,
          totalPrice: 1200,
          productReview: null
        }
      ],
      deliveryReview: null
    },
    {
      id: 5,
      orderId: 'ORD005',
      orderDate: '2025-08-28',
      deliveryDate: null,
      status: 'CANCELLED',
      totalAmount: 3500,
      deliveryFee: 800,
      orderTotal: 2700,
      cancellationReason: 'Customer requested cancellation - Item out of stock',
      cancellationDate: '2025-08-29T10:00:00',
      refundAmount: 3500,
      refundStatus: 'PROCESSED',
      products: [
        {
          id: 'P007',
          name: 'Rare Betta Fish',
          quantity: 2,
          unitPrice: 1350,
          totalPrice: 2700,
          productReview: null
        }
      ],
      deliveryReview: null
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 800);
  }, []);

  const formatPrice = (price) => {
    return `Rs.${parseFloat(price).toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    return new Date(dateTimeString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-500';
      case 'SHIPPED': return 'bg-blue-500';
      case 'CONFIRMED': return 'bg-indigo-500';
      case 'PROCESSING': return 'bg-yellow-500';
      case 'CANCELLED': return 'bg-red-500';
      case 'REFUNDED': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'DELIVERED': return '✅';
      case 'SHIPPED': return '🚚';
      case 'CONFIRMED': return '✅';
      case 'PROCESSING': return '🔄';
      case 'CANCELLED': return '❌';
      case 'REFUNDED': return '💰';
      default: return '📦';
    }
  };

  const renderStars = (rating) => {
    if (!rating) return <span className="text-gray-400">No rating</span>;
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`h-4 w-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = !searchTerm || 
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.products.some(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
              <p className="text-gray-600">Manage and track your order history with reviews</p>
            </div>
            
            {/* Order Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 lg:mt-0">
              <div className="bg-green-50 p-3 rounded-lg text-center border border-green-200">
                <div className="text-2xl font-bold text-green-800">
                  {orders.filter(o => o.status === 'DELIVERED').length}
                </div>
                <div className="text-xs text-green-600">✅ Delivered</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-200">
                <div className="text-2xl font-bold text-blue-800">
                  {orders.filter(o => ['SHIPPED', 'CONFIRMED', 'PROCESSING'].includes(o.status)).length}
                </div>
                <div className="text-xs text-blue-600">🔄 Active</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg text-center border border-red-200">
                <div className="text-2xl font-bold text-red-800">
                  {orders.filter(o => o.status === 'CANCELLED').length}
                </div>
                <div className="text-xs text-red-600">❌ Cancelled</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-200">
                <div className="text-2xl font-bold text-gray-800">{orders.length}</div>
                <div className="text-xs text-gray-600">📦 Total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Orders</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search by order ID or product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <ToggleButtonGroup
                options={[
                  { value: 'all', label: 'All Orders' },
                  { value: 'DELIVERED', label: '✅ Delivered' },
                  { value: 'SHIPPED', label: '🚚 Shipped' },
                  { value: 'PROCESSING', label: '🔄 Processing' },
                  { value: 'CANCELLED', label: '❌ Cancelled' }
                ]}
                selected={filterStatus}
                onChange={setFilterStatus}
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterStatus('all');
                  setSearchTerm('');
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your filters to see more results.'
                  : 'Your orders will appear here once you make a purchase.'
                }
              </p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-3 rounded-xl">
                        <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Order #{order.orderId}</h3>
                        <p className="text-gray-600">Ordered: {formatDate(order.orderDate)}</p>
                        {order.deliveryDate && (
                          <p className="text-sm text-gray-500">
                            Delivered: {formatDateTime(order.deliveryDate)}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`px-4 py-2 rounded-full text-white font-semibold mb-2 ${getStatusColor(order.status)} flex items-center space-x-2`}>
                        <span>{getStatusIcon(order.status)}</span>
                        <span>{order.status.replace('_', ' ')}</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">{formatPrice(order.totalAmount)}</div>
                      <div className="text-sm text-gray-600">Total Amount</div>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Status-Specific Information */}
                  {order.status === 'CANCELLED' && (
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                        <svg className="h-5 w-5 mr-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        ❌ Order Cancelled
                      </h4>
                      <p className="text-red-700">Reason: {order.cancellationReason}</p>
                      <p className="text-sm text-red-600">Cancelled on: {formatDateTime(order.cancellationDate)}</p>
                      {order.refundStatus === 'PROCESSED' && (
                        <p className="text-sm text-green-600 mt-2">💰 Refund of {formatPrice(order.refundAmount)} has been processed</p>
                      )}
                    </div>
                  )}

                  {/* DELIVERED Orders - Simple Success Message */}
                  {order.status === 'DELIVERED' && (
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center">
                        <svg className="h-6 w-6 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                          <h4 className="font-semibold text-green-800">✅ Order Delivered Successfully</h4>
                          <p className="text-sm text-green-700 mt-1">
                            Delivered on {formatDateTime(order.deliveryDate)} by {order.deliveryPerson}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SHIPPED Status with Confirmation Code DISPLAY for Customer */}
                  {order.status === 'SHIPPED' && (
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                        <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        🚚 Order Shipped
                      </h4>
                      <div className="space-y-3">
                        <p className="text-blue-700">Tracking Number: <span className="font-mono bg-blue-100 px-2 py-1 rounded">{order.trackingNumber}</span></p>
                        <p className="text-sm text-blue-600">Shipped on: {formatDateTime(order.shippedDate)}</p>
                        <p className="text-sm text-blue-600">Expected Delivery: {formatDate(order.estimatedDelivery)}</p>
                        
                        {/* CONFIRMATION CODE DISPLAY for Customer */}
                        {order.confirmationCode && (
                          <div className="mt-4 p-4 bg-white rounded-lg border border-blue-300">
                            <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                              <svg className="h-4 w-4 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Your Confirmation Code
                            </h5>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm text-green-600 mb-1">Provide this code to the delivery person:</p>
                                  <div className="text-2xl font-mono font-bold text-green-800 bg-green-100 px-4 py-2 rounded-md inline-block">
                                    {order.confirmationCode}
                                  </div>
                                </div>
                                <div className="text-green-600">
                                  <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {order.status === 'PROCESSING' && (
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                      <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                        <svg className="h-5 w-5 mr-2 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        🔄 Order Processing
                      </h4>
                      <p className="text-yellow-700">Your order is being prepared for shipment.</p>
                      <p className="text-sm text-yellow-600">Expected to be ready by: {formatDate(order.estimatedProcessing)}</p>
                    </div>
                  )}

                  {/* Products with PRODUCT REVIEWS */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Ordered Products ({order.products.length})
                    </h4>
                    <div className="space-y-4">
                      {order.products.map((product, index) => (
                        <div key={index} className="bg-white rounded border border-gray-200 p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{product.name}</h5>
                              <p className="text-gray-600">Quantity: {product.quantity} × {formatPrice(product.unitPrice)}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-gray-900">{formatPrice(product.totalPrice)}</div>
                            </div>
                          </div>

                          {/* PRODUCT REVIEW SECTION */}
                          <div className="border-t border-gray-200 pt-3">
                            <h6 className="font-medium text-gray-900 mb-2">Your Product Review:</h6>
                            {product.productReview ? (
                              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <div className="flex items-center mb-2">
                                  {renderStars(product.productReview.rating)}
                                  <span className="ml-3 text-sm text-gray-500">
                                    Reviewed on {formatDate(product.productReview.reviewDate)}
                                  </span>
                                </div>
                                <p className="text-gray-800 italic">"{product.productReview.comment}"</p>
                              </div>
                            ) : (
                              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                <p className="text-gray-500 text-center">
                                  {order.status === 'DELIVERED' 
                                    ? '📝 You haven\'t reviewed this product yet'
                                    : '⏳ Review will be available after delivery'
                                  }
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* DELIVERY REVIEW SECTION */}
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      Delivery Service Review
                    </h4>
                    {order.deliveryReview ? (
                      <div className="bg-white border border-green-300 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          {renderStars(order.deliveryReview.rating)}
                          <span className="ml-3 text-sm text-gray-500">
                            Reviewed on {formatDate(order.deliveryReview.reviewDate)}
                          </span>
                        </div>
                        <p className="text-gray-800 italic">"{order.deliveryReview.comment}"</p>
                        <div className="mt-3 text-sm text-gray-600">
                          <p><strong>Delivered by:</strong> {order.deliveryPerson}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <p className="text-gray-500 text-center">
                          {order.status === 'DELIVERED' 
                            ? '📝 You haven\'t reviewed the delivery service yet'
                            : '⏳ Delivery review will be available after delivery'
                          }
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Payment Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order Total:</span>
                        <span className="font-medium">{formatPrice(order.orderTotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery Fee:</span>
                        <span className="font-medium">{formatPrice(order.deliveryFee)}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-blue-200 font-bold text-lg">
                        <span className="text-gray-900">Total Amount:</span>
                        <span className="text-blue-600">{formatPrice(order.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
