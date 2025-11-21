import React, { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import PurchaseList from '../../../components/purchases/PurchaseList';
import PurchaseForm from '../../../components/purchases/PurchaseForm';
// import Button from '../../../components/common/Button';
// import Modal from '../../../components/common/Modal';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { PurchaseOrder } from '../../../types';

const Purchases: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<PurchaseOrder | null>(null);

  const handleEditPurchase = (purchaseOrder: PurchaseOrder) => {
    setEditingPurchase(purchaseOrder);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingPurchase(null);
  };

  const handleSuccess = () => {
    handleCloseForm();
    window.location.reload(); // Refresh the list
  };

  return (
    <DashboardLayout>
      <div className="purchases-container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="purchases-page-title">Purchase Orders</h1>
          <Button onClick={() => setIsFormOpen(true)}>
            Create Purchase Order
          </Button>
        </div>

        <PurchaseList onEditPurchase={handleEditPurchase} />

        <Modal
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          title={editingPurchase ? 'Edit Purchase Order' : 'Create Purchase Order'}
          size="xl"
        >
          <PurchaseForm
            purchaseOrder={editingPurchase}
            onSuccess={handleSuccess}
            onCancel={handleCloseForm}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Purchases;
