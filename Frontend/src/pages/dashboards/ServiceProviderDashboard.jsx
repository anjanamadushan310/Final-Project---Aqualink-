import React, { useState } from 'react';
import Sidebar from '../../components/serviceprovider/Sidebar';
import ServiceHistory from '../../components/serviceprovider/ServiceHistory';
import ServiceRequests from './../../components/serviceprovider/ServiceRequests';



const ServiceProviderDashboard= () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderComponent = () => {
    switch (activeComponent) {
      
      case 'fish-order': return <ServiceRequests />;
      case 'service-history': return <ServiceHistory />;
      default: return <ServiceRequests />;
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

export default ServiceProviderDashboard;

