import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { taxService, TaxSettings as TaxSettingsType } from '@/services/taxService'; 
import { ToastContainer, toast } from 'react-toastify';

const taxSchema = z.object({
  defaultGstRate: z.number().min(0, 'GST rate must be at least 0').max(28, 'GST rate cannot exceed 28%'),
  igstEnabled: z.boolean().default(false),
  hsnCodes: z.array(z.object({
    code: z.string().min(1, 'HSN code is required'),
    description: z.string().min(1, 'Description is required'),
    gstRate: z.number().min(0, 'GST rate must be at least 0'),
  })).optional(),
});

type TaxFormData = z.infer<typeof taxSchema>;

export const TaxSettingsPage: React.FC = () => {
  const { tenantId } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TaxFormData>({
    resolver: zodResolver(taxSchema),
  });

const onSubmit = async (data: TaxFormData) => {
  if (!tenantId) {
    toast.error('Tenant ID missing. Please re-login.');
    return;
  }

  try {
    await taxService.updateTaxSettings(tenantId, data as unknown as Partial<TaxSettingsType>);
    toast.success('Tax settings updated successfully');
  } catch (error) {
    console.error('Failed to update tax settings:', error);
    toast.error('Failed to update tax settings');
  }
};

 return (
    <div>
      <h2 className="text-lg font-medium text-gray-800 mb-4">Tax Settings</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Default GST Rate (%)</label>
          <input
            type="number"
            step="0.1"
            {...register('defaultGstRate', { valueAsNumber: true })}
            className={`w-full p-2 border rounded-md ${errors.defaultGstRate ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="18"
          />
          {errors.defaultGstRate && (
            <p className="text-red-500 text-xs mt-1">{errors.defaultGstRate.message}</p>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('igstEnabled')}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            id="igstEnabled"
          />
          <label htmlFor="igstEnabled" className="ml-2 block text-sm text-gray-700">
            Enable IGST for inter-state transactions
          </label>
        </div>

        <div className="pt-4">
          <h3 className="text-md font-medium text-gray-800 mb-2">HSN Codes</h3>
          <p className="text-sm text-gray-600 mb-4">
            Manage your HSN codes and their corresponding GST rates
          </p>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-600">
              HSN code management would be implemented here with a table for adding, editing, and deleting HSN codes.
            </p>
          </div>
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