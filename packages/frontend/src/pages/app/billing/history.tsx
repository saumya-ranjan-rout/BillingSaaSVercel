import React, { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { useGetBillingHistoryQuery, useDownloadInvoiceMutation } from '../../../services/endpoints/billingApi';
// import Button from '../../../components/common/Button';
import { Button } from '@/components/ui/Button';
import { Download, FileText, Receipt } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../lib/utils';

const BillingHistory: React.FC = () => {
  const { data: billingHistory, isLoading, error } = useGetBillingHistoryQuery();
  const [downloadInvoice] = useDownloadInvoiceMutation();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownloadInvoice = async (invoiceId: string) => {
    setDownloadingId(invoiceId);
    try {
      const response = await downloadInvoice(invoiceId).unwrap();
      
      // Create a blob from the PDF data
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download invoice:', error);
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Billing History</h1>
          <p className="text-gray-600 mb-8">
            View and download your past invoices and receipts
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              Failed to load billing history. Please try again.
            </div>
          )}

          <div className="bg-white rounded-lg shadow overflow-hidden">
            {billingHistory && billingHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {billingHistory.map((invoice: any) => (
                      <tr key={invoice.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(invoice.date)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="flex items-center">
                            {invoice.type === 'invoice' ? (
                              <FileText size={16} className="mr-2 text-blue-500" />
                            ) : (
                              <Receipt size={16} className="mr-2 text-green-500" />
                            )}
                            {invoice.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(invoice.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            invoice.status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : invoice.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadInvoice(invoice.id)}
                            disabled={downloadingId === invoice.id}
                          >
                            {downloadingId === invoice.id ? (
                              'Downloading...'
                            ) : (
                              <>
                                <Download size={14} className="mr-1" />
                                Download
                              </>
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <Receipt size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No billing history</h3>
                <p className="text-gray-600">
                  Your billing history will appear here once you have transactions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BillingHistory;
