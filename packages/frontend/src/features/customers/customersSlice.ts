import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Customer } from '../../types';

interface CustomersState {
  selectedCustomer: Customer | null;
  filters: {
    search: string;
  };
}

const initialState: CustomersState = {
  selectedCustomer: null,
  filters: {
    search: '',
  }
};

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setSelectedCustomer: (state, action: PayloadAction<Customer>) => {
      state.selectedCustomer = action.payload;
    },
    clearSelectedCustomer: (state) => {
      state.selectedCustomer = null;
    },
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    }
  }
});

export const {
  setSelectedCustomer,
  clearSelectedCustomer,
  setSearchFilter,
  clearFilters
} = customersSlice.actions;

export default customersSlice.reducer;

export const selectSelectedCustomer = (state: { customers: CustomersState }) => state.customers.selectedCustomer;
export const selectCustomerFilters = (state: { customers: CustomersState }) => state.customers.filters;
