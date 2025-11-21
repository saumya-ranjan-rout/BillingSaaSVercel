import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { MetricCard } from "@/components/ui/MetricCard";
import { useApi } from "../../../hooks/useApi";
import Link from "next/link";

import {
  DollarSign,
  Users,
  FileText,
  TrendingUp,
  Calendar,
  RefreshCw,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  date: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
}

interface DashboardData {
  totalRevenue: number;
  newCustomers: number;
  pendingInvoices: number;
  paidInvoices: number;
  recentInvoices: Invoice[];
  recentCustomers: Customer[];
}

const Dashboard: React.FC = () => {
  const { data, loading, error, get } = useApi<DashboardData>();
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchDashboardData = async () => {
    try {
      await get("/api/dashboard");
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-2">
              Error Loading Dashboard
            </div>
            <div className="text-gray-500 mb-4">{error}</div>
            <button
              onClick={fetchDashboardData}
              className="btn-gray"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const dashboardData: DashboardData = data || {
    totalRevenue: 0,
    newCustomers: 0,
    pendingInvoices: 0,
    paidInvoices: 0,
    recentInvoices: [],
    recentCustomers: [],
  };

  const revenueData = dashboardData.recentInvoices.map((inv) => ({
    date: new Date(inv.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    revenue: inv.amount,
  }));

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="dashboard-title">Dashboard</h1>
            {lastUpdated && (
              <p className="dashboard-subtitle mt-1">
                Last updated: {lastUpdated}
              </p>
            )}
          </div>

          <button onClick={fetchDashboardData} className="btn-gray">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Revenue"
            value={`₹${dashboardData.totalRevenue.toLocaleString()}`}
            change={12.5}
            icon={DollarSign}
            color="blue"
          />

          <MetricCard
            title="New Customers"
            value={dashboardData.newCustomers}
            change={8.2}
            icon={Users}
            color="green"
          />

          <MetricCard
            title="Pending Invoices"
            value={dashboardData.pendingInvoices}
            change={-3.4}
            icon={FileText}
            color="yellow"
          />

          <MetricCard
            title="Paid Invoices"
            value={dashboardData.paidInvoices}
            change={5.7}
            icon={TrendingUp}
            color="blue"
          />
        </div>

        {/* Recent Invoices & Customers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Recent Invoices */}
          <div className="dashboard-card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Invoices
              </h2>
              <Link href="/app/invoices">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View all
                </button>
              </Link>
            </div>

            <div className="space-y-2">
              {dashboardData.recentInvoices.map((invoice) => (
                <div key={invoice.id} className="list-row flex justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {invoice.invoiceNumber}
                    </p>
                    <p className="text-sm text-gray-500">
                      {invoice.customerName}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">₹{invoice.amount}</p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        invoice.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : invoice.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Customers */}
          <div className="dashboard-card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Customers
              </h2>
              <Link href="/app/customers">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View all
                </button>
              </Link>
            </div>

            <div className="space-y-2">
              {dashboardData.recentCustomers.map((customer) => (
                <div key={customer.id} className="list-row flex items-center">
                  <div className="avatar-circle">
                    {customer.name.charAt(0)}
                  </div>

                  <div className="ml-4">
                    <p className="font-medium text-gray-900">
                      {customer.name}
                    </p>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                  </div>

                  <div className="ml-auto text-sm text-gray-500">
                    Joined {new Date(customer.joinedDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Revenue Chart */}
        <div className="dashboard-card">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Revenue Overview
          </h2>

          <div className="h-72 chart-wrapper">
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                No revenue data available
              </div>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
