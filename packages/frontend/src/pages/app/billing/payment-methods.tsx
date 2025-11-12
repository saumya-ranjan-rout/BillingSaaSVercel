import React, { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
// import Button from '../../../components/common/Button';
// import Modal from '../../../components/common/Modal';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useGetPaymentMethodsQuery, useAddPaymentMethodMutation, useRemovePaymentMethodMutation, useSetDefaultPaymentMethodMutation } from '../../../services/endpoints/billingApi';
import { CreditCard, Plus, Trash2, Star } from 'lucide-react';

const PaymentMethods: React.FC = () => {
  const { data: paymentMethods, isLoading, error, refetch } = useGetPaymentMethodsQuery();
  const [addPaymentMethod] = useAddPaymentMethodMutation();
  const [removePaymentMethod] = useRemovePaymentMethodMutation();
  const [setDefaultPaymentMethod] = useSetDefaultPaymentMethodMutation();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvc: '',
    name: ''
  });

  const handleAddPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addPaymentMethod(newCard).unwrap();
      setIsAddModalOpen(false);
      setNewCard({ cardNumber: '', expMonth: '', expYear: '', cvc: '', name: '' });
      refetch();
    } catch (error) {
      console.error('Failed to add payment method:', error);
    }
  };

  const handleRemovePaymentMethod = async (paymentMethodId: string) => {
    try {
      await removePaymentMethod(paymentMethodId).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to remove payment method:', error);
    }
  };

  const handleSetDefault = async (paymentMethodId: string) => {
    try {
      await setDefaultPaymentMethod(paymentMethodId).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to set default payment method:', error);
    }
  };

  const getCardIcon = (brand: string) => {
    const brandLower = brand.toLowerCase();
    if (brandLower.includes('visa')) return 'VISA';
    if (brandLower.includes('mastercard')) return 'MC';
    if (brandLower.includes('amex')) return 'AMEX';
    if (brandLower.includes('discover')) return 'DISC';
    return 'CARD';
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
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Payment Methods</h1>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus size={16} className="mr-2" />
              Add Payment Method
            </Button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              Failed to load payment methods. Please try again.
            </div>
          )}

          <div className="bg-white rounded-lg shadow overflow-hidden">
            {paymentMethods && paymentMethods.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {paymentMethods.map((method: any) => (
                  <li key={method.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-gray-100 rounded-md p-2 mr-4">
                          <CreditCard size={24} className="text-gray-600" />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium text-gray-900">
                              {getCardIcon(method.brand)} •••• {method.last4}
                            </span>
                            {method.isDefault && (
                              <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            Expires {method.expMonth}/{method.expYear}
                          </p>
                          <p className="text-sm text-gray-600">{method.name}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {!method.isDefault && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSetDefault(method.id)}
                            >
                              <Star size={16} className="mr-1" />
                              Set Default
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleRemovePaymentMethod(method.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-12 text-center">
                <CreditCard size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No payment methods</h3>
                <p className="text-gray-600 mb-4">
                  Add a payment method to get started with your subscription.
                </p>
                <Button onClick={() => setIsAddModalOpen(true)}>
                  Add Payment Method
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Payment Method"
        size="md"
      >
        <form onSubmit={handleAddPaymentMethod} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cardholder Name
            </label>
            <input
              type="text"
              value={newCard.name}
              onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Number
            </label>
            <input
              type="text"
              value={newCard.cardNumber}
              onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1234 5678 9012 3456"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiration Date
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newCard.expMonth}
                  onChange={(e) => setNewCard({ ...newCard, expMonth: e.target.value })}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="MM"
                  maxLength={2}
                  required
                />
                <input
                  type="text"
                  value={newCard.expYear}
                  onChange={(e) => setNewCard({ ...newCard, expYear: e.target.value })}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="YY"
                  maxLength={2}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CVC
              </label>
              <input
                type="text"
                value={newCard.cvc}
                onChange={(e) => setNewCard({ ...newCard, cvc: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="123"
                maxLength={3}
                required
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Add Payment Method
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default PaymentMethods;
