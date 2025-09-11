import React from 'react';

const ServiceCard = ({ service, onBookingSuccess }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
        <div className="text-4xl text-white">🛠️</div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
        <p className="text-gray-600 mb-4">{service.description}</p>
        
        {/* Review Rate Section */}
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400 mr-2">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < Math.floor(service.reviewRate || 0) ? "text-yellow-400" : "text-gray-300"}>
                ⭐
              </span>
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {service.reviewRate ? service.reviewRate.toFixed(1) : '0.0'} 
            ({service.reviewCount || 0} reviews)
          </span>
        </div>

        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-500">{service.category}</span>
          <span className="text-lg font-bold text-green-600">
            from {service.price}
          </span>
        </div>
        <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
          Book Service
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
