import React, { useState, useEffect } from 'react';
import QuoteCard from './QuoteCard';
import QuoteDetailsModal from './QuoteDetailsModal';
import EditQuoteModal from './EditQuoteModal';

const QuoteManagement = () => {
  const [quotes, setQuotes] = useState([]);
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Mock quotes data - development purposes
  const mockQuotes = [
    {
      id: 1,
      quoteId: 'QT001',
      orderId: 'ORD001',
      customerName: 'Saman Perera',
      customerPhone: '0771234567',
      district: 'Colombo',
      town: 'Dehiwala',
      deliveryAddress: '123 Main Street, Dehiwala',
      quotedPrice: 1200,
      estimatedTime: '2-3 hours',
      status: 'PENDING',
      createdAt: '2025-09-03T10:30:00',
      validUntil: '2025-09-04T18:00:00',
      priceBreakdown: 'Base delivery: Rs.500\nDistance (15km): Rs.750\nTotal: Rs.1200',
      specialInstructions: 'Handle with care - live fish',
      customerResponse: null,
      responseAt: null
    },
    {
      id: 2,
      quoteId: 'QT002',
      orderId: 'ORD002',
      customerName: 'Kamal Silva',
      customerPhone: '0779876543',
      district: 'Gampaha',
      town: 'Negombo',
      deliveryAddress: '456 Beach Road, Negombo',
      quotedPrice: 1500,
      estimatedTime: 'Same day',
      status: 'ACCEPTED',
      createdAt: '2025-09-02T14:20:00',
      validUntil: '2025-09-03T14:20:00',
      priceBreakdown: 'Base delivery: Rs.500\nDistance (25km): Rs.1000\nTotal: Rs.1500',
      specialInstructions: 'Fragile aquarium accessories',
      customerResponse: 'Accepted - please deliver after 3PM',
      responseAt: '2025-09-02T16:45:00'
    },
    {
      id: 3,
      quoteId: 'QT003',
      orderId: 'ORD003',
      customerName: 'Nimal Fernando',
      customerPhone: '0712345678',
      district: 'Kandy',
      town: 'Peradeniya',
      deliveryAddress: '789 Temple Road, Peradeniya',
      quotedPrice: 2200,
      estimatedTime: 'Next day',
      status: 'REJECTED',
      createdAt: '2025-09-01T09:15:00',
      validUntil: '2025-09-02T09:15:00',
      priceBreakdown: 'Base delivery: Rs.500\nDistance (35km): Rs.1500\nSpecial handling: Rs.200\nTotal: Rs.2200',
      specialInstructions: 'Large tank - need assistance',
      customerResponse: 'Price too high - looking for alternatives',
      responseAt: '2025-09-01T20:30:00'
    },
    {
      id: 4,
      quoteId: 'QT004',
      orderId: 'ORD004',
      customerName: 'Priya Jayawardena',
      customerPhone: '0764567890',
      district: 'Galle',
      town: 'Hikkaduwa',
      deliveryAddress: '321 Coral Gardens, Hikkaduwa',
      quotedPrice: 1800,
      estimatedTime: '4-5 hours',
      status: 'EXPIRED',
      createdAt: '2025-08-30T11:00:00',
      validUntil: '2025-08-31T18:00:00',
      priceBreakdown: 'Base delivery: Rs.500\nDistance (45km): Rs.1300\nTotal: Rs.1800',
      specialInstructions: 'Standard delivery',
      customerResponse: null,
      responseAt: null
    },
    {
      id: 5,
      quoteId: 'QT005',
      orderId: 'ORD005',
      customerName: 'Ruwan Wickramasinghe',
      customerPhone: '0751234567',
      district: 'Colombo',
      town: 'Moratuwa',
      deliveryAddress: '654 Station Road, Moratuwa',
      quotedPrice: 900,
      estimatedTime: '1-2 hours',
      status: 'PENDING',
      createdAt: '2025-09-03T08:45:00',
      validUntil: '2025-09-04T08:45:00',
      priceBreakdown: 'Base delivery: Rs.500\nDistance (8km): Rs.400\nTotal: Rs.900',
      specialInstructions: 'Small items only',
      customerResponse: null,
      responseAt: null
    }
  ];

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setQuotes(mockQuotes);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterAndSortQuotes();
  }, [quotes, statusFilter, dateFilter, searchTerm, sortBy]);

  const filterAndSortQuotes = () => {
    let filtered = [...quotes];

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(quote => quote.status === statusFilter);
    }

    // Date filter
    if (dateFilter) {
      const today = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(quote => 
            new Date(quote.createdAt).toDateString() === today.toDateString()
          );
          break;
        case 'week':
          filterDate.setDate(today.getDate() - 7);
          filtered = filtered.filter(quote => 
            new Date(quote.createdAt) >= filterDate
          );
          break;
        case 'month':
          filterDate.setMonth(today.getMonth() - 1);
          filtered = filtered.filter(quote => 
            new Date(quote.createdAt) >= filterDate
          );
          break;
      }
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(quote =>
        quote.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.quoteId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.orderId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'price-high':
          return b.quotedPrice - a.quotedPrice;
        case 'price-low':
          return a.quotedPrice - b.quotedPrice;
        case 'customer':
          return a.customerName.localeCompare(b.customerName);
        default:
          return 0;
      }
    });

    setFilteredQuotes(filtered);
  };

  const handleViewDetails = (quote) => {
    setSelectedQuote(quote);
    setShowDetailsModal(true);
  };

  const handleEditQuote = (quote) => {
    setSelectedQuote(quote);
    setShowEditModal(true);
  };

  const handleQuoteUpdated = (updatedQuote) => {
    setQuotes(prevQuotes =>
      prevQuotes.map(q => q.id === updatedQuote.id ? updatedQuote : q)
    );
    setShowEditModal(false);
    setSelectedQuote(null);
  };

  const handleDeleteQuote = (quoteId) => {
    if (window.confirm('Are you sure you want to delete this quote?')) {
      setQuotes(prevQuotes => prevQuotes.filter(q => q.id !== quoteId));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500';
      case 'ACCEPTED': return 'bg-green-500';
      case 'REJECTED': return 'bg-red-500';
      case 'EXPIRED': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  const getStatusCount = (status) => {
    return quotes.filter(q => q.status === status).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quotes...</p>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Quote Management</h1>
              <p className="text-gray-600">Create, track, and manage your delivery quotes</p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 lg:mt-0">
              <div className="bg-yellow-50 p-3 rounded-lg text-center border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-800">{getStatusCount('PENDING')}</div>
                <div className="text-xs text-yellow-600">Pending</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center border border-green-200">
                <div className="text-2xl font-bold text-green-800">{getStatusCount('ACCEPTED')}</div>
                <div className="text-xs text-green-600">Accepted</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg text-center border border-red-200">
                <div className="text-2xl font-bold text-red-800">{getStatusCount('REJECTED')}</div>
                <div className="text-xs text-red-600">Rejected</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-200">
                <div className="text-2xl font-bold text-gray-800">{getStatusCount('EXPIRED')}</div>
                <div className="text-xs text-gray-600">Expired</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900">Filters & Search</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search quotes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="REJECTED">Rejected</option>
                <option value="EXPIRED">Expired</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
                <option value="customer">Customer Name</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setStatusFilter('');
                  setDateFilter('');
                  setSearchTerm('');
                  setSortBy('newest');
                }}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-200 font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Quote Cards */}
        <div className="space-y-4">
          {filteredQuotes.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No quotes found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter || dateFilter 
                  ? 'Try adjusting your filters to see more results.' 
                  : 'Start creating quotes for your delivery requests.'
                }
              </p>
            </div>
          ) : (
            filteredQuotes.map(quote => (
              <QuoteCard
                key={quote.id}
                quote={quote}
                getStatusColor={getStatusColor}
                onViewDetails={handleViewDetails}
                onEditQuote={handleEditQuote}
                onDeleteQuote={handleDeleteQuote}
              />
            ))
          )}
        </div>

        {/* Modals */}
        {showDetailsModal && selectedQuote && (
          <QuoteDetailsModal
            quote={selectedQuote}
            onClose={() => setShowDetailsModal(false)}
            onEdit={() => {
              setShowDetailsModal(false);
              setShowEditModal(true);
            }}
          />
        )}

        {showEditModal && selectedQuote && (
          <EditQuoteModal
            quote={selectedQuote}
            onClose={() => setShowEditModal(false)}
            onQuoteUpdated={handleQuoteUpdated}
          />
        )}
      </div>
    </div>
  );
};

export default QuoteManagement;
