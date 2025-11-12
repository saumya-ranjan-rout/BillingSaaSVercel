import React, { useState } from 'react';
import { Product } from '../../types/product';

interface ProductSelectorProps {
  onProductSelect: (product: Product) => void;
  products: Product[];
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({ onProductSelect, products }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="border rounded-md p-4 bg-gray-50">
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full p-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="max-h-60 overflow-y-auto">
        {filteredProducts.length === 0 ? (
          <p className="text-gray-500 text-center py-3">No products found</p>
        ) : (
          <div className="space-y-2">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="p-3 border border-gray-200 rounded-md bg-white hover:bg-gray-100 cursor-pointer"
                onClick={() => onProductSelect(product)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-800">{product.name}</h4>
                    <p className="text-sm text-gray-600">{product.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{product.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">
                      GST: {product.gstRate}% {product.gstType === 'igst' ? 'IGST' : 'CGST+SGST'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
