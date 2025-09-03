import React, { useState, useEffect } from 'react';
import DeliveryStatusCard from './DeliveryStatusCard';
import DeliveryConfirmationModal from './DeliveryConfirmationModal';

const DeliveryTracking = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock customer orders with delivery tracking
  const mockOrders = [
    {
      id: 1,
      orderId: 'ORD001',
      quoteId: 'QT001',
      items: [
        { name: 'Gold Fish', quantity: 5, price: 2500 },
        { name: 'Aquarium Filter', quantity: 1, price: 3500 }
      ],
      totalAmount: 6000,
      deliveryFee: 1200,
      deliveryPersonName: 'Kamal Perera',
      deliveryPersonPhone: '0771234567',
      deliveryAddress: '123 Main Street, Dehiwala, Colombo',
      estimatedDelivery: '2025-09-03T11:30:00',
      status: 'IN_TRANSIT',
      currentLocation: 'Near Dehiwala Junction',
      specialInstructions: 'Handle fish carefully - keep temperature stable',
      timeline: [
        { status: 'ORDERED', time: '2025-09-03T08:00:00', completed: true },
        { status: 'CONFIRMED', time: '2025-09-03T08:30:00', completed: true },
        { status: 'PICKED_UP', time: '2025-09-03T09:30:00', completed: true },
        { status: 'IN_TRANSIT', time: '2025-09-03T10:00:00', completed: true },
        { status: 'ARRIVED', time: null, completed: false },
        { status: 'DELIVERED', time: null, completed: false }
      ],
      confirmationRequired: false,
      confirmationCode: null
    },
    {
      id: 2,
      orderId: 'ORD002',
      quoteId: 'QT002',
      items: [
        { name: 'Tropical Fish Mix', quantity: 8, price: 4000 },
        { name: 'Fish Food Premium', quantity: 2, price: 1500 }
      ],
      totalAmount: 5500,
      deliveryFee: 1500,
      deliveryPersonName: 'Saman Fernando',
      deliveryPersonPhone: '0779876543',
      deliveryAddress: '456 Beach Road, Negombo, Gampaha',
      estimatedDelivery: '2025-09-03T14:00:00',
      status: 'ARRIVED',
      currentLocation: 'At delivery location',
      specialInstructions: 'Call before arrival',
      timeline: [
        { status: 'ORDERED', time: '2025-09-03T07:00:00', completed: true },
        { status: 'CONFIRMED', time: '2025-09-03T07:15:00', completed: true },
        { status: 'PICKED_UP', time: '2025-09-03T08:00:00', completed: true },
        { status: 'IN_TRANSIT', time: '2025-09-03T08:30:00', completed: true },
        { status: 'ARRIVED', time: '2025-09-03T12:45:00', completed: true },
        { status: 'DELIVERED', time: null, completed: false }
      ],
      confirmationRequired: true,
      confirmationCode: 'XYZ789'
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const handleConfirmDelivery = (order) => {
    setSelectedOrder(order);
    setShowConfirmationModal(true);
  };

  const submitConfirmation = (confirmationData) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === selectedOrder.id
          ? {
              ...order,
              status: 'DELIVERED',
              timeline: order.timeline.map(t =>
                t.status === 'DELIVERED'
                  ? { ...t, time: new Date().toISOString(), completed: true }
                  : t
              ),
              customerFeedback: confirmationData.feedback,
              customerRating: confirmationData.rating
            }
          : order
      )
    );
    setShowConfirmationModal(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Deliveries</h1>
          <p className="text-gray-600">Track your fish orders in real-time</p>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map(order => (
            <DeliveryStatusCard
              key={order.id}
              order={order}
              onConfirmDelivery={handleConfirmDelivery}
            />
          ))}
        </div>

        {/* Confirmation Modal */}
        {showConfirmationModal && selectedOrder && (
          <DeliveryConfirmationModal
            order={selectedOrder}
            onClose={() => setShowConfirmationModal(false)}
            onSubmit={submitConfirmation}
          />
        )}
      </div>
    </div>
  );
};

export default DeliveryTracking;
