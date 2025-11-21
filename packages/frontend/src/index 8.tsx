import React, { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import InvoiceList from '../../../components/invoices/InvoiceList';
import InvoiceForm from '../../../components/invoices/InvoiceForm';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Invoice } from '../../../types';
import { toast } from 'sonner';

const Invoices: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setIsFormOpen(true);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setViewingInvoice(invoice);
    setIsViewOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingInvoice(null);
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
    setViewingInvoice(null);
  };

  const handleSuccess = () => {
    toast.success('Invoice saved successfully ✅');
    handleCloseForm();
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <DashboardLayout>
      <div className="invoices-container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="invoices-page-title">Invoices</h1>
          <Button onClick={() => setIsFormOpen(true)}>
            Create Invoice
          </Button>
        </div>

        <InvoiceList 
          onEditInvoice={handleEditInvoice}
          onViewInvoice={handleViewInvoice}
          refreshKey={refreshKey}
        />

        <Modal
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          title={editingInvoice ? 'Edit Invoice' : 'Create Invoice'}
          size="xl"
        >
          <InvoiceForm
            invoice={editingInvoice}
            onSuccess={handleSuccess}
            onCancel={handleCloseForm}
          />
        </Modal>

        {/* Enable when InvoiceView is ready */}
        {/* 
        <Modal
          isOpen={isViewOpen}
          onClose={handleCloseView}
          title="Invoice Details"
          size="xl"
        >
          <InvoiceView
            invoice={viewingInvoice}
            onClose={handleCloseView}
          />
        </Modal>
        */}
      </div>
    </DashboardLayout>
  );
};

export default Invoices;
