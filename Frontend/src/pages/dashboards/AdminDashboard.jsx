
import React, { useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import UserVerification from '../../components/admin/UserVerification';
import ProductManagement from '../../components/admin/ProductManagement';
import UserManagement from '../../components/admin/UserManagement';
import ReviewsManagement from '../../components/admin/ReviewsManagement';
import EarningsManagement from '../../components/admin/EarningsManagement';
import BannerManagement from '../../components/admin/BannerManagement';

const AdminDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderComponent = () => {
    switch (activeComponent) {
      
      case 'user-verification': return <UserVerification />;
      case 'product-management': return <ProductManagement />;
      case 'user-management': return <UserManagement />;
      case 'reviews': return <ReviewsManagement />;
      case 'earnings': return <EarningsManagement />;
      case 'banners': return <BannerManagement />;
      default: return <UserVerification />;
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

export default AdminDashboard;
