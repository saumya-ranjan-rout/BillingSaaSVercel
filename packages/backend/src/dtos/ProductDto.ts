export interface CreateProductDto {
  name: string;
  code: string;
  description?: string;
  price: number;
  currency: string;
  isActive: boolean;
  taxRateIds?: string[];
}

export interface UpdateProductDto {
  name?: string;
  code?: string;
  description?: string;
  price?: number;
  currency?: string;
  isActive?: boolean;
  taxRateIds?: string[];
}
