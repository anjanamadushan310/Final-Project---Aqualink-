import React, { useState } from 'react';
import OrdersManagement from './../../components/shopowner/OrdersManagement';
import Sidebar from '../../components/shopowner/Sidebar';
import QuoteAcceptance from './../../components/shopowner/QuoteAcceptance';
import DeliveryQuoteRequest from './../../components/shopowner/DeliveryQuoteRequest';
import Cart from '../../components/shopowner/Cart';



const ShopOwnerDashboard= () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderComponent = () => {
    switch (activeComponent) {
      
      case 'orders': return <OrdersManagement/>;
      case 'Cart': return <Cart/>;
      case 'delivery-quoteRequest': return <DeliveryQuoteRequest/>;
      case 'quote-acceptance': return <QuoteAcceptance />;
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

