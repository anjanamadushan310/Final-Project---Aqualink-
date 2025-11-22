
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import UserVerification from '../../components/admin/UserVerification';
import ProductManagement from '../../components/admin/ProductManagement';
import UserManagement from '../../components/admin/UserManagement';
import ReviewsManagement from '../../components/admin/ReviewsManagement';
import EarningsManagement from '../../components/admin/EarningsManagement';
import BannerManagement from '../../components/admin/BannerManagement';
import StuffManagement from '../../components/admin/StuffManagement';
import ServicesManagement from '../../components/admin/ServicesManagement';
import DashboardFooter from '../../components/common/DashboardFooter';
import RoleBasedRoute from '../../components/common/RoleBasedRoute';
import { ROLES } from '../../utils/roleUtils';

const AdminDashboard = () => {
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
            <Route index element={<Navigate to="user-verification" replace />} />
            <Route path="user-verification" element={
              <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
                <UserVerification />
              </RoleBasedRoute>
            } />
            <Route path="fish-ads" element={
              <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
                <ProductManagement />
              </RoleBasedRoute>
            } />
            <Route path="stuff-management" element={
              <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
                <StuffManagement />
              </RoleBasedRoute>
            } />
            <Route path="service-management" element={
              <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
                <ServicesManagement />
              </RoleBasedRoute>
            } />
            <Route path="user-management" element={
              <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
                <UserManagement />
              </RoleBasedRoute>
            } />
            <Route path="reviews" element={
              <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
                <ReviewsManagement />
              </RoleBasedRoute>
            } />
            <Route path="earnings" element={
              <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
                <EarningsManagement />
              </RoleBasedRoute>
            } />
            <Route path="banners" element={
              <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
                <BannerManagement />
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

export default AdminDashboard;
