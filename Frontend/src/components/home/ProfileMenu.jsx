import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { User, Briefcase, LogOut } from 'lucide-react';

// ProfileMenu rendered in a portal to avoid clipping by ancestor overflow
export default function ProfileMenu({ open, anchorRef, user, onClose, onProfileClick, onDashboardSelect, onLogout }) {
  const menuRef = useRef(null);
  const [style, setStyle] = useState({});

  // Position the menu relative to the anchor's bounding rect but use fixed positioning
  useEffect(() => {
    if (!open) return;
    const updatePosition = () => {
      const anchor = anchorRef?.current;
      const rect = anchor ? anchor.getBoundingClientRect() : null;
      const right = rect ? window.innerWidth - rect.right : 16;
      const top = rect ? rect.bottom + 8 : 80;
      setStyle({ position: 'fixed', top: `${top}px`, right: `${right}px`, zIndex: 9999, width: '18rem' });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, anchorRef]);

  // Close on outside click or escape
  useEffect(() => {
    if (!open) return;
    const handleOutside = (e) => {
      const menuEl = menuRef.current;
      const anchorEl = anchorRef?.current;
      if (menuEl && !menuEl.contains(e.target) && anchorEl && !anchorEl.contains(e.target)) {
        onClose();
      }
    };
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  const menu = (
    <div
      ref={menuRef}
      style={style}
      className="bg-white rounded-xl shadow-2xl border border-gray-100 py-3 backdrop-blur-sm max-h-[calc(100vh-100px)] overflow-y-auto"
    >
      {/* User Info Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          {user?.logoUrl ? (
            <img src={user.logoUrl} alt="Profile" className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100" />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">{user?.email}</p>
            <p className="text-xs text-gray-500">{user?.businessName || 'Welcome to AquaLink'}</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        <button onClick={() => { onProfileClick(); onClose(); }} className="flex items-center w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 text-gray-700 transition-all duration-200 group">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium">My Profile</p>
            <p className="text-xs text-gray-500">Manage your account settings</p>
          </div>
        </button>

        {user?.roles && user.roles.length > 0 && (
          <>
            <div className="px-4 py-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Dashboards</p>
            </div>
            {user.roles.map((role) => (
              <button key={role} onClick={() => { onDashboardSelect(role); onClose(); }} className="flex items-center w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 text-gray-700 transition-all duration-200 group">
                <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-cyan-200 transition-colors">
                  <Briefcase className="w-4 h-4 text-cyan-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {role === 'SHOP_OWNER' ? 'Shop Owner' : role === 'FARM_OWNER' ? 'Farm Owner' : role === 'EXPORTER' ? 'Exporter' : role === 'SERVICE_PROVIDER' ? 'Service Provider' : role === 'INDUSTRIAL_STUFF_SELLER' ? 'Industrial Seller' : role === 'DELIVERY_PERSON' ? 'Delivery Person' : role === 'ADMIN' ? 'Administrator' : role}
                  </p>
                  <p className="text-xs text-gray-500">Access your dashboard</p>
                </div>
              </button>
            ))}
          </>
        )}
      </div>

      {/* Logout */}
      <div className="border-t border-gray-100 pt-2">
        <button onClick={() => { onLogout(); onClose(); }} className="flex items-center w-full px-4 py-3 text-left hover:bg-red-50 text-red-600 transition-all duration-200 group">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors">
            <LogOut className="w-4 h-4 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium">Sign Out</p>
            <p className="text-xs text-gray-500">Logout from your account</p>
          </div>
        </button>
      </div>
    </div>
  );

  return createPortal(menu, document.body);
}
