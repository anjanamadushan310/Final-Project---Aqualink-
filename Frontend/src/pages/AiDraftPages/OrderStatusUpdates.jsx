import React, { useState, useEffect } from 'react';

const OrderStatusUpdates = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Mock real-time notifications
    const mockNotifications = [
      {
        id: 1,
        type: 'quote_received',
        title: 'New Delivery Quote Received!',
        message: 'Kamal Perera sent you a quote for Rs.1200 - View and accept now',
        timestamp: '2025-09-03T10:30:00',
        orderId: 'ORD001',
        urgent: true
      },
      {
        id: 2,
        type: 'quote_accepted',
        title: 'Quote Accepted!',
        message: 'Your delivery partner Saman Fernando is preparing for pickup',
        timestamp: '2025-09-03T11:00:00',
        orderId: 'ORD002',
        urgent: false
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'quote_received':
        return (
          <div className="bg-blue-100 p-2 rounded-full">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        );
      case 'quote_accepted':
        return (
          <div className="bg-green-100 p-2 rounded-full">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Order Updates</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {notifications.map(notification => (
          <div key={notification.id} className={`p-4 hover:bg-gray-50 cursor-pointer ${
            notification.urgent ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''
          }`}>
            <div className="flex space-x-3">
              {getNotificationIcon(notification.type)}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                <p className="text-gray-500 text-xs mt-2">
                  {new Date(notification.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStatusUpdates;
