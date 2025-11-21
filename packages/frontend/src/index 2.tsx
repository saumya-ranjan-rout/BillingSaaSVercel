import React, { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CustomerList from '../../../components/customers/CustomerList';
import CustomerForm from '../../../components/customers/CustomerForm';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Customer } from '../../../types';

const Customers: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [refreshList, setRefreshList] = useState(0);

  const triggerRefresh = () => {
    setRefreshList(prev => prev + 1);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCustomer(null);
  };

  const handleSuccess = () => {
    handleCloseForm();
    triggerRefresh();
  };

  return (
    <DashboardLayout>
      <div className="customers-container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="customers-page-title">Customers</h1>
          <Button onClick={() => setIsFormOpen(true)}>
            Add Customer
          </Button>
        </div>

        <CustomerList
          onEditCustomer={handleEditCustomer}
          refreshTrigger={refreshList}
        />

        <Modal
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          title={editingCustomer ? 'Edit Customer' : 'Add Customer'}
          size="xl"
        >
          <CustomerForm
            customer={editingCustomer || undefined}
            onSuccess={handleSuccess}
            onCancel={handleCloseForm}
            onRefresh={triggerRefresh}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Customers;
