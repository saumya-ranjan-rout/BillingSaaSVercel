import React from 'react';
// import Button from '../common/Button';
import { Button } from '@/components/ui/Button';

interface CustomerLoyaltyDashboardProps {
  loyaltyData: any;
  onRedeem: (amount: number) => void;
}

const CustomerLoyaltyDashboard: React.FC<CustomerLoyaltyDashboardProps> = ({
  loyaltyData,
  onRedeem
}) => {
  const { summary, recentTransactions, program } = loyaltyData;

const getTierColor = (tier: string) => {
  const colors: Record<string, string> = {
    bronze: 'bg-amber-100 text-amber-800',
    silver: 'bg-gray-100 text-gray-800',
    gold: 'bg-yellow-100 text-yellow-800',
    platinum: 'bg-blue-100 text-blue-800'
  };
  return colors[tier] || 'bg-gray-100 text-gray-800';
};

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              ₹{summary?.availableCashback || 0}
            </div>
            <div className="text-sm text-gray-600">Available Cashback</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              ₹{summary?.totalCashbackEarned || 0}
            </div>
            <div className="text-sm text-gray-600">Total Earned</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              ₹{summary?.totalAmountSpent || 0}
            </div>
            <div className="text-sm text-gray-600">Total Spent</div>
          </div>

          <div className="text-center">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTierColor(summary?.currentTier)}`}>
              {summary?.currentTier?.toUpperCase()}
            </div>
            <div className="text-sm text-gray-600 mt-1">Current Tier</div>
          </div>
        </div>

        {summary?.availableCashback > 0 && (
          <div className="mt-4 flex justify-center">
            <Button
              onClick={() => onRedeem(summary.availableCashback)}
              variant="outline"
              size="sm"
            >
              Redeem Cashback
            </Button>
          </div>
        )}
      </div>

      {/* Program Info */}
      {program && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900">Current Program</h4>
          <p className="text-sm text-blue-700">
            {program.cashbackPercentage}% cashback on purchases above ₹{program.minimumPurchaseAmount}
          </p>
          {program.maximumCashbackAmount && (
            <p className="text-xs text-blue-600">
              Maximum cashback: ₹{program.maximumCashbackAmount} per transaction
            </p>
          )}
        </div>
      )}

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h4 className="font-semibold mb-4">Recent Transactions</h4>
        <div className="space-y-2">
          {recentTransactions?.map((transaction: any) => (
            <div key={transaction.id} className="flex justify-between items-center py-2 border-b">
              <div>
                <div className="text-sm">{transaction.description}</div>
                <div className="text-xs text-gray-500">
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className={`font-medium ${
                transaction.cashbackAmount > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.cashbackAmount > 0 ? '+' : ''}{transaction.cashbackAmount}
              </div>
            </div>
          ))}
          
          {(!recentTransactions || recentTransactions.length === 0) && (
            <div className="text-center text-gray-500 py-4">
              No transactions yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerLoyaltyDashboard;
