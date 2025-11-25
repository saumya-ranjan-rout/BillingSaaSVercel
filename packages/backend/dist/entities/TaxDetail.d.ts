import { Invoice } from './Invoice';
export declare class TaxDetail {
    id: string;
    taxName: string;
    taxRate: number;
    taxAmount: number;
    taxableValue: number;
    hasCess: boolean;
    cessRate: number;
    cessAmount: number;
    invoice: Invoice;
    invoiceId: string;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=TaxDetail.d.ts.map