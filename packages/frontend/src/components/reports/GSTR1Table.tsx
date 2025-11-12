import React from 'react';

interface GSTR1TableProps {
  data: any[];
}

export const GSTR1Table: React.FC<GSTR1TableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              GSTIN
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Invoice Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Taxable Value
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              CGST
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              SGST
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              IGST
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Place of Supply
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.gstin}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.invoiceNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(item.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ₹{item.taxableValue.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ₹{item.cgst.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ₹{item.sgst.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ₹{item.igst.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.placeOfSupply}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
