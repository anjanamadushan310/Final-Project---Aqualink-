import React, { useState, useEffect } from 'react';

const EarningsTracker = () => {
  const [earnings, setEarnings] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('month');

  // Mock earnings data
  const mockEarnings = {
    today: {
      total: 4500,
      deliveries: 8,
      distance: 125,
      avgPerDelivery: 562.5
    },
    week: {
      total: 28000,
      deliveries: 45,
      distance: 850,
      avgPerDelivery: 622.22
    },
    month: {
      total: 125000,
      deliveries: 180,
      distance: 3200,
      avgPerDelivery: 694.44
    },
    year: {
      total: 1250000,
      deliveries: 2100,
      distance: 35000,
      avgPerDelivery: 595.24
    }
  };

  const mockTransactions = [
    {
      id: 1,
      orderId: 'ORD001',
      customerName: 'Saman Perera',
      amount: 1200,
      distance: 15,
      date: '2025-09-03T11:15:00',
      status: 'COMPLETED',
      paymentMethod: 'CASH'
    },
    {
      id: 2,
      orderId: 'ORD002',
      customerName: 'Kamal Silva',
      amount: 1500,
      distance: 25,
      date: '2025-09-03T10:30:00',
      status: 'COMPLETED',
      paymentMethod: 'DIGITAL'
    },
    {
      id: 3,
      orderId: 'ORD003',
      customerName: 'Nimal Fernando',
      amount: 2200,
      distance: 35,
      date: '2025-09-02T16:45:00',
      status: 'COMPLETED',
      paymentMethod: 'CASH'
    },
    {
      id: 4,
      orderId: 'ORD004',
      customerName: 'Priya Jayawardena',
      amount: 1800,
      distance: 45,
      date: '2025-09-02T12:30:00',
      status: 'PENDING',
      paymentMethod: 'DIGITAL'
    },
    {
      id: 5,
      orderId: 'ORD005',
      customerName: 'Ruwan Wickramasinghe',
      amount: 900,
      distance: 12,
      date: '2025-09-01T17:20:00',
      status: 'COMPLETED',
      paymentMethod: 'CASH'
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setEarnings(mockEarnings);
      setTransactions(mockTransactions);
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

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-500';
      case 'PENDING': return 'bg-yellow-500';
      case 'CANCELLED': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const currentEarnings = earnings[dateFilter] || {};

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Earnings Overview</h3>
          <div className="flex space-x-2">
            {['today', 'week', 'month', 'year'].map((period) => (
              <button
                key={period}
                onClick={() => setDateFilter(period)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition duration-200 ${
                  dateFilter === period
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Total Earnings</p>
                <p className="text-2xl font-bold text-green-800">{formatPrice(currentEarnings.total || 0)}</p>
              </div>
              <div className="bg-green-200 p-3 rounded-lg">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Deliveries</p>
                <p className="text-2xl font-bold text-blue-800">{currentEarnings.deliveries || 0}</p>
              </div>
              <div className="bg-blue-200 p-3 rounded-lg">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V7M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Distance (km)</p>
                <p className="text-2xl font-bold text-purple-800">{currentEarnings.distance || 0}</p>
              </div>
              <div className="bg-purple-200 p-3 rounded-lg">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Avg per Delivery</p>
                <p className="text-2xl font-bold text-orange-800">{formatPrice(currentEarnings.avgPerDelivery || 0)}</p>
              </div>
              <div className="bg-orange-200 p-3 rounded-lg">
                <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
              View All
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {transactions.slice(0, 10).map(transaction => (
            <div key={transaction.id} className="px-6 py-4 hover:bg-gray-50 transition duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Order #{transaction.orderId}</p>
                    <p className="text-sm text-gray-600">{transaction.customerName}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatPrice(transaction.amount)}</p>
                    <p className="text-sm text-gray-600">{transaction.distance} km</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{formatDate(transaction.date)}</p>
                    <p className="text-sm text-gray-600">{formatTime(transaction.date)}</p>
                  </div>

                  <div className="flex flex-col items-end space-y-1">
                    <div className={`${getStatusColor(transaction.status)} text-white px-2 py-1 rounded-full text-xs font-semibold`}>
                      {transaction.status}
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      transaction.paymentMethod === 'CASH' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {transaction.paymentMethod}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cash Payments</span>
              <span className="font-semibold text-gray-900">
                {formatPrice(transactions.filter(t => t.paymentMethod === 'CASH' && t.status === 'COMPLETED').reduce((sum, t) => sum + t.amount, 0))}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Digital Payments</span>
              <span className="font-semibold text-gray-900">
                {formatPrice(transactions.filter(t => t.paymentMethod === 'DIGITAL' && t.status === 'COMPLETED').reduce((sum, t) => sum + t.amount, 0))}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total Completed</span>
                <span className="font-bold text-green-600">
                  {formatPrice(transactions.filter(t => t.status === 'COMPLETED').reduce((sum, t) => sum + t.amount, 0))}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completed Deliveries</span>
              <span className="font-semibold text-gray-900">
                {transactions.filter(t => t.status === 'COMPLETED').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending Payments</span>
              <span className="font-semibold text-yellow-600">
                {transactions.filter(t => t.status === 'PENDING').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Success Rate</span>
              <span className="font-semibold text-green-600">
                {((transactions.filter(t => t.status === 'COMPLETED').length / transactions.length) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsTracker;
