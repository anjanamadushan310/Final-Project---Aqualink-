import React, { useState } from 'react';
import OrdersManagement from './../../components/shopowner/OrdersManagement';
import OrdersHistory from './../../components/shopowner/OrdersHistory';
import Sidebar from '../../components/shopowner/Sidebar';
import DeliveryTracking from '../../components/shopowner/DeliveryTracking';



const ShopOwnerDashboard= () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderComponent = () => {
    switch (activeComponent) {
      
      case 'orders': return <OrdersManagement/>;
      case 'orders-history': return <OrdersHistory />;
      case 'delivery-tracking': return <DeliveryTracking />;
      default: return <OrdersManagement />;
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

export default ShopOwnerDashboard;

