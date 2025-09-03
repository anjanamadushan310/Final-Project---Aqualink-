import React, { useState } from 'react';
import Sidebar from '../../components/deliveryperson/Sidebar';

import DeliveryRequests from '../../components/deliveryperson/DeliveryRequests';
import QuoteManagement from '../../components/deliveryperson/QuoteManagement';
import DeliveryTracking from '../../components/deliveryperson/DeliveryTracking';
import CoverageAreaManagement from '../../components/deliveryperson/CoverageAreaManagement';



const DeliveryPersonDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderComponent = () => {
    switch (activeComponent) {
      case 'delivery-requests': return <DeliveryRequests />;
     
      case 'quote-management': return <QuoteManagement />;
      case 'delivery-tracking': return <DeliveryTracking />;
      case 'coverage-area-management': return <CoverageAreaManagement />;
      default: return <DeliveryRequests />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar
        activeComponent={activeComponent}
        setActiveComponent={setActiveComponent}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      {/* Main Content */}
      <div className="lg:ml-64">
       
     
        <main className="p-4 lg:p-8">
          {renderComponent()}
        </main>
      </div>
    </div>
  );
};

export default DeliveryPersonDashboard;

