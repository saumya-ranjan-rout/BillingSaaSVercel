import { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { useApi } from '../../../hooks/useApi';
import { toast } from 'sonner';

type SalesReport = {
  totalInvoices: number;
  totalSales: number;
  totalTax: number;
  totalDiscount: number;
  data: {
    invoiceNumber: string;
    customerName: string;
    issueDate: string;
    totalAmount: number;
    taxTotal: number;
    discountTotal: number;
    status: string;
  }[];
};

export default function SalesReportPage() {
  const { get } = useApi<SalesReport>();
  const [report, setReport] = useState<SalesReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
  });

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      });

      // useApi get — expects the report object returned directly from backend
      const response = await get(`/api/invoices/reports/sales?${query.toString()}`);

      setReport(response);
    } catch (error) {
      console.error('Failed to fetch sales report:', error);
      toast.error('Failed to load sales report ❌');
    } finally {
      setLoading(false);
    }
  }, [get, filters]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Sales Report</h1>

        {/* Filters Card */}
        <div className="bg-white shadow rounded-lg p-4 flex flex-wrap items-end gap-4">
          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700">From Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700">To Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="ml-auto">
            <button
              onClick={fetchReport}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Filter
            </button>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="text-sm text-gray-500">Total Invoices</p>
              <p className="text-lg font-semibold">{report?.totalInvoices ?? 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Sales</p>
              <p className="text-lg font-semibold text-indigo-600">₹{(report?.totalSales ?? 0).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Tax</p>
              <p className="text-lg font-semibold">₹{(report?.totalTax ?? 0).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Discount</p>
              <p className="text-lg font-semibold">₹{(report?.totalDiscount ?? 0).toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tax</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : (report?.data && report.data.length > 0) ? (
                report.data.map((inv, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{inv.invoiceNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{inv.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(inv.issueDate).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
  ₹{Number(inv.totalAmount).toFixed(2)}
</td>
<td className="px-6 py-4 whitespace-nowrap text-sm">
  ₹{Number(inv.taxTotal).toFixed(2)}
</td>
<td className="px-6 py-4 whitespace-nowrap text-sm">
  ₹{Number(inv.discountTotal).toFixed(2)}
</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{inv.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">No records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}




