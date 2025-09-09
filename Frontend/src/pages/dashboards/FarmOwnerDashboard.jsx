import React, { useState } from 'react';
import Sidebar from '../../components/farmowner/Sidebar';
import FishStockManagement from '../../components/farmowner/FishStockManagement';
import FishAdsForm from '../../components/farmowner/FishAdsForm';
import FarmOwnerOrderManagement from '../../components/farmowner/FarmOwnerOrderManagement';



const FarmOwnerDashboard= () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderComponent = () => {
    switch (activeComponent) {
      
      case 'fish-order': return <FarmOwnerOrderManagement/>;
      case 'fish-stock-management': return <FishStockManagement />;
      case 'fish-ads-form': return <FishAdsForm />;
      default: return <FarmOwnerOrderManagement />;
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

