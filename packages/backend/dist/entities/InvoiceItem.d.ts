import { TenantAwareEntity } from './BaseEntity';
import { Invoice } from './Invoice';
import { Product } from './Product';
import { HSN } from './HSN';
export declare class InvoiceItem extends TenantAwareEntity {
    invoiceId: string;
    invoice: Invoice;
    productId: string;
    product: Product;
    description: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    discount: number;
    discountAmount: number;
    taxRate: number;
    taxAmount: number;
    lineTotal: number;
    tax_type: string;
    has_cess: boolean;
    cess_value: number;
    cessAmount: number;
    metadata: Record<string, any>;
    hsn: HSN;
}
//# sourceMappingURL=InvoiceItem.d.ts.map