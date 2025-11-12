import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types';

interface ProductsState {
  selectedProduct: Product | null;
  filters: {
    search: string;
    active: boolean | null;
  };
}

const initialState: ProductsState = {
  selectedProduct: null,
  filters: {
    search: '',
    active: null,
  }
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedProduct: (state, action: PayloadAction<Product>) => {
      state.selectedProduct = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },
    setActiveFilter: (state, action: PayloadAction<boolean | null>) => {
      state.filters.active = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    }
  }
});

export const {
  setSelectedProduct,
  clearSelectedProduct,
  setSearchFilter,
  setActiveFilter,
  clearFilters
} = productsSlice.actions;

export default productsSlice.reducer;

export const selectSelectedProduct = (state: { products: ProductsState }) => state.products.selectedProduct;
export const selectProductFilters = (state: { products: ProductsState }) => state.products.filters;
















