import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Home,
  FileText,
  Users,
  Package,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigationItems = [
    { name: 'Dashboard', href: '/app', icon: Home },
    { name: 'Invoices', href: '/app/invoices', icon: FileText },
    { name: 'Customers', href: '/app/customers', icon: Users },
    { name: 'Products', href: '/app/products', icon: Package },
    { name: 'Reports', href: '/app/reports', icon: BarChart3 },
    { name: 'Settings', href: '/app/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
      
      <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-xl">
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <span className="text-lg font-semibold">BillingSaaS</span>
        <Button variant="ghost" size="sm" className="p-2 rounded-full" onClick={onClose}>
  <X className="h-5 w-5" />
</Button>
        </div>
        
        <nav className="mt-4 px-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = router.pathname === item.href;
            
            return (
              <Link key={item.name} href={item.href}>
                <a
                  className={`flex items-center px-3 py-3 rounded-md text-base font-medium ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={onClose}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </a>
              </Link>
            );
          })}
        </nav>
        
        <div className="absolute bottom-0 w-full border-t border-gray-200 p-4">
          <div className="relative">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <User className="mr-2 h-4 w-4" />
              {user?.firstName}
            </Button>
            
            {showUserMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-md shadow-lg border border-gray-200">
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
