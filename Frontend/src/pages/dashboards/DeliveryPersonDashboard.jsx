import React, { useState } from 'react';
import Sidebar from '../../components/deliveryperson/Sidebar';
import DeliveryHistory from '../../components/deliveryperson/DeliveryHistory';
import DeliveryRequests from '../../components/deliveryperson/DeliveryRequests';
import QuoteManagement from '../../components/deliveryperson/QuoteManagement';
import CoverageAreaManagement from '../../components/deliveryperson/CoverageAreaManagement';
import EarningsTracker from '../../components/deliveryperson/EarningsTracker';
import CurrentDeliveries from '../../components/deliveryperson/CurrentDeliveries';



const DeliveryPersonDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');DeliveryHistory
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderComponent = () => {
    switch (activeComponent) {
      case 'delivery-requests': return <DeliveryRequests />;
      case 'delivery-history': return <DeliveryHistory />;
      case 'quote-management': return <QuoteManagement />;
      case 'coverage-area-management': return <CoverageAreaManagement />;
      case 'earnings-tracker': return <EarningsTracker />;
      case 'current-deliveries': return <CurrentDeliveries />;
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

