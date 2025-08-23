import React, { useState } from 'react';
import Sidebar from '../../components/deliveryperson/Sidebar';
import DeliveryHistory from '../../components/deliveryperson/DeliveryHistory';
import DeliveryTasks from '../../components/deliveryperson/DeliveryTasks';
import RoutePlanning from '../../components/deliveryperson/RoutePlanning';


const DeliveryPersonDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderComponent = () => {
    switch (activeComponent) {
      case 'delivery-tasks': return <DeliveryTasks />;
      case 'delivery-history': return <DeliveryHistory />;
      case 'route-planning': return <RoutePlanning />;
      default: return <DeliveryTasks />;
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

