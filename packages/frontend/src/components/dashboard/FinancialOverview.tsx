import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { TrendingUp, TrendingDown, DollarSign, FileText, Users, CreditCard } from 'lucide-react';

interface FinancialOverviewProps {
  data: {
    totalRevenue: number;
    revenueGrowth: number;
    outstandingInvoices: number;
    totalInvoices: number;
    activeCustomers: number;
    averagePaymentTime: number;
  };
}

export const FinancialOverview: React.FC<FinancialOverviewProps> = ({ data }) => {
  const metrics = [
    {
      title: 'Total Revenue',
      value: `₹${data.totalRevenue.toLocaleString()}`,
      change: data.revenueGrowth,
      icon: DollarSign,
      trend: data.revenueGrowth >= 0 ? 'up' : 'down',
    },
    {
      title: 'Outstanding Invoices',
      value: data.outstandingInvoices.toString(),
      change: 0, // You might want to calculate this
      icon: FileText,
      trend: 'neutral',
    },
    {
      title: 'Active Customers',
      value: data.activeCustomers.toString(),
      change: 0, // You might want to calculate this
      icon: Users,
      trend: 'up',
    },
    {
      title: 'Avg. Payment Time',
      value: `${data.averagePaymentTime} days`,
      change: 0, // You might want to calculate this
      icon: CreditCard,
      trend: 'down',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            {metric.change !== 0 && (
              <p className={`text-xs ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                {metric.trend === 'up' ? (
                  <TrendingUp className="mr-1 h-3 w-3" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3" />
                )}
                {Math.abs(metric.change)}% {metric.trend === 'up' ? 'increase' : 'decrease'} from last month
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
