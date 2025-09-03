import React, { useState, useEffect } from 'react';
import DeliveryRequestCard from './DeliveryRequestCard';
import QuoteModal from './QuoteModal';

const DeliveryRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  
  // Filter states
  const [districtFilter, setDistrictFilter] = useState('');
  const [townFilter, setTownFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const districts = ['Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Galle', 'Matara', 'Kurunegala'];

  // Mock data - development purposes
  const mockRequests = [
    {
      id: 1,
      orderId: 'ORD001',
      customerName: 'Saman Perera',
      customerPhone: '0771234567',
      customerEmail: 'saman@email.com',
      district: 'Colombo',
      town: 'Dehiwala',
      estimatedDistance: 15,
      deliveryAddress: '123 Main Street, Dehiwala, Colombo',
      totalItems: 5,
      totalWeight: 2.5,
      orderValue: 15000,
      hasLivefish: true,
      specialInstructions: 'Handle fish tanks carefully. Delivery between 9AM-5PM only.',
      status: 'PENDING',
      requestedAt: '2025-09-03T10:30:00',
      proposedPrice: null,
      quotedAt: null
    },
    {
      id: 2,
      orderId: 'ORD002',
      customerName: 'Kamal Silva',
      customerPhone: '0779876543',
      customerEmail: 'kamal@email.com',
      district: 'Gampaha',
      town: 'Negombo',
      estimatedDistance: 25,
      deliveryAddress: '456 Beach Road, Negombo, Gampaha',
      totalItems: 3,
      totalWeight: 1.8,
      orderValue: 8500,
      hasLivefish: false,
      specialInstructions: 'Fragile items - aquarium accessories',
      status: 'QUOTED',
      requestedAt: '2025-09-03T09:15:00',
      proposedPrice: 1500,
      quotedAt: '2025-09-03T11:20:00'
    },
    {
      id: 3,
      orderId: 'ORD003',
      customerName: 'Nimal Fernando',
      customerPhone: '0712345678',
      customerEmail: 'nimal@email.com',
      district: 'Kandy',
      town: 'Peradeniya',
      estimatedDistance: 35,
      deliveryAddress: '789 Temple Road, Peradeniya, Kandy',
      totalItems: 8,
      totalWeight: 4.2,
      orderValue: 25000,
      hasLivefish: true,
      specialInstructions: 'Large fish tank delivery. Need help carrying to second floor.',
      status: 'ACCEPTED',
      requestedAt: '2025-09-02T14:20:00',
      proposedPrice: 2200,
      quotedAt: '2025-09-02T15:45:00'
    },
    {
      id: 4,
      orderId: 'ORD004',
      customerName: 'Priya Jayawardena',
      customerPhone: '0764567890',
      customerEmail: 'priya@email.com',
      district: 'Galle',
      town: 'Hikkaduwa',
      estimatedDistance: 45,
      deliveryAddress: '321 Coral Gardens, Hikkaduwa, Galle',
      totalItems: 2,
      totalWeight: 0.8,
      orderValue: 5500,
      hasLivefish: false,
      specialInstructions: '',
      status: 'PENDING',
      requestedAt: '2025-09-03T08:00:00',
      proposedPrice: null,
      quotedAt: null
    }
  ];

  useEffect(() => {
    // Simulate API loading delay
    setTimeout(() => {
      setRequests(mockRequests);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, districtFilter, townFilter, statusFilter, searchTerm]);

  const filterRequests = () => {
    let filtered = requests;

    if (districtFilter) {
      filtered = filtered.filter(req => req.district === districtFilter);
    }

    if (townFilter) {
      filtered = filtered.filter(req => 
        req.town && req.town.toLowerCase().includes(townFilter.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(req => req.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(req => 
        (req.customerName && req.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (req.orderId && req.orderId.toString().includes(searchTerm))
      );
    }

    setFilteredRequests(filtered);
  };

  const handleCreateQuote = (request) => {
    if (!request) {
      console.error('No request data provided');
      return;
    }
    setSelectedRequest(request);
    setShowQuoteModal(true);
  };

  const handleQuoteSubmitted = (quoteData) => {
    // Update the request with new quote data
    setRequests(prevRequests => 
      prevRequests.map(req => 
        req.id === selectedRequest.id 
          ? {
              ...req,
              status: 'QUOTED',
              proposedPrice: quoteData.quotedPrice,
              quotedAt: new Date().toISOString()
            }
          : req
      )
    );
    
    setShowQuoteModal(false);
    setSelectedRequest(null);
    
    // Show success message
    alert('Quote submitted successfully!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500';
      case 'QUOTED': return 'bg-blue-500';
      case 'ACCEPTED': return 'bg-green-500';
      case 'IN_TRANSIT': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading delivery requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-lg shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Active Delivery Requests</h1>
            <p className="text-gray-600">Manage your delivery requests and create quotes</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
              <span className="font-semibold">{filteredRequests.length} Total</span>
            </div>
            <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full">
              <span className="font-semibold">
                {filteredRequests.filter(r => r.status === 'PENDING').length} Pending
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search by customer or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
              >
                <option value="">All Districts</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Town</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter town..."
                value={townFilter}
                onChange={(e) => setTownFilter(e.target.value)}
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
                <option value="QUOTED">Quoted</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="IN_TRANSIT">In Transit</option>
              </select>
            </div>
          </div>
        </div>

        {/* Request Cards */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No delivery requests found</h3>
              <p className="text-gray-600">
                {searchTerm || districtFilter || townFilter || statusFilter 
                  ? 'Try adjusting your filters to see more results.' 
                  : 'Check back later for new delivery opportunities.'
                }
              </p>
            </div>
          ) : (
            filteredRequests.map(request => (
              <DeliveryRequestCard
                key={request.id}
                request={request}
                onCreateQuote={handleCreateQuote}
                getStatusColor={getStatusColor}
              />
            ))
          )}
        </div>

        {/* Quote Modal */}
        {showQuoteModal && selectedRequest && (
          <QuoteModal
            request={selectedRequest}
            onClose={() => setShowQuoteModal(false)}
            onQuoteSubmitted={handleQuoteSubmitted}
          />
        )}
      </div>
    </div>
  );
};

export default DeliveryRequests;
