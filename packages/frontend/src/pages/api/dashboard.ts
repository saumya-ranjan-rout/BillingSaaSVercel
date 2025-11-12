import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // In a real application, you would fetch this data from your database
  const dashboardData = {
    totalRevenue: 12453.89,
    newCustomers: 23,
    pendingInvoices: 12,
    paidInvoices: 45,
    recentInvoices: [
      { id: '1', invoiceNumber: 'INV-001', customerName: 'John Doe', amount: 1250, status: 'paid', date: '2023-06-15' },
      { id: '2', invoiceNumber: 'INV-002', customerName: 'Jane Smith', amount: 890, status: 'pending', date: '2023-06-14' },
      { id: '3', invoiceNumber: 'INV-003', customerName: 'Acme Corp', amount: 2450, status: 'paid', date: '2023-06-13' },
      { id: '4', invoiceNumber: 'INV-004', customerName: 'XYZ Company', amount: 1750, status: 'overdue', date: '2023-06-10' },
    ],
    recentCustomers: [
      { id: '1', name: 'John Doe', email: 'john@example.com', joinDate: '2023-06-15' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', joinDate: '2023-06-14' },
      { id: '3', name: 'Bob Johnson', email: 'bob@example.com', joinDate: '2023-06-12' },
    ]
  };

  // Simulate network delay
  setTimeout(() => {
    res.status(200).json(dashboardData);
  }, 500);
}
