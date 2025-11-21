import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/Select';
import { useApi } from '../../../hooks/useApi';
import { Invoice, Customer, Product } from '../../../types';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
//srr
// import Creatable from 'react-select/creatable'; // note: import name 'Creatable'
// import CreatableSelect from "react-select/creatable";
import dynamic from "next/dynamic";
const CreatableSelect = dynamic(() => import("react-select/creatable"), { ssr: false });

//srr
// ------------------ Schemas ------------------
const invoiceItemSchema = z.object({
  productId: z.string().min(1, 'Product is required').optional(),
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(0.01, 'Quantity must be greater than 0'),
  unit: z.string().min(1, 'Unit is required'),
  unitPrice: z.number().min(0.01, 'Unit price must be positive'),
  discount: z.number().min(0).max(100).default(0),
  taxRate: z.number().min(0).max(100).default(0),
tax_type: z.string().min(1, 'Tax Type is required').optional(),
has_cess: z.boolean().default(false),
cess_value: z.number().min(0).max(100).default(0),
});

const invoiceSchema = z.object({
  // customerId: z.string().min(1, 'Customer is required'),
  customerName: z.string().min(1, 'Customer name is required'),
  customerEmail: z.string().email('Invalid email address'),
  type: z.enum(['standard', 'proforma', 'credit', 'debit'], {
    required_error: 'Invoice type is required',
    invalid_type_error: 'Invoice type is required',
  }),
  issueDate: z.string().min(1, 'Issue date is required'),
  paymentTerms: z.enum(['due_on_receipt', 'net_7', 'net_15', 'net_30', 'net_60'], {
    required_error: 'Payment terms are required',
    invalid_type_error: 'Payment terms are required',
  }),
  shippingAddress: z.string().optional(),
  billingAddress: z.string().optional(),
  termsAndConditions: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

// ------------------ Props ------------------
interface InvoiceFormProps {
  invoice?: Invoice | null;
  onSuccess: () => void;
  onCancel: () => void;
}
interface ApiResponse {
  success?: boolean;
  data?: any[];
  summary?: any;
  recentTransactions?: any[];
  program?: any;
  error?: string;
}
// ------------------ Component ------------------
const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoice, onSuccess, onCancel }) => {
  const [redeemStatus, setRedeemStatus] = useState<"redeem" | "redeemed">("redeem");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
   const [cashBack, setCashbackAmount] = useState(0);
      const [cashbackInvoiceId, setCashbackInvoiceId] = useState<string[]>([]);
//srr
 const [customerName, setCustomerName] = useState("");
 const [customerEmail, setCustomerEmail] = useState("");
//srr
  const { post, put, get } = useApi<Invoice>();
    const { get:gett } = useApi<ApiResponse>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
    watch,
    setValue,
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
     // customerId: '',
      customerName: '',
  customerEmail: '',
      type: 'standard',
      issueDate: new Date().toISOString().split('T')[0],
      paymentTerms: 'net_15',
      items: [
        {
          productId: '',
          description: '',
          quantity: 1,
          unit: 'pcs',
          unitPrice: 0,
          discount: 0,
          taxRate: 0,
           tax_type: "cgst_sgst",
  has_cess: false,
  cess_value: 0,


        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
   const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
    const [loyaltyData, setLoyaltyData] = useState<any>(null);
  const items = watch('items');
 // const customerId = watch('customerId');
  const paymentTerms = watch('paymentTerms');
  const issueDate = watch('issueDate');
  
  useEffect(() => {
    if (selectedCustomerId) {
      fetchLoyaltyData(selectedCustomerId);
      
    }
  }, [selectedCustomerId]);

    const fetchLoyaltyData = async (customerId: string) => {
      if (!customerId) return;
      try {
        const res = await gett(`/api/loyalty/customer/${customerId}/summary`);
        if (res.success) {
          const invoiceIds = res.recentTransactions?.map((t: any) => t.invoiceId) || [];
setCashbackInvoiceId(invoiceIds);
          setLoyaltyData({
            summary: res.summary,
            recentTransactions: res.recentTransactions,
            program: res.program,
          });
          console.log(loyaltyData);
        } else {
          toast.error(res.error || 'Failed to load loyalty data');
        }
      } catch (err: any) {
        toast.error(err.message || 'Error fetching loyalty data');
      }
    };
  // ------------------ Fetch Customers & Products ------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersResponse, productsResponse] = await Promise.all([
          get('/api/customers?limit=200'),
          get('/api/products?limit=200&isActive=true'),
        ]);

        // API shape safety:
        const customersData = Array.isArray(customersResponse)
          ? customersResponse
          : Array.isArray((customersResponse as any)?.data)
          ? (customersResponse as any).data
          : [];

        const productsData = Array.isArray(productsResponse)
          ? productsResponse
          : Array.isArray((productsResponse as any)?.data)
          ? (productsResponse as any).data
          : [];

        setCustomers(customersData);
        setProducts(productsData);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load form data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [get]);

  // ------------------ Reset with existing invoice ------------------
   useEffect(() => {
   // alert(cashBack);
    if (invoice) {
      setSelectedCustomerId(invoice.customer?.id || '');
      console.log('Resetting form with invoice:', invoice);
      reset({
        customerName: invoice.customer?.name || '',
        customerEmail: invoice.customer?.email || '',
        type: invoice.type,
        issueDate: invoice.issueDate.split('T')[0],
        paymentTerms: invoice.paymentTerms,
        shippingAddress: invoice.shippingAddress,
        billingAddress: invoice.billingAddress,
        termsAndConditions: invoice.termsAndConditions,
        notes: invoice.notes,
        // items: invoice.items.map((item) => ({
        //   productId: item.productId ?? '',
        //   description: item.description,
        //   quantity: Number(item.quantity) || 1,
        //   unit: item.unit ?? 'pcs',
        //   unitPrice: Number(item.unitPrice) || 0,
        //   discount: Number(item.discount) || 0,
        //   taxRate: Number(item.taxRate) || 0,
        // })),
        items: (invoice.items ?? []).map((item) => ({
  productId: item.productId ?? '',
  description: item.description ?? '',
  quantity: Number(item.quantity) || 1,
  unit: item.unit ?? 'pcs',
  unitPrice: Number(item.unitPrice) || 0,
  discount: Number(item.discount) || 0,
  taxRate: Number(item.taxRate) || 0,
  // tax_type: item.taxName || "cgst_sgst",
  // has_cess: item.has_cess || false,
  // cess_value: Number(item.cess_value) || 0,
})),
      });
    }
  }, [invoice, reset]);

  // ------------------ Helpers ------------------
   const calculateDueDate = (issueDate: string, terms: string) => {
    if (!issueDate) return '';
    const date = new Date(issueDate);
    switch (terms) {
      case 'due_on_receipt': return date.toISOString().split('T')[0];
      case 'net_7': date.setDate(date.getDate() + 7); break;
      case 'net_15': date.setDate(date.getDate() + 15); break;
      case 'net_30': date.setDate(date.getDate() + 30); break;
      case 'net_60': date.setDate(date.getDate() + 60); break;
    }
    return date.toISOString().split('T')[0];
  };

  // const calculateItemTotals = (item: any) => {
  //   const discountAmount = (item.unitPrice * item.quantity * item.discount) / 100;
  //   const taxableAmount = item.unitPrice * item.quantity - discountAmount;
  //   const taxAmount = (taxableAmount * item.taxRate) / 100;
  //   const lineTotal = taxableAmount + taxAmount;
  //   return { discountAmount, taxAmount, lineTotal };
  // };
  const calculateItemTotals = (item: any) => {
  const discountAmount = (item.unitPrice * item.quantity * item.discount) / 100;
  const taxableAmount = item.unitPrice * item.quantity - discountAmount;
// alert(item.tax_type);
  let taxAmount = 0;

  if (item.tax_type === "cgst_sgst") {
    // total taxRate split into CGST + SGST
    taxAmount = (taxableAmount * item.taxRate) / 100;
  }

  if (item.tax_type === "igst") {
    // IGST → full taxRate
    taxAmount = (taxableAmount * item.taxRate) / 100;
  }

  const cessAmount = item.has_cess
    ? (taxableAmount * item.cess_value) / 100
    : 0;

  const lineTotal = taxableAmount + taxAmount + cessAmount;

  return { discountAmount, taxAmount, cessAmount, lineTotal };
};


  const calculateOrderTotals = (items: any[]) => {
  //  alert('redeemedPoints'+redeemedPoints);
    let subTotal = 0, taxTotal = 0, discountTotal = 0;
    items.forEach((item) => {
      const totals = calculateItemTotals(item);
      subTotal += item.unitPrice * item.quantity;
      discountTotal += totals.discountAmount;
      taxTotal += totals.taxAmount+totals.cessAmount;
    });
    return { subTotal, taxTotal, discountTotal, totalAmount: subTotal - discountTotal + taxTotal,dueTotal:(subTotal - discountTotal + taxTotal)-cashBack};
  };

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setValue(`items.${index}.productId`, product.id);
      setValue(`items.${index}.description`, product.name);
      setValue(`items.${index}.unitPrice`, product.sellingPrice);
      setValue(`items.${index}.unit`, product.unit || 'pcs');
      setValue(`items.${index}.taxRate`, product.taxRate || 0);
    }
  };

  // Submit: send customerName & customerEmail; backend will create/get customer
  const onSubmit = async (data: InvoiceFormData) => {
   // alert('Form submitted'); 
 // "redeem" or "redeemed"

  // console.log(data); 
    try {
      const payload = {
        ...data,
        cashBack :cashBack,
        issueDate: new Date(data.issueDate).toISOString(),
        dueDate: calculateDueDate(data.issueDate, data.paymentTerms),
      };

      if (invoice?.id) {
        await put(`/api/invoices/${invoice.id}`, payload);
        // alert('Invoice updated successfully');
        toast.success('Invoice updated successfully');
      } else {
        await post('/api/invoices', payload);
        // alert('Invoice created successfully');
        toast.success('Invoice created successfully');
      }
      onSuccess();
    } catch (error: any) {
      console.error('Failed to save invoice:', error);
      toast.error(error?.message || 'Failed to save invoice');
    }
  };

  if (loading) return <div>Loading...</div>;

  const dueDate = calculateDueDate(issueDate, paymentTerms);
  const totals = calculateOrderTotals(items);

  return (
 <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col">
  <label className="text-sm font-medium text-gray-700 mb-1">Customer</label>
  <CreatableSelect
    isClearable
    isDisabled={!!invoice} // disable in update form
    value={
      (() => {
        const currentName = watch('customerName');
        const existing = customers.find(c => c.name === currentName);
        return existing ? { value: existing.id, label: existing.name } : (currentName ? { value: 'new', label: currentName } : null);
      })()
    }
    onChange={(newValue: any) => {
      if (!newValue) {
        setValue('customerName', '');
        setValue('customerEmail', '');
        return;
      }

      // existing customer selected
      const selected = customers.find(c => c.id === newValue.value);
      if (selected) {
        setValue('customerName', selected.name, { shouldDirty: true });
        setValue('customerEmail', selected.email || '', { shouldDirty: true });
          setSelectedCustomerId(selected.id);
     
      } else {
        // new customer typed
        setValue('customerName', newValue.label, { shouldDirty: true });
        setValue('customerEmail', '', { shouldDirty: true });
      }
    }}
    options={customers.map(c => ({ value: c.id, label: c.name }))}
    placeholder="Select or type a customer"
  />
  {errors.customerName && (
    <p className="text-red-500 text-sm mt-1">{errors.customerName.message}</p>
  )}
</div>

{/* Customer Email */}
<div className="flex flex-col">
  <label className="text-sm font-medium text-gray-700 mb-1">Customer Email</label>
  <Input
    {...register('customerEmail')}
    placeholder="Enter customer email"
    disabled={
      !!invoice || 
      !!customers.find(c => c.name === watch('customerName'))
    }
    error={errors.customerEmail?.message}
  />
</div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Invoice Type</label>

          <Select
            value={watch('type')}
            onValueChange={(value: string) => setValue('type', value as InvoiceFormData['type'])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select invoice type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="proforma">Proforma</SelectItem>
              <SelectItem value="credit">Credit Note</SelectItem>
              <SelectItem value="debit">Debit Note</SelectItem>
            </SelectContent>
          </Select>

          {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
        </div>


</div>


{/* srr */}
      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Issue Date"
          type="date"
          {...register('issueDate')}
          error={errors.issueDate?.message}
          disabled={isSubmitting}
        />

       <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Payment Terms</label>

          <Select
            value={paymentTerms}
            onValueChange={(value: string) => setValue('paymentTerms', value as InvoiceFormData['paymentTerms'])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select payment terms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="due_on_receipt">Due on Receipt</SelectItem>
              <SelectItem value="net_7">Net 7</SelectItem>
              <SelectItem value="net_15">Net 15</SelectItem>
              <SelectItem value="net_30">Net 30</SelectItem>
              <SelectItem value="net_60">Net 60</SelectItem>
            </SelectContent>
          </Select>

          {errors.paymentTerms && <p className="text-red-500 text-sm mt-1">{errors.paymentTerms.message}</p>}
        </div>

        <Input
          label="Due Date"
          type="date"
          value={dueDate}
          disabled
          className="bg-gray-50"
        />
      </div>

      {/* Items */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Items</h3>
        {fields.map((field, index) => (
          <div key={field.id} className="border rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
               <div className="md:col-span-4 flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Product</label>

                <Select
                  value={items[index]?.productId || (items[index]?.productId === '' ? 'custom' : items[index]?.productId)}
                  onValueChange={(value: string) => handleProductChange(index, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Product" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* custom sentinel value so Radix items don't have empty string */}
                    <SelectItem value="custom">Custom Item</SelectItem>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {errors.items?.[index]?.productId && <p className="text-red-500 text-sm mt-1">{errors.items[index]?.productId?.message}</p>}
              </div>

              <div className="md:col-span-4">
                <Input
                  label="Description"
                  {...register(`items.${index}.description`)}
                  error={errors.items?.[index]?.description?.message}
                  disabled={isSubmitting}
                />
              </div>

              <div className="md:col-span-2">
                <Input
                  label="Quantity"
                  type="number"
                  step="0.01"
                  {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                  error={errors.items?.[index]?.quantity?.message}
                  disabled={isSubmitting}
                />
              </div>

              <div className="md:col-span-2">
                <Input
                  label="Unit"
                  {...register(`items.${index}.unit`)}
                  error={errors.items?.[index]?.unit?.message}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
              <div className="md:col-span-2">
                <Input
                  label="Unit Price (₹)"
                  type="number"
                  step="0.01"
                  {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                  error={errors.items?.[index]?.unitPrice?.message}
                  disabled={isSubmitting}
                />
              </div>

              <div className="md:col-span-2">
                <Input
                  label="Discount (%)"
                  type="number"
                  step="0.01"
                  {...register(`items.${index}.discount`, { valueAsNumber: true })}
                  error={errors.items?.[index]?.discount?.message}
                  disabled={isSubmitting}
                />
              </div>
    <div className="md:col-span-2">
        <label className="text-sm font-medium text-gray-700 mb-1">Tax Type</label>
  <select
{...register(`items.${index}.tax_type`)}
    className="w-full border p-2 rounded"
  >
    {/* <option value="">Select Tax Type</option> */}
    <option value="cgst_sgst">CGST & SGST</option>
    <option value="igst">IGST</option>
  </select>
</div>



              <div className="md:col-span-2">
                <Input
                  label="Tax Rate (%)"
                  type="number"
                  step="0.01"
                  {...register(`items.${index}.taxRate`, { valueAsNumber: true })}
                  error={errors.items?.[index]?.taxRate?.message}
                  disabled={isSubmitting}
                />
              </div>
              {/* CESS CHECKBOX */}
  <div className="md:col-span-1">
  <input
    type="checkbox"
    {...register(`items.${index}.has_cess`)}
  />CESS
</div>

{/* CONDITIONAL CESS FIELD */}

  {watch(`items.${index}.has_cess`) && (
     <div className="md:col-span-3">

     <Input
                  label="CESS Rate (%)"
                  type="number"
                  step="0.01"
                  {...register(`items.${index}.cess_value`, { valueAsNumber: true })}
                  error={errors.items?.[index]?.cess_value?.message}
                  disabled={isSubmitting}
                />
  </div>
  )}

 
              <div className="md:col-span-3">
                <Input
                  label="Line Total (₹)"
                  type="number"
                  value={calculateItemTotals(items[index]).lineTotal.toFixed(2)}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              <div className="md:col-span-2 flex items-end">
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => remove(index)}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              productId: '',
              description: '',
              quantity: 1,
              unit: 'pcs',
              unitPrice: 0,
              discount: 0,
              taxRate: 0,
              tax_type: 'cgst_sgst',
              has_cess: false,
              cess_value: 0
            })
          }
          disabled={isSubmitting}
          className="mt-2"
        >
          <Plus size={16} className="mr-2" />
          Add Item
        </Button>
      </div>

      {/* Order Summary */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Invoice Summary</h3>
        <div className="grid grid-cols-2 gap-4 max-w-md ml-auto">
          <div className="text-right">Subtotal:</div>
          <div className="text-right font-medium">₹{totals.subTotal.toFixed(2)}</div>

          <div className="text-right">Discount:</div>
          <div className="text-right font-medium text-red-600">
            -₹{totals.discountTotal.toFixed(2)}
          </div>

          <div className="text-right">Tax:</div>
          <div className="text-right font-medium">+₹{totals.taxTotal.toFixed(2)}</div>

          <div className="text-right border-t pt-2 font-semibold">Total:</div>
          <div className="text-right border-t pt-2 font-semibold">
            ₹{totals.totalAmount.toFixed(2)}
          </div>
{loyaltyData?.summary?.availableCashback > 0 &&
 totals.totalAmount >= loyaltyData?.summary?.availableCashback &&
 !cashbackInvoiceId.includes(invoice?.id ?? "") && (
              <>
           <div className=""></div>
<div className="text-right pt-2 font-semibold">
  <button
    type="button"
    onClick={() => {
      const newState = redeemStatus === "redeemed" ? "redeem" : "redeemed";
      setRedeemStatus(newState);

      if (newState === "redeemed") {
        setCashbackAmount(loyaltyData?.summary?.availableCashback || 0);
        calculateOrderTotals(items);
      }else{
        setCashbackAmount(0);
        calculateOrderTotals(items);
      }
    }}
    className={`px-2 py-1 text-xs rounded-md text-white font-semibold
      ${redeemStatus === "redeemed" ? "bg-green-600" : "bg-blue-600"}
    `}
  >
    {redeemStatus === "redeemed" ? "Redeemed" : "Redeem"}
  </button> <span className="ml-2 text-sm">
  (₹{loyaltyData?.summary?.availableCashback})
</span>

  
</div>
</>
    )}
   <div className="text-right border-t pt-2 font-semibold">Due:</div>
          <div className="text-right border-t pt-2 font-semibold">
            ₹{totals.dueTotal.toFixed(2)}
          </div>

        </div>
      </div>

      {/* Extra Fields */}
      <div className="grid grid-cols-1 gap-4">
        <Input
          label="Shipping Address"
          {...register('shippingAddress')}
          error={errors.shippingAddress?.message}
          disabled={isSubmitting}
          // multiline
        />
        <Input
          label="Billing Address"
          {...register('billingAddress')}
          error={errors.billingAddress?.message}
          disabled={isSubmitting}
          // multiline
        />
        <Input
          label="Terms & Conditions"
          {...register('termsAndConditions')}
          error={errors.termsAndConditions?.message}
          disabled={isSubmitting}
          // multiline
        />
        <Input
          label="Notes"
          {...register('notes')}
          error={errors.notes?.message}
          disabled={isSubmitting}
          // multiline
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {invoice ? 'Update Invoice' : 'Create Invoice'}
        </Button>
      </div>
    </form>
  );
};

export default InvoiceForm;



