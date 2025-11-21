import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CustomerLoyaltyDashboard from '../../../components/loyalty/CustomerLoyaltyDashboard';
import LoyaltySettings from '../../../components/loyalty/LoyaltySettings';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useApi } from '../../../hooks/useApi';
import { toast } from 'sonner';

interface ApiResponse {
  success?: boolean;
  data?: any[];
  summary?: any;
  recentTransactions?: any[];
  program?: any;
  error?: string;
}

const LoyaltyPage: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [loyaltyData, setLoyaltyData] = useState<any>(null);
  const [program, setProgram] = useState<any>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');

  const { get, post } = useApi<ApiResponse>();

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await get('/api/customers?limit=100');
        setCustomers(res.data || []);
      } catch (err: any) {
        toast.error(err.message || 'Failed to load customers');
      }
    };
    fetchCustomers();
  }, [get]);

  // Fetch loyalty data per customer
  const fetchLoyaltyData = async (customerId: string) => {
    if (!customerId) return;
    try {
      const res = await get(`/api/loyalty/customer/${customerId}/summary`);
      if (res.success) {
        setLoyaltyData({
          summary: res.summary,
          recentTransactions: res.recentTransactions,
          program: res.program,
        });
      } else {
        toast.error(res.error || 'Failed to load loyalty data');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error fetching loyalty data');
    }
  };

  const fetchProgram = async () => {
    try {
      const res = await get(`/api/loyalty/program`);
      if (res.success) {
        setProgram(res.program);
      } else {
        toast.error(res.error || 'Failed to load program');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error fetching program');
    }
  };

  useEffect(() => {
    if (selectedCustomerId) {
      fetchLoyaltyData(selectedCustomerId);
    }
  }, [selectedCustomerId]);

  const handleRedeem = async (amount: number) => {
    try {
      const res = await post('/api/loyalty/redeem-cashback', {
        customerId: selectedCustomerId,
        amount,
      });
      if (res.success) {
        toast.success(`Redeemed ₹${amount}`);
        fetchLoyaltyData(selectedCustomerId);
      } else {
        toast.error(res.error || 'Redeem failed');
      }
    } catch (err: any) {
      toast.error(err.message || 'Redeem failed');
    }
  };

  const handleUpdateProgram = () => {
    fetchProgram();
    setIsSettingsOpen(false);
  };

  const handleOpenSettings = () => {
    fetchProgram();
    setIsSettingsOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="loyalty-container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="loyalty-page-title">Loyalty Program</h1>
          <Button onClick={handleOpenSettings}>Program Settings</Button>
        </div>

        {/* Customer Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Customer
          </label>
          <select
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
          >
            <option value="">-- Choose Customer --</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {loyaltyData ? (
          <CustomerLoyaltyDashboard
            loyaltyData={loyaltyData}
            onRedeem={handleRedeem}
          />
        ) : (
          <div className="text-gray-500">
            {selectedCustomerId
              ? 'Loading loyalty data...'
              : 'Please select a customer to view loyalty details'}
          </div>
        )}

        <Modal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          title="Loyalty Program Settings"
          size="xl"
        >
          {program ? (
            <LoyaltySettings program={program} onUpdate={handleUpdateProgram} />
          ) : (
            <div className="text-gray-500">Loading program...</div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default LoyaltyPage;
