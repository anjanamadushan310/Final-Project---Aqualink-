import React, { useState, useEffect } from 'react';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock order data with BOTH product reviews AND delivery reviews
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
      deliveryPersonPhone: '0771234567',
      products: [
        {
          id: 'P001',
          name: 'Gold Fish',
          quantity: 5,
          unitPrice: 500,
          totalPrice: 2500,
          image: '/images/goldfish.jpg',
          productReview: {
            rating: 5,
            comment: 'Beautiful and healthy fish! Exactly as described. Very satisfied with quality.',
            reviewDate: '2025-09-02T10:00:00'
          }
        },
        {
          id: 'P002',
          name: 'Aquarium Filter (Premium)',
          quantity: 1,
          unitPrice: 3500,
          totalPrice: 3500,
          image: '/images/filter.jpg',
          productReview: {
            rating: 4,
            comment: 'Good quality filter. Works well but slightly noisy.',
            reviewDate: '2025-09-02T10:15:00'
          }
        }
      ],
      deliveryReview: {
        rating: 5,
        comment: 'Excellent delivery service! Fish arrived in perfect condition. Very careful handling and on time delivery.',
        reviewDate: '2025-09-01T19:00:00'
      }
    },
    {
      id: 2,
      orderId: 'ORD002',
      orderDate: '2025-09-02',
      deliveryDate: '2025-09-02T16:45:00',
      status: 'DELIVERED',
      totalAmount: 4200,
      deliveryFee: 1500,
      orderTotal: 2700,
      deliveryPerson: 'Kamal Express Delivery',
      deliveryPersonPhone: '0779876543',
      products: [
        {
          id: 'P003',
          name: 'Fish Food Premium (500g)',
          quantity: 2,
          unitPrice: 750,
          totalPrice: 1500,
          image: '/images/fishfood.jpg',
          productReview: {
            rating: 4,
            comment: 'Good quality food. Fish seem to like it. Will order again.',
            reviewDate: '2025-09-03T09:00:00'
          }
        },
        {
          id: 'P004',
          name: 'Water Conditioner',
          quantity: 1,
          unitPrice: 1200,
          totalPrice: 1200,
          image: '/images/conditioner.jpg',
          productReview: null // No review yet
        }
      ],
      deliveryReview: {
        rating: 3,
        comment: 'Delivery was a bit delayed but items arrived safely. Could improve timing.',
        reviewDate: '2025-09-02T17:30:00'
      }
    },
    {
      id: 3,
      orderId: 'ORD003',
      orderDate: '2025-09-03',
      deliveryDate: null,
      status: 'IN_TRANSIT',
      totalAmount: 25200,
      deliveryFee: 2200,
      orderTotal: 23000,
      deliveryPerson: 'Express Tank Delivery',
      deliveryPersonPhone: '0712345678',
      products: [
        {
          id: 'P005',
          name: 'Large Aquarium Tank (100L)',
          quantity: 1,
          unitPrice: 15000,
          totalPrice: 15000,
          image: '/images/tank.jpg',
          productReview: null // Order not delivered yet
        },
        {
          id: 'P006',
          name: 'Wooden Aquarium Stand',
          quantity: 1,
          unitPrice: 8000,
          totalPrice: 8000,
          image: '/images/stand.jpg',
          productReview: null // Order not delivered yet
        }
      ],
      deliveryReview: null // Order not delivered yet
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
      case 'IN_TRANSIT': return 'bg-blue-500';
      case 'PROCESSING': return 'bg-yellow-500';
      case 'CANCELLED': return 'bg-red-500';
      default: return 'bg-gray-500';
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
          <p className="text-gray-600">Loading your orders...</p>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Order History</h1>
              <p className="text-gray-600">Track your orders and view your product reviews</p>
            </div>
            
            {/* Order Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-4 lg:mt-0">
              <div className="bg-green-50 p-3 rounded-lg text-center border border-green-200">
                <div className="text-2xl font-bold text-green-800">
                  {orders.filter(o => o.status === 'DELIVERED').length}
                </div>
                <div className="text-xs text-green-600">Delivered</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-200">
                <div className="text-2xl font-bold text-blue-800">
                  {orders.filter(o => o.status === 'IN_TRANSIT').length}
                </div>
                <div className="text-xs text-blue-600">In Transit</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-200">
                <div className="text-2xl font-bold text-gray-800">{orders.length}</div>
                <div className="text-xs text-gray-600">Total Orders</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
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
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Orders</option>
                <option value="DELIVERED">Delivered</option>
                <option value="IN_TRANSIT">In Transit</option>
                <option value="PROCESSING">Processing</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterStatus('all');
                  setSearchTerm('');
                }}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-200"
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
                        <p className="text-sm text-gray-500">
                          Delivery by: {order.deliveryPerson}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`px-4 py-2 rounded-full text-white font-semibold mb-2 ${getStatusColor(order.status)}`}>
                        {order.status}
                      </div>
                      <div className="text-2xl font-bold text-blue-600">{formatPrice(order.totalAmount)}</div>
                      <div className="text-sm text-gray-600">Total Amount</div>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
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
                        <span className="text-gray-900">Total Paid:</span>
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

export default OrderHistory;
