import React, { useEffect, useState } from 'react'; 
import { useForm, Controller } from 'react-hook-form'; 
import { zodResolver } from '@hookform/resolvers/zod'; 
import { z } from 'zod'; 
// import Button from '../common/Button'; 
// import Input from '../common/Input'; 
// import Select from '../common/Select'; 
import { Button } from '@/components/ui/Button'; 
import { Input } from '@/components/ui/Input'; 
// import { Select } from '@/components/ui/Select';
import { useApi } from '../../hooks/useApi'; 
import { Product, Category } from '../../types'; 
import { toast } from 'sonner'; 
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue} from "@/components/ui/Select";

const productSchema = z.object({ 
name: z.string().min(1, 'Name is required'), 
description: z.string().optional(), 
type: z.union([
  z.literal(''),
  z.enum(['goods', 'service', 'digital'])
]).refine((val) => val !== '', {
  message: 'Product Type is required'
}), 
sku: z.string().optional(), 
hsnCode: z.string().optional(), 
costPrice: z.number().min(0, 'Cost price must be positive'), 
sellingPrice: z.number().min(0, 'Selling price must be positive'), 
stockQuantity: z.number().min(0).default(0), 
lowStockThreshold: z.number().min(0).default(0), 
unit: z.string().optional(), 
taxRate: z.number().min(0).max(100).default(0), 
categoryId: z.string().optional(), // Made optional to allow new category creation 
categoryName: z.string().optional(), // Added for new category creation 
isActive: z.boolean().default(true), 
}); 
type ProductFormData = z.infer<typeof productSchema>; 
interface ProductFormProps { 
product?: Product | null; 
onSuccess: () => void; 
onCancel: () => void; 
} 
const ProductForm: React.FC<ProductFormProps> = ({ 
product, 
onSuccess, 
onCancel, 
}) => { 
const [categories, setCategories] = useState<Category[]>([]); 
const [loading, setLoading] = useState(true); 
const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false); 
// const { post, put, get } = useApi<Product>(); 
const { post, put, get } = useApi<Category[]>();
const { 
register, 
handleSubmit, 
control, 
formState: { errors, isSubmitting }, 
setValue, 
reset, 
watch, 
} = useForm<ProductFormData>({ 
resolver: zodResolver(productSchema), 
defaultValues: { 
  type: '' as ProductFormData['type'], 
  categoryId: '', 
  categoryName: '', 
  costPrice: 0, 
  sellingPrice: 0, 
  stockQuantity: 0, 
  lowStockThreshold: 0, 
  taxRate: 0, 
  isActive: true, 
},
}); 
const productType = watch('type'); 
const categoryId = watch('categoryId'); 
  const categoryName = watch('categoryName'); 
 
  // useEffect(() => { 
  //   const fetchCategories = async () => { 
  //     try { 
  //       const response = await get('/api/products/categories?limit=100'); 
  //       console.log('Categories fetched:', response);
  //      setCategories(response);
  //     } catch (error: any) { 
  //       console.error('Failed to fetch categories:', error); 
  //       toast.error(error?.message || 'Failed to load categories'); 
  //     } finally { 
  //       setLoading(false); 
  //     } 
  //   }; 
 
  //   fetchCategories(); 
  // }, [get]); 

  useEffect(() => {
const fetchCategories = async () => {
  try {
    const response: any = await get('/api/products/categories?limit=100'); // 👈 explicitly typed

    // ✅ Handle all response shapes safely
    const data = Array.isArray(response)
      ? response
      : Array.isArray(response?.data)
      ? response.data
      : [];

    setCategories(data);
  } catch (error: any) {
    console.error('Failed to fetch categories:', error);
    toast.error(error?.message || 'Failed to load categories');
  } finally {
    setLoading(false);
  }
};



  fetchCategories();
}, [get]);
 
  useEffect(() => { 
    if (product) { 
      reset({ 
        name: product.name, 
        description: product.description || '', 
        type: product.type, 
        sku: product.sku || '', 
        hsnCode: product.hsnCode || '', 
        costPrice: Number(product.costPrice), 
        sellingPrice: Number(product.sellingPrice), 
        stockQuantity: Number(product.stockQuantity), 
        lowStockThreshold: Number(product.lowStockThreshold), 
        taxRate: Number(product.taxRate), 
        unit: product.unit || '', 
        categoryId: product.categoryId || '', 
        categoryName: '', // Clear category name for existing product 
        isActive: product.isActive, 
      }); 
    } 
  }, [product, reset]); 
 
  // Handle category selection change 
  const handleCategoryChange = (value: string) => { 
    if (value === 'create_new') { 
      setIsCreatingNewCategory(true); 
      setValue('categoryId', ''); 
      setValue('categoryName', ''); 
    } else { 
      setIsCreatingNewCategory(false); 
      setValue('categoryId', value); 
      setValue('categoryName', ''); 
    } 
  }; 
 
  const onSubmit = async (data: ProductFormData) => { 
    try { 
      const payload = { 
        ...data, 
        ...(productType !== 'goods' ? { stockQuantity: 0, lowStockThreshold: 0 } : {}), 
      }; 
 
      // If creating a new category, ensure categoryName is provided 
      if (isCreatingNewCategory && !data.categoryName) { 
        toast.error('Please enter a category name or select an existing category'); 
        return; 
      } 
 
      // If using existing category, ensure categoryId is provided 
      if (!isCreatingNewCategory && !data.categoryId) { 
        toast.error('Please select a category'); 
        return; 
      } 
 
      // Remove categoryName if not creating new category 
      if (!isCreatingNewCategory) { 
        delete payload.categoryName; 
      } 
 
      // Remove categoryId if creating new category (backend will use categoryName) 
      if (isCreatingNewCategory) { 
        delete payload.categoryId; 
      } 
 
      if (product?.id) { 
        await put(`/api/products/${product.id}`, payload); 
        toast.success('Product updated successfully'); 
      } else { 
        await post('/api/products', payload); 
        toast.success('Product created successfully'); 
      } 
       
      onSuccess(); 
    } catch (error: any) { 
      console.error('Failed to save product:', error); 
      toast.error(error?.message || 'Failed to save product'); 
    } 
  }; 
 
  if (loading) return <div>Loading...</div>; 
 
  return ( 
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4"> 
      {/* Name + Type */} 
   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
    
    {/* Product Name */}
    <div>
      <Input
        label="Product Name"
        {...register('name')}
        error={errors.name?.message}
        disabled={isSubmitting}
        required
      />
    </div>

    {/* Product Type */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Product Type
      </label>
      <Select
        onValueChange={(value: 'goods' | 'service' | 'digital') =>
          setValue('type', value)
        }
        value={watch('type')}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="goods">Goods</SelectItem>
          <SelectItem value="service">Service</SelectItem>
          <SelectItem value="digital">Digital</SelectItem>
        </SelectContent>
      </Select>
      {errors.type && (
        <p className="text-red-500 text-sm">{errors.type.message}</p>
      )}
    </div>

  </div>
     
 
      {/* Description */} 
      <Input 
        label="Description" 
        {...register('description')} 
        error={errors.description?.message} 
        disabled={isSubmitting} 
        // multiline 
      /> 
 
      {/* SKU + HSN */} 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
        <Input 
          label="SKU" 
          {...register('sku')} 
          error={errors.sku?.message} 
          disabled={isSubmitting} 
        /> 
        <Input 
          label="HSN Code" 
          {...register('hsnCode')} 
          error={errors.hsnCode?.message} 
          disabled={isSubmitting} 
        /> 
      </div> 
 
      {/* Prices */} 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> 
        <Input 
          label="Cost Price (₹)" 
          type="number" 
          step="0.01" 
          {...register('costPrice', { valueAsNumber: true })} 
          error={errors.costPrice?.message} 
          disabled={isSubmitting} 
          required 
        /> 
        <Input 
          label="Selling Price (₹)" 
          type="number" 
          step="0.01" 
          {...register('sellingPrice', { valueAsNumber: true })} 
          error={errors.sellingPrice?.message} 
          disabled={isSubmitting} 
          required 
        /> 
        <Input 
          label="Tax Rate (%)" 
          type="number" 
          step="0.01" 
          {...register('taxRate', { valueAsNumber: true })} 
          error={errors.taxRate?.message} 
          disabled={isSubmitting} 
        /> 
      </div> 
 
      {/* Goods-only fields */} 
      {productType === 'goods' && ( 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> 
          <Input 
            label="Stock Quantity" 
            type="number" 
            step="0.01" 
            {...register('stockQuantity', { valueAsNumber: true })} 
            error={errors.stockQuantity?.message} 
            disabled={isSubmitting} 
            required 
          /> 
          <Input 
            label="Low Stock Threshold" 
            type="number" 
            step="0.01" 
            {...register('lowStockThreshold', { valueAsNumber: true })} 
            error={errors.lowStockThreshold?.message} 
            disabled={isSubmitting} 
          /> 
          <Input 
            label="Unit" 
            {...register('unit')} 
            error={errors.unit?.message} 
            disabled={isSubmitting} 
            placeholder="pcs, kg, units" 
            required 
          /> 
        </div> 
      )} 
 
      {/* Category Selection */} 
      <div className="space-y-2"> 
         
        {!isCreatingNewCategory ? ( 
          <div className="space-y-2"> 
      
  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
  <Select onValueChange={handleCategoryChange} value={categoryId}>
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Select Category" />
    </SelectTrigger>
    <SelectContent>
      {categories.map((c) => (
        <SelectItem key={c.id} value={c.id}>
          {c.name}
        </SelectItem>
      ))}
      <SelectItem value="create_new">+ Create New Category</SelectItem>
    </SelectContent>
  </Select>
  {errors.categoryId && (
    <p className="text-red-500 text-sm">{errors.categoryId.message}</p>
  )}
</div>
       
        ) : ( 
          <div className="space-y-2"> 
            <div className="flex gap-2"> 
              <Input 
                placeholder="Enter new category name" 
                {...register('categoryName')} 
                error={errors.categoryName?.message} 
                disabled={isSubmitting} 
                className="flex-1" 
              /> 
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => { 
                  setIsCreatingNewCategory(false); 
                  setValue('categoryName', ''); 
                  setValue('categoryId', ''); 
                }} 
                disabled={isSubmitting} 
              > 
                Cancel 
              </Button> 
            </div> 
            {errors.categoryName && ( 
              <p className="text-red-500 text-sm">{errors.categoryName?.message}</p> 
            )} 
          </div> 
        )} 
      </div> 
 
      {/* Active Checkbox */} 
      <div className="flex items-center"> 
        <input 
          type="checkbox" 
          {...register('isActive')} 
          className="h-4 w-4 text-blue-600 border-gray-300 rounded" 
        /> 
        <label className="ml-2 text-sm text-gray-900">Active Product</label> 
      </div> 
 
      {/* Buttons */} 
      <div className="flex justify-end space-x-3 pt-4"> 
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          disabled={isSubmitting} 
        > 
          Cancel 
        </Button> 
        <Button type="submit" isLoading={isSubmitting}> 
          {product ? 'Update Product' : 'Create Product'} 
</Button> 
</div> 
</form> 
); 
}; 
export default ProductForm; 