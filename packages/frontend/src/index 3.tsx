import React, { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import VendorList from '../../../components/vendors/VendorList';
import VendorForm from '../../../components/vendors/VendorForm';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Vendor } from '../../../types';

const Vendors: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  const handleEditVendor = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingVendor(null);
  };

  const handleSuccess = () => {
    handleCloseForm();
    window.location.reload(); 
  };

  return (
    <DashboardLayout>
      <div className="vendors-container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="vendors-page-title">Vendors</h1>
          <Button onClick={() => setIsFormOpen(true)}>
            Add Vendor
          </Button>
        </div>

        <VendorList onEditVendor={handleEditVendor} />

        <Modal
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          title={editingVendor ? 'Edit Vendor' : 'Add Vendor'}
          size="xl"
        >
          <VendorForm
            vendor={editingVendor ?? undefined}
            onSuccess={handleSuccess}
            onCancel={handleCloseForm}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Vendors;
