import React, { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import ProductList from '../../../components/products/ProductList';
import ProductForm from '../../../components/products/ProductForm';
// import Button from '../../../components/common/Button';
// import Modal from '../../../components/common/Modal';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Product } from '../../../types';

const Products: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleSuccess = () => {
    handleCloseForm();
    window.location.reload(); // Refresh the list
  };

  return (
    <DashboardLayout>
      <div className="products-container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="products-page-title">Products</h1>
          <Button onClick={() => setIsFormOpen(true)}>
            Add Product
          </Button>
        </div>

        <ProductList onEditProduct={handleEditProduct} />

        <Modal
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          title={editingProduct ? 'Edit Product' : 'Add Product'}
          size="lg"
        >
          <ProductForm
            product={editingProduct}
            onSuccess={handleSuccess}
            onCancel={handleCloseForm}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Products;
