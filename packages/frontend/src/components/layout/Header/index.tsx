

import React, { useState } from 'react';
import { Bell, Menu, Search, User, LogOut } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { selectCurrentUser, logout } from '../../../features/auth/authSlice';
import { useRouter } from 'next/router';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const toggleProfileMenu = () => setIsProfileOpen(prev => !prev);

const handleLogout = async () => {
  dispatch(logout());
  //await new Promise((res) => setTimeout(res, 2000));
  console.log("Redirecting to login...");
  window.location.href = "/auth/login"; // always works
};


  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left section */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="p-1 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 lg:hidden"
          >
            <Menu size={24} />
          </button>
          
          {/* Search */}
          <div className="relative ml-4 hidden md:block">
            {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div> */}
            {/* <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            /> */}
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          {/* <button className="p-1 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
          </button> */}

          {/* User profile */}
          {/* <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              <User size={16} />
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
              John Doe
            </span>
          </div> */}

           {/* User profile */}
          <div className="relative">
            <div
              className="flex items-center cursor-pointer"
              onClick={toggleProfileMenu}
            >
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                <User size={16} />
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
               {user ? `${user.firstName} ${user.lastName}` : ''}
              </span>
            </div>

            {/* Profile submenu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;




