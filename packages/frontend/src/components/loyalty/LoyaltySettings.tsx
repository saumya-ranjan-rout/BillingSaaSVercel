import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
// import Button from '../common/Button';
// import Input from '../common/Input';
// import Select from '../common/Select';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
// import { Select } from '@/components/ui/Select';
import { useApi } from '../../hooks/useApi';
import { toast } from 'sonner';
import {Select, SelectTrigger, SelectContent, SelectItem, SelectValue} from "@/components/ui/Select";

interface LoyaltySettingsProps {
  program: any;        // should include id
  onUpdate: () => void;
}

const LoyaltySettings: React.FC<LoyaltySettingsProps> = ({ program, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const { put, get } = useApi();

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    defaultValues: program
  });

  const rewardType = watch('rewardType');

  // 🔹 Ensure form updates when program changes
  useEffect(() => {
    if (program) {
      Object.keys(program).forEach(key => {
        setValue(key, program[key]);
      });
    }
  }, [program, setValue]);

  const onSubmit = async (data: any) => {
    console.log(data);
    if (!program?.id) {
      toast.error("Program ID is missing");
      return;
    }
    setLoading(true);
    try {
      await put(`/api/loyalty/program/${program.id}`, data);
      toast.success('Loyalty program updated successfully');
      onUpdate();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update program');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Loyalty Program Settings</h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
  <Input
  label="Program Name"
  {...register('name', { required: 'Program name is required' })}
  error={String(errors.name?.message || '')}
/>


 <div>
  <label className="block text-sm font-medium mb-1">Reward Type</label>
  <Select
    value={watch('rewardType')}
    onValueChange={(value) => setValue('rewardType', value)}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select Reward Type" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="cashback">Cashback</SelectItem>
      <SelectItem value="points">Points</SelectItem>
      <SelectItem value="discount">Discount</SelectItem>
    </SelectContent>
  </Select>
</div>

        {rewardType === 'cashback' && (
          <>
            <Input
              label="Cashback Percentage"
              type="number"
              step="0.1"
              {...register('cashbackPercentage', { 
                required: 'Percentage is required',
                min: { value: 0, message: 'Percentage must be positive' },
                max: { value: 100, message: 'Percentage cannot exceed 100' }
              })}
           error={String(errors.cashbackPercentage?.message || '')}
            />

            <Input
              label="Minimum Purchase Amount (₹)"
              type="number"
              {...register('minimumPurchaseAmount', { 
                required: 'Minimum amount is required',
                min: { value: 0, message: 'Amount must be positive' }
              })}
              error={String(errors.minimumPurchaseAmount?.message || '')}
            />

            <Input
              label="Maximum Cashback Amount (₹)"
              type="number"
              {...register('maximumCashbackAmount', { 
                min: { value: 0, message: 'Amount must be positive' }
              })}
           error={String(errors.maximumCashbackAmount?.message || '')}
            />
          </>
        )}

        {rewardType === 'points' && (
          <>
            <Input
              label="Points per ₹100 spent"
              type="number"
              {...register('pointsPerUnit', { 
                required: 'Points per unit is required',
                min: { value: 1, message: 'Must be at least 1 point' }
              })}
              error={String(errors.pointsPerUnit?.message || '')}
            />

            <Input
              label="Point Value (₹)"
              type="number"
              step="0.01"
              {...register('pointValue', { 
                required: 'Point value is required',
                min: { value: 0.01, message: 'Value must be positive' }
              })}
              error={String(errors.pointValue?.message || '')}
            />
          </>
        )}

        <Button
          type="submit"
          isLoading={loading}
          className="w-full"
        >
          Update Program
        </Button>
      </form>
    </div>
  );
};

export default LoyaltySettings;

