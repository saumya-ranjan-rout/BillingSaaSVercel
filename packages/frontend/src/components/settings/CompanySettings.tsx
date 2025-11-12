import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { companyService } from '@/services/companyService';
import { ToastContainer, toast } from 'react-toastify';

const companySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().min(1, 'Pincode is required'),
  country: z.string().min(1, 'Country is required'),
  gstin: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  bankName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankIfscCode: z.string().optional(),
});

type CompanyFormData = z.infer<typeof companySchema>;

export const CompanySettings: React.FC = () => {
  const { tenantId } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
  });

const onSubmit = async (data: CompanyFormData) => {
  if (!tenantId) {
    toast.error('Tenant ID missing. Please re-login.');
    return;
  }

  try {
    await companyService.updateCompany(tenantId, data);
    toast.success('Company details updated successfully');
  } catch (error) {
    console.error('Failed to update company details:', error);
    toast.error('Failed to update company details');
  }
};

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-800 mb-4">Company Information</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input
              {...register('name')}
              className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Your Company Name"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GSTIN</label>
            <input
              {...register('gstin')}
              className={`w-full p-2 border rounded-md ${errors.gstin ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="GSTIN Number"
            />
            {errors.gstin && (
              <p className="text-red-500 text-xs mt-1">{errors.gstin.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input
            {...register('address')}
            className={`w-full p-2 border rounded-md ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Street Address"
          />
          {errors.address && (
            <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              {...register('city')}
              className={`w-full p-2 border rounded-md ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="City"
            />
            {errors.city && (
              <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input
              {...register('state')}
              className={`w-full p-2 border rounded-md ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="State"
            />
            {errors.state && (
              <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
            <input
              {...register('pincode')}
              className={`w-full p-2 border rounded-md ${errors.pincode ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Pincode"
            />
            {errors.pincode && (
              <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
          <input
            {...register('country')}
            className={`w-full p-2 border rounded-md ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Country"
            defaultValue="India"
          />
          {errors.country && (
            <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              {...register('phone')}
              className={`w-full p-2 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Phone Number"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              {...register('email')}
              className={`w-full p-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Email Address"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
          <input
            {...register('website')}
            className={`w-full p-2 border rounded-md ${errors.website ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Website URL"
          />
          {errors.website && (
            <p className="text-red-500 text-xs mt-1">{errors.website.message}</p>
          )}
        </div>

        <h3 className="text-md font-medium text-gray-800 mt-6 mb-4">Bank Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
            <input
              {...register('bankName')}
              className={`w-full p-2 border rounded-md ${errors.bankName ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Bank Name"
            />
            {errors.bankName && (
              <p className="text-red-500 text-xs mt-1">{errors.bankName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
            <input
              {...register('bankAccountNumber')}
              className={`w-full p-2 border rounded-md ${errors.bankAccountNumber ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Account Number"
            />
            {errors.bankAccountNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.bankAccountNumber.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
          <input
            {...register('bankIfscCode')}
            className={`w-full p-2 border rounded-md ${errors.bankIfscCode ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="IFSC Code"
          />
          {errors.bankIfscCode && (
            <p className="text-red-500 text-xs mt-1">{errors.bankIfscCode.message}</p>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
