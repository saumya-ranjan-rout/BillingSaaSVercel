import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
// import Button from '../../common/Button';
// import Input from '../../common/Input';
// import Select from '../../common/Select';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/Select';
import { ReportFilters as ReportFiltersType } from '../../../types/report';

const reportFiltersSchema = z.object({
  fromDate: z.string().min(1, 'From date is required'),
  toDate: z.string().min(1, 'To date is required'),
  customerIds: z.array(z.string()).optional(),
  vendorIds: z.array(z.string()).optional(),
  productIds: z.array(z.string()).optional(),
  status: z.array(z.string()).optional(),
});

type ReportFiltersFormData = z.infer<typeof reportFiltersSchema>;

interface ReportFiltersProps {
  onFiltersChange: (filters: ReportFiltersType) => void;
  onGenerate: (filters: ReportFiltersType) => void;
  loading?: boolean;
  defaultFilters?: Partial<ReportFiltersType>;
}

const ReportFilters: React.FC<ReportFiltersProps> = ({
  onFiltersChange,
  onGenerate,
  loading = false,
  defaultFilters
}) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ReportFiltersFormData>({
    resolver: zodResolver(reportFiltersSchema),
    defaultValues: {
      fromDate: defaultFilters?.fromDate || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      toDate: defaultFilters?.toDate || new Date().toISOString().split('T')[0],
      customerIds: defaultFilters?.customerIds || [],
      vendorIds: defaultFilters?.vendorIds || [],
      productIds: defaultFilters?.productIds || [],
      status: defaultFilters?.status || [],
    }
  });

  const onSubmit = (data: ReportFiltersFormData) => {
    onGenerate(data as ReportFiltersType);
  };

  // Watch form changes and notify parent
  const watchedValues = watch();
  React.useEffect(() => {
    onFiltersChange(watchedValues as ReportFiltersType);
  }, [watchedValues, onFiltersChange]);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Filters</h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          label="From Date"
          type="date"
          {...register('fromDate')}
          error={errors.fromDate?.message}
          disabled={loading}
          required
        />
        
        <Input
          label="To Date"
          type="date"
          {...register('toDate')}
          error={errors.toDate?.message}
          disabled={loading}
          required
        />
        
  <div className="flex flex-col">
  <label className="text-sm font-medium text-gray-700 mb-1">Status</label>
  <Select
    onValueChange={(value) => {
      // Convert to array because your schema expects an array
      // We’ll send it as a single-item array
      onFiltersChange({ ...watch(), status: [value] } as ReportFiltersType);
    }}
    value={watch('status')?.[0] || ''}
    disabled={loading}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select status" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="draft">Draft</SelectItem>
      <SelectItem value="sent">Sent</SelectItem>
      <SelectItem value="paid">Paid</SelectItem>
      <SelectItem value="overdue">Overdue</SelectItem>
    </SelectContent>
  </Select>
  {errors.status && (
    <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>
  )}
</div>
        
        <div className="flex items-end">
          <Button
            type="submit"
            isLoading={loading}
            className="w-full"
          >
            Apply Filters
          </Button>
        </div>
      </form>
      
      {/* Advanced filters toggle */}
      <div className="mt-4">
        <button
          type="button"
          className="text-sm text-blue-600 hover:text-blue-800"
          onClick={() => {/* Toggle advanced filters */}}
        >
          + Advanced Filters
        </button>
      </div>
    </div>
  );
};

export default ReportFilters;
