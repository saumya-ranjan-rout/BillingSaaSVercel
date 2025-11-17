'use client';
import React, { useEffect, useState } from 'react';
import { 
  Home, 
  Users, 
  FileText, 
  Settings, 
  X,
  CreditCard,
  BarChart3,
  Package,
  User
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { useApi } from "@/hooks/useApi";


interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}
interface NavItem {
  name: string;
  href?: string;
  icon: any;
  children?: { name: string; href: string }[];
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  tenantId: string;
}
const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/app/dashboard', icon: Home },
  { name: 'Users', href: '/app/users', icon: Users },
  { name: 'Customers', href: '/app/customers', icon: Users },
  { name: 'Vendors', href: '/app/vendors', icon: Users },
  { name: 'Products', href: '/app/products', icon: Package },
  { name: 'Purchases', href: '/app/purchases', icon: FileText },
  { name: 'Invoices', href: '/app/invoices', icon: FileText },
  { name: 'Billing', href: '/app/subscription', icon: CreditCard },
  { name: 'Loyalty', href: '/app/loyality', icon: BarChart3 },
  { name: 'Reports', href: '/app/reports', icon: BarChart3 },
  { name: 'Settings', href: '/app/settings', icon: Settings },

    { name: 'Request', href: '/app/professional-requests', icon: User },
  //  { name: 'Super Admin', href: '/SuperAdminPage', icon: User },
];




const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [openMenus, setOpenMenus] = useState<string[]>([]);
   const [user, setUser] = useState<User | null>(null);

const { get, patch } = useApi<any>();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await get("/api/auth/me");
       // console.log("user", res);
        setUser(res.user);

      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    fetchUser();
  }, []);



const filteredNavigation = navigation.filter((item) => {
  if (user?.role === "professional_user") {
    return item.name !== "Billing" && item.name !== "Request";
  }
  return true;
});
  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) =>
      prev.includes(menu) ? prev.filter((m) => m !== menu) : [...prev, menu]
    );
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 transform transition duration-200 ease-in-out lg:static lg:inset-0 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-gray-800">
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="Billing Software Logo"
              width={100}
              height={30}
              className="rounded-md"
            />
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white lg:hidden"
          >
            <X size={24} />
          </button>
        </div>

        {/* <nav className="mt-8">
          <div className="px-4 space-y-2">
            {navigation.map((item) => { */}
            <nav className="mt-8">
  <div className="px-4 space-y-2">
    {!user ? (
      <div className="text-gray-400 text-sm px-2">Loading...</div>
    ) : (
      filteredNavigation.map((item) => {
              const isActive = item.href && router.pathname === item.href;

              if (item.children) {
                const isOpen = openMenus.includes(item.name);

                return (
                  <div key={item.name}>
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className={cn(
                        "w-full flex items-center px-2 py-2 text-base font-medium rounded-md text-left",
                        isOpen ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "mr-4 h-6 w-6",
                          isOpen ? "text-white" : "text-gray-400 group-hover:text-white"
                        )}
                      />
                      {/* {item.name} */}
                        {item.name === "Request" ? (
    user?.role === "admin" ? (
      "Request Professional"
    ) : (
      "Request Business"
    )
  ) : (
    item.name
  )}
                    </button>

                    {isOpen && (
                      <div className="ml-8 mt-2 space-y-1">
                        {item.children.map((child) => {
                          const isChildActive = router.pathname === child.href;
                          return (
                            <Link
                              key={child.name}
                              href={child.href}
                              className={cn(
                                "block px-2 py-1 text-sm rounded-md",
                                isChildActive
                                  ? "bg-gray-800 text-white"
                                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
                              )}
                            >
                              {child.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href!}
                  className={cn(
                    "group flex items-center px-2 py-2 text-base font-medium rounded-md",
                    isActive
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-4 h-6 w-6",
                      isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                    )}
                  />
                  {/* {item.name} */}
  {item.name === "Request" ? (
    user?.role === "admin" ? (
      "Request Professional"
    ) : (
      "Request Business"
    )
  ) : (
    item.name
  )}
                </Link>
              );
              })
    )}
  </div>
</nav>
      </div>
    </>
  );
};

export default Sidebar;
