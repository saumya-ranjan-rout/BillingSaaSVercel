import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { settingsService } from '@/services/settingsService';
import { ToastContainer, toast } from 'react-toastify';
import { CustomFieldsManager } from '@/components/settings/CustomFieldsManager';
import { ApiKeyManager } from '@/components/settings/ApiKeyManager';
import { AuditLog } from '@/components/settings/AuditLog';
import { BackupRestore } from '@/components/settings/BackupRestore';

const advancedSettingsSchema = z.object({
  invoiceNumberPrefix: z.string().max(10, 'Prefix must be 10 characters or less'),
  invoiceNumberSequence: z.number().min(1, 'Sequence must be at least 1'),
  defaultDueDays: z.number().min(1, 'Due days must be at least 1').max(365, 'Due days cannot exceed 365'),
  currency: z.string().min(1, 'Currency is required'),
  language: z.string().min(1, 'Language is required'),
  timezone: z.string().min(1, 'Timezone is required'),
  dateFormat: z.string().min(1, 'Date format is required'),
  fiscalYearStart: z.string().min(1, 'Fiscal year start is required'),
  fiscalYearEnd: z.string().min(1, 'Fiscal year end is required'),
  invoiceCustomization: z.object({
    logoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
    headerText: z.string().max(500, 'Header text must be 500 characters or less').optional(),
    footerText: z.string().max(500, 'Footer text must be 500 characters or less').optional(),
    termsAndConditions: z.string().max(1000, 'Terms must be 1000 characters or less').optional(),
  }),
  notificationSettings: z.object({
    invoiceCreated: z.boolean().default(true),
    invoicePaid: z.boolean().default(true),
    invoiceOverdue: z.boolean().default(true),
    monthlyReports: z.boolean().default(true),
    marketingEmails: z.boolean().default(false),
  }),
});

type AdvancedSettingsFormData = z.infer<typeof advancedSettingsSchema>;

