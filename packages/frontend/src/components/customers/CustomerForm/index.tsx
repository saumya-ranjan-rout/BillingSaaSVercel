import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
// import Button from '../../common/Button';
// import Input from '../../common/Input';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { useApi } from '../../../hooks/useApi';
import { Customer } from '../../../types';
import { toast } from 'sonner';

const customerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  address: z.object({
    line1: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    pincode: z.string().min(6, 'Pincode is required'),
    country: z.string().min(1, 'Country is required'),
  }),
  taxId: z.string().optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  customer?: Customer;
  onSuccess: () => void;
  onCancel: () => void;
  onRefresh: () => void; // NEW
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  customer,
  onSuccess,
  onCancel,
  onRefresh, 
}) => {
  const { post, put, del } = useApi<Customer>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      address: {
        country: 'India',
      },
    },
  });

  useEffect(() => {
    if (customer) {
      reset({
        name: customer.name,
        email: customer.email,
        phone: customer.phone || '',
        taxId: customer.gstin || customer.pan || '',
        address: {
          line1: customer.billingAddress?.line1 || '',
          city: customer.billingAddress?.city || '',
          state: customer.billingAddress?.state || '',
          pincode: customer.billingAddress?.pincode || '',
          country: customer.billingAddress?.country || 'India',
        },
      });
    }
  }, [customer, reset]);

const handleApiError = (error: any, fallbackMessage: string) => {
  console.error(fallbackMessage, error);

  if (error?.message?.includes("fails to match") || error?.message?.includes("is required")) {
    // Split multiple errors if backend sends them
    error.message.split(",").forEach((msg: string) => toast.error(msg.trim()));
  } else {
    toast.error(error?.message || fallbackMessage);
  }
};

  const onSubmit = async (data: CustomerFormData) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        gstin: data.taxId,
        address: data.address,
      };

      if (customer?.id) {
        await put(`/api/customers/${customer.id}`, payload);
        toast.success('Customer updated successfully ✅');
      } else {
        await post(`/api/customers`, payload);
        toast.success('Customer created successfully ✅');
      }
 onRefresh();
      onSuccess();
    } catch (error: any) {
       const err = error?.message || "Failed to save customer";
    handleApiError(error, err);
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Name"
          {...register('name')}
          error={errors.name?.message}
          disabled={isSubmitting}
          required
        />
        <Input
          label="Email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          disabled={isSubmitting}
          required
        />
      </div>

      <Input
        label="Phone (e.g., 9876543210)"
        {...register('phone')}
        error={errors.phone?.message}
        disabled={isSubmitting}
      />

      <Input
        label="Tax ID (e.g., 22AAAAA0000A1Z5)"
        {...register('taxId')}
        error={errors.taxId?.message}
        disabled={isSubmitting}
      />

      <div className="border-t pt-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
        <div className="grid grid-cols-1 gap-4">
          <Input
            label="Address Line 1"
            {...register('address.line1')}
            error={errors.address?.line1?.message}
            disabled={isSubmitting}
            required
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Input
              label="City"
              {...register('address.city')}
              error={errors.address?.city?.message}
              disabled={isSubmitting}
              required
            />

            <Input
              label="State"
              {...register('address.state')}
              error={errors.address?.state?.message}
              disabled={isSubmitting}
              required
            />

            <Input
              label="Pincode (e.g., 560001)"
              {...register('address.pincode')}
              error={errors.address?.pincode?.message}
              disabled={isSubmitting}
              required
            />

            <Input
              label="Country"
              {...register('address.country')}
              error={errors.address?.country?.message}
              disabled={isSubmitting}
              required
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        {/* {customer?.id && (
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            Delete
          </Button>
        )} */}

        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button type="submit" isLoading={isSubmitting}>
          {customer ? 'Update Customer' : 'Create Customer'}
        </Button>
      </div>
    </form>
  );
};

export default CustomerForm;





