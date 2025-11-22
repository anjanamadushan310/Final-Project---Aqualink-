import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import OrdersManagement from './../../components/shopowner/OrdersManagement';
import Sidebar from '../../components/shopowner/Sidebar';
import QuoteAcceptance from './../../components/shopowner/QuoteAcceptance';
import DeliveryQuoteRequest from './../../components/shopowner/DeliveryQuoteRequest';
import Cart from '../../components/shopowner/Cart';
import MyBookings from '../../components/shopowner/MyBookings';
import DashboardFooter from '../../components/common/DashboardFooter';
import RoleBasedRoute from '../../components/common/RoleBasedRoute';
import { ROLES } from '../../utils/roleUtils';



const ShopOwnerDashboard= () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      {/* Main Content */}
      <div className="lg:ml-64 flex flex-col flex-1">
        <main className="p-4 lg:p-8 flex-1">
          <Routes>
            <Route index element={<Navigate to="orders" replace />} />
            <Route path="orders" element={
              <RoleBasedRoute allowedRoles={[ROLES.SHOP_OWNER]}>
                <OrdersManagement />
              </RoleBasedRoute>
            } />
            <Route path="cart" element={
              <RoleBasedRoute allowedRoles={[ROLES.SHOP_OWNER]}>
                <Cart />
              </RoleBasedRoute>
            } />
            <Route path="delivery-quote" element={
              <RoleBasedRoute allowedRoles={[ROLES.SHOP_OWNER]}>
                <DeliveryQuoteRequest />
              </RoleBasedRoute>
            } />
            <Route path="quote-acceptance" element={
              <RoleBasedRoute allowedRoles={[ROLES.SHOP_OWNER]}>
                <QuoteAcceptance />
              </RoleBasedRoute>
            } />
            <Route path="my-bookings" element={
              <RoleBasedRoute allowedRoles={[ROLES.SHOP_OWNER]}>
                <MyBookings />
              </RoleBasedRoute>
            } />
          </Routes>
        </main>
        
        {/* Footer */}
        <DashboardFooter />
      </div>
    </div>
  );
};

export default ShopOwnerDashboard;