export const AdvancedSettings: React.FC = () => {
  const { tenantId } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm<AdvancedSettingsFormData>({
    resolver: zodResolver(advancedSettingsSchema),
  });

  useEffect(() => {
    loadSettings();
  }, []);

const loadSettings = async () => {
  if (!tenantId) {
    console.warn('Tenant ID missing — cannot load settings');
    setLoading(false);
    return;
  }

  try {
    const settingsData = await settingsService.getAdvancedSettings(tenantId);
    setSettings(settingsData);
    reset(settingsData);
  } catch (error) {
    console.error('Failed to load settings:', error);
    toast.error('Failed to load settings');
  } finally {
    setLoading(false);
  }
};

const onSubmit = async (data: AdvancedSettingsFormData) => {
  if (!tenantId) {
    toast.error('Tenant ID missing');
    return;
  }

  try {
    await settingsService.updateAdvancedSettings(tenantId, data);
    toast.success('Settings updated successfully');
  } catch (error) {
    console.error('Failed to update settings:', error);
    toast.error('Failed to update settings');
  }
};

  const tabs = [
    { id: 'general', name: 'General' },
    { id: 'customization', name: 'Customization' },
    { id: 'notifications', name: 'Notifications' },
    { id: 'custom-fields', name: 'Custom Fields' },
    { id: 'api-keys', name: 'API Keys' },
    { id: 'audit-log', name: 'Audit Log' },
    { id: 'backup-restore', name: 'Backup & Restore' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-800 mb-4">Advanced Settings</h2>
      
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-6 text-sm font-medium border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'general' && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number Prefix</label>
              <input
                {...register('invoiceNumberPrefix')}
                className={`w-full p-2 border rounded-md ${errors.invoiceNumberPrefix ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="INV-"
              />
              {errors.invoiceNumberPrefix && (
                <p className="text-red-500 text-xs mt-1">{errors.invoiceNumberPrefix.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Next Invoice Number</label>
              <input
                type="number"
                {...register('invoiceNumberSequence', { valueAsNumber: true })}
                className={`w-full p-2 border rounded-md ${errors.invoiceNumberSequence ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="1001"
              />
              {errors.invoiceNumberSequence && (
                <p className="text-red-500 text-xs mt-1">{errors.invoiceNumberSequence.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Due Days</label>
              <input
                type="number"
                {...register('defaultDueDays', { valueAsNumber: true })}
                className={`w-full p-2 border rounded-md ${errors.defaultDueDays ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="30"
              />
              {errors.defaultDueDays && (
                <p className="text-red-500 text-xs mt-1">{errors.defaultDueDays.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                {...register('currency')}
                className={`w-full p-2 border rounded-md ${errors.currency ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="INR">Indian Rupee (INR)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="GBP">British Pound (GBP)</option>
              </select>
              {errors.currency && (
                <p className="text-red-500 text-xs mt-1">{errors.currency.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select
                {...register('language')}
                className={`w-full p-2 border rounded-md ${errors.language ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="ta">Tamil</option>
                <option value="te">Telugu</option>
              </select>
              {errors.language && (
                <p className="text-red-500 text-xs mt-1">{errors.language.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
              <select
                {...register('timezone')}
                className={`w-full p-2 border rounded-md ${errors.timezone ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="Asia/Kolkata">India Standard Time (IST)</option>
                <option value="UTC">Coordinated Universal Time (UTC)</option>
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="Europe/London">Greenwich Mean Time (GMT)</option>
              </select>
              {errors.timezone && (
                <p className="text-red-500 text-xs mt-1">{errors.timezone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
              <select
                {...register('dateFormat')}
                className={`w-full p-2 border rounded-md ${errors.dateFormat ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                <option value="DD MMM, YYYY">DD MMM, YYYY</option>
              </select>
              {errors.dateFormat && (
                <p className="text-red-500 text-xs mt-1">{errors.dateFormat.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fiscal Year Start</label>
              <select
                {...register('fiscalYearStart')}
                className={`w-full p-2 border rounded-md ${errors.fiscalYearStart ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="04-01">April 1</option>
                <option value="01-01">January 1</option>
                <option value="07-01">July 1</option>
              </select>
              {errors.fiscalYearStart && (
                <p className="text-red-500 text-xs mt-1">{errors.fiscalYearStart.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fiscal Year End</label>
              <select
                {...register('fiscalYearEnd')}
                className={`w-full p-2 border rounded-md ${errors.fiscalYearEnd ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="03-31">March 31</option>
                <option value="12-31">December 31</option>
                <option value="06-30">June 30</option>
              </select>
              {errors.fiscalYearEnd && (
                <p className="text-red-500 text-xs mt-1">{errors.fiscalYearEnd.message}</p>
              )}
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
      )}

      {activeTab === 'customization' && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
            <input
              {...register('invoiceCustomization.logoUrl')}
              className={`w-full p-2 border rounded-md ${errors.invoiceCustomization?.logoUrl ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="https://example.com/logo.png"
            />
            {errors.invoiceCustomization?.logoUrl && (
              <p className="text-red-500 text-xs mt-1">{errors.invoiceCustomization.logoUrl.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Header Text</label>
            <textarea
              {...register('invoiceCustomization.headerText')}
              rows={3}
              className={`w-full p-2 border rounded-md ${errors.invoiceCustomization?.headerText ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Company header information"
            />
            {errors.invoiceCustomization?.headerText && (
              <p className="text-red-500 text-xs mt-1">{errors.invoiceCustomization.headerText.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Footer Text</label>
            <textarea
              {...register('invoiceCustomization.footerText')}
              rows={3}
              className={`w-full p-2 border rounded-md ${errors.invoiceCustomization?.footerText ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Company footer information"
            />
            {errors.invoiceCustomization?.footerText && (
              <p className="text-red-500 text-xs mt-1">{errors.invoiceCustomization.footerText.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions</label>
            <textarea
              {...register('invoiceCustomization.termsAndConditions')}
              rows={5}
              className={`w-full p-2 border rounded-md ${errors.invoiceCustomization?.termsAndConditions ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Invoice terms and conditions"
            />
            {errors.invoiceCustomization?.termsAndConditions && (
              <p className="text-red-500 text-xs mt-1">{errors.invoiceCustomization.termsAndConditions.message}</p>
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
      )}

      {activeTab === 'notifications' && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Created</label>
              <p className="text-sm text-gray-500">Receive notifications when new invoices are created</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register('notificationSettings.invoiceCreated')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Paid</label>
              <p className="text-sm text-gray-500">Receive notifications when invoices are paid</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register('notificationSettings.invoicePaid')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Overdue</label>
              <p className="text-sm text-gray-500">Receive notifications when invoices become overdue</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register('notificationSettings.invoiceOverdue')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Reports</label>
              <p className="text-sm text-gray-500">Receive monthly financial reports</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register('notificationSettings.monthlyReports')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marketing Emails</label>
              <p className="text-sm text-gray-500">Receive marketing emails and product updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register('notificationSettings.marketingEmails')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
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
      )}

      {activeTab === 'custom-fields' && (
        <CustomFieldsManager />
      )}

      {activeTab === 'api-keys' && (
        <ApiKeyManager />
      )}

      {activeTab === 'audit-log' && (
        <AuditLog />
      )}

      {activeTab === 'backup-restore' && (
        <BackupRestore />
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
};
