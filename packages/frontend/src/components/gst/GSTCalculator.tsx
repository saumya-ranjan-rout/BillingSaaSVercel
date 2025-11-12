import React from 'react';

interface GSTCalculatorProps {
  items: any[];
}

export const GSTCalculator: React.FC<GSTCalculatorProps> = ({ items }) => {
  const calculations = calculateGSTBreakdown(items);

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="font-semibold text-gray-700 mb-3">GST Breakdown</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium">₹{calculations.subtotal.toFixed(2)}</span>
        </div>
        {calculations.cgst > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">CGST ({calculations.cgstRate}%):</span>
            <span className="font-medium">₹{calculations.cgst.toFixed(2)}</span>
          </div>
        )}
        {calculations.sgst > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">SGST ({calculations.sgstRate}%):</span>
            <span className="font-medium">₹{calculations.sgst.toFixed(2)}</span>
          </div>
        )}
        {calculations.igst > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">IGST ({calculations.igstRate}%):</span>
            <span className="font-medium">₹{calculations.igst.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between border-t pt-2">
          <span className="text-gray-800 font-semibold">Total GST:</span>
          <span className="text-gray-800 font-semibold">₹{calculations.totalGST.toFixed(2)}</span>
        </div>
        <div className="flex justify-between border-t pt-2">
          <span className="text-gray-800 font-bold">Grand Total:</span>
          <span className="text-gray-800 font-bold">₹{calculations.grandTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

const calculateGSTBreakdown = (items: any[]) => {
  let subtotal = 0;
  let cgst = 0;
  let sgst = 0;
  let igst = 0;
  let cgstRate = 0;
  let sgstRate = 0;
  let igstRate = 0;

  items.forEach(item => {
    const itemTotal = item.quantity * item.price;
    subtotal += itemTotal;
    
    const gstAmount = itemTotal * (item.gstRate / 100);
    
    if (item.gstType === 'igst') {
      igst += gstAmount;
      igstRate = item.gstRate;
    } else {
      cgst += gstAmount / 2;
      sgst += gstAmount / 2;
      cgstRate = item.gstRate / 2;
      sgstRate = item.gstRate / 2;
    }
  });

  const totalGST = cgst + sgst + igst;
  const grandTotal = subtotal + totalGST;

  return {
    subtotal,
    cgst,
    sgst,
    igst,
    cgstRate,
    sgstRate,
    igstRate,
    totalGST,
    grandTotal,
  };
};
