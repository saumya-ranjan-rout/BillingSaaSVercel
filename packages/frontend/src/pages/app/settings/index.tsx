import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import DashboardLayout from '../../../components/layout/DashboardLayout';
// import Input from '../../../components/common/Input';
// import Button from '../../../components/common/Button';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useApi } from '../../../hooks/useApi';
import { toast } from 'sonner';

// ---------------- Schema ----------------
const settingSchema = z.object({
  companyName: z.string().min(1, 'Company Name is required'),
  subdomain: z.string().min(1, 'Subdomain is required'),
  contactEmail: z.string().email('Invalid email').optional(),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  gstNumber: z.string().optional(),
});

type SettingFormData = z.infer<typeof settingSchema>;

// ---------------- Component ----------------
export default function Settings() {
  const { get, put } = useApi<any>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SettingFormData>({
    resolver: zodResolver(settingSchema),
    defaultValues: {
      companyName: '',
      subdomain: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
      gstNumber: '',
    },
  });

  // Fetch existing settings
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await get('/api/settings');
        if (data) reset(data);
      } catch (err: any) {
        console.error('Failed to load settings:', err);
        toast.error(err.message || 'Failed to load settings');
      }
    };
    fetchData();
  }, [get, reset]);

  // Submit form
  const onSubmit = async (data: SettingFormData) => {
    try {
      await put('/api/settings', data);
      toast.success('Settings updated successfully');
    } catch (err: any) {
      console.error('Failed to save settings:', err);
      toast.error(err.message || 'Failed to save settings');
    }
  };

  return (
    <DashboardLayout>
      <div className="settings-container w-full px-6 py-6">

        {/* Page Title */}
        <h1 className="settings-title mb-1">Settings</h1>
        <p className="settings-subtitle mb-6">Manage your company information</p>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow rounded-lg p-6 space-y-4"
        >
          <Input
            label="Company Name"
            {...register('companyName')}
            error={errors.companyName?.message}
            disabled={isSubmitting}
          />
          <Input
            label="Subdomain"
            {...register('subdomain')}
            error={errors.subdomain?.message}
            disabled={isSubmitting}
          />
          <Input
            label="Contact Email"
            {...register('contactEmail')}
            error={errors.contactEmail?.message}
            disabled={isSubmitting}
          />
          <Input
            label="Contact Phone"
            {...register('contactPhone')}
            error={errors.contactPhone?.message}
            disabled={isSubmitting}
          />
          <Input
            label="Address"
            {...register('address')}
            error={errors.address?.message}
            disabled={isSubmitting}
            // multiline
          />
          <Input
            label="GST Number"
            {...register('gstNumber')}
            error={errors.gstNumber?.message}
            disabled={isSubmitting}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="submit" isLoading={isSubmitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}


