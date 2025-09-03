import React, { useState, useEffect } from 'react';

const CustomerOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  // Mock order history
  const mockOrders = [
    {
      id: 1,
      orderId: 'ORD001',
      items: [{ name: 'Gold Fish', quantity: 5 }, { name: 'Aquarium Filter', quantity: 1 }],
      totalAmount: 7200,
      status: 'DELIVERED',
      orderDate: '2025-09-02T08:00:00',
      deliveredDate: '2025-09-02T11:15:00',
      rating: 5,
      feedback: 'Excellent service! Fish arrived healthy and happy.',
      confirmationCode: 'ABC123',
      deliveryPersonName: 'Kamal Perera'
    },
    {
      id: 2,
      orderId: 'ORD002',
      items: [{ name: 'Tropical Fish Mix', quantity: 8 }],
      totalAmount: 5500,
      status: 'DELIVERED',
      orderDate: '2025-09-01T14:00:00',
      deliveredDate: '2025-09-01T16:30:00',
      rating: 4,
      feedback: 'Good delivery, slight delay but fish were in good condition.',
      confirmationCode: 'XYZ789',
      deliveryPersonName: 'Saman Fernando'
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <svg
        key={index}
        className={`h-4 w-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
          <p className="text-gray-600">View your past fish deliveries and experiences</p>
        </div>

        {/* Orders */}
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Order #{order.orderId}</h3>
                  <p className="text-sm text-gray-600">{formatDate(order.orderDate)}</p>
                </div>
                <div className="text-right">
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {order.status}
                  </div>
                  <div className="text-lg font-bold text-green-600 mt-1">{formatPrice(order.totalAmount)}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Items Ordered</h4>
                  <div className="space-y-1">
                    {order.items.map((item, index) => (
                      <p key={index} className="text-gray-700">
                        {item.name} x{item.quantity}
                      </p>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Delivery Details</h4>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-700">Delivered by: {order.deliveryPersonName}</p>
                    <p className="text-gray-700">Delivered: {formatDate(order.deliveredDate)}</p>
                    <p className="text-gray-700">
                      Confirmation: <span className="font-mono font-bold">{order.confirmationCode}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Rating and Feedback */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Your Review</h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex">{renderStars(order.rating)}</div>
                      <span className="text-sm text-gray-600">({order.rating}/5)</span>
                    </div>
                  </div>
                </div>
                {order.feedback && (
                  <p className="text-gray-700 italic mt-2">"{order.feedback}"</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerOrderHistory;
