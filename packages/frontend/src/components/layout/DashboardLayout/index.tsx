'use client';
import React from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    // <div className="flex h-screen bg-gray-100">
    <div className="flex h-screen bg-gray-100 relative">
      {/* Background Image */}
    
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Main content */}
          <div
  className="absolute inset-0 bg-center bg-no-repeat bg-contain pointer-events-none"
  style={{ backgroundImage: "url('/logo.jfif')", opacity: 0.03 }}
/>
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
