import React, { useState } from 'react';
import Sidebar from '../../components/farmowner/Sidebar';
import FishStockManagement from '../../components/farmowner/FishStockManagement';
import FishOrders from './../../components/farmowner/FishOrders';
import FishAdsForm from '../../components/farmowner/FishAdsForm';



const FarmOwnerDashboard= () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderComponent = () => {
    switch (activeComponent) {
      
      case 'fish-order': return <FishOrders />;
      case 'fish-stock-management': return <FishStockManagement />;
      case 'fish-ads-form': return <FishAdsForm />;
      default: return <FishOrders />;
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

export default FarmOwnerDashboard;

