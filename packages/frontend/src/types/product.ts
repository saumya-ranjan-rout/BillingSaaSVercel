export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  gstRate: number;
  gstType: 'igst' | 'cgst_sgst';
}