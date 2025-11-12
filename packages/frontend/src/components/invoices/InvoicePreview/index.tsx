import React from 'react';
import { Invoice } from '../../../types';
import { formatCurrency, formatDate } from '../../../lib/utils';

interface InvoicePreviewProps {
  invoice: Invoice;
  onClose: () => void;
  onDownload: () => void;
  onSend: () => void;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  invoice,
  onClose,
  onDownload,
  onSend
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">INVOICE</h1>
          <p className="text-gray-600">#{invoice.invoiceNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-600">Issue Date: {formatDate(invoice.issueDate)}</p>
          <p className="text-gray-600">Due Date: {formatDate(invoice.dueDate)}</p>
        </div>
      </div>

      {/* From/To */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="font-semibold text-gray-900 mb-2">From:</h2>
          <p>Your Company Name</p>
          <p>123 Business Street</p>
          <p>Business City, BC 12345</p>
          <p>contact@yourcompany.com</p>
        </div>
        <div>
  <h2 className="font-semibold text-gray-900 mb-2">To:</h2>
  <p>{invoice.customer?.name}</p>
  <p>{invoice.customer?.billingAddress?.line1}</p>
  {invoice.customer?.billingAddress?.line2 && (
    <p>{invoice.customer.billingAddress.line2}</p>
  )}
  <p>
    {invoice.customer?.billingAddress?.city}, {invoice.customer?.billingAddress?.state}{' '}
    {invoice.customer?.billingAddress?.pincode}
  </p>
  <p>{invoice.customer?.email}</p>
</div>
      </div>

      {/* Line Items */}
      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-2 px-4 font-semibold text-gray-700">Description</th>
              <th className="text-right py-2 px-4 font-semibold text-gray-700">Quantity</th>
              <th className="text-right py-2 px-4 font-semibold text-gray-700">Unit Price</th>
              <th className="text-right py-2 px-4 font-semibold text-gray-700">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-3 px-4">{item.description}</td>
                <td className="py-3 px-4 text-right">{item.quantity}</td>
                <td className="py-3 px-4 text-right">{formatCurrency(item.unitPrice)}</td>
              <td className="py-3 px-4 text-right">{formatCurrency(item.lineTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-2">
            <span className="font-semibold">Subtotal:</span>
           <span>{formatCurrency(invoice.subTotal)}</span>
          </div>
    {invoice.taxTotal > 0 && (
  <div className="flex justify-between py-2">
    <span className="font-semibold">Tax:</span>
    <span>{formatCurrency(invoice.taxTotal)}</span>
  </div>
)}
          <div className="flex justify-between py-2 border-t border-gray-200">
            <span className="font-semibold text-lg">Total:</span>
            <span className="font-bold text-lg">{formatCurrency(invoice.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="mb-8">
          <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
          <p className="text-gray-600">{invoice.notes}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Close
        </button>
        <button
          onClick={onDownload}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Download PDF
        </button>
        <button
          onClick={onSend}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Send to Customer
        </button>
      </div>
    </div>
  );
};

export default InvoicePreview;
