import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Invoice } from '../../types';

interface InvoicesState {
  selectedInvoice: Invoice | null;
  filters: {
    status: string;
    customer: string;
    dateRange: {
      start: string;
      end: string;
    };
  };
}

const initialState: InvoicesState = {
  selectedInvoice: null,
  filters: {
    status: 'all',
    customer: '',
    dateRange: {
      start: '',
      end: ''
    }
  }
};

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    setSelectedInvoice: (state, action: PayloadAction<Invoice>) => {
      state.selectedInvoice = action.payload;
    },
    clearSelectedInvoice: (state) => {
      state.selectedInvoice = null;
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.filters.status = action.payload;
    },
    setCustomerFilter: (state, action: PayloadAction<string>) => {
      state.filters.customer = action.payload;
    },
    setDateRangeFilter: (state, action: PayloadAction<{ start: string; end: string }>) => {
      state.filters.dateRange = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    }
  }
});

export const {
  setSelectedInvoice,
  clearSelectedInvoice,
  setStatusFilter,
  setCustomerFilter,
  setDateRangeFilter,
  clearFilters
} = invoicesSlice.actions;

export default invoicesSlice.reducer;

// Selectors
export const selectSelectedInvoice = (state: { invoices: InvoicesState }) => state.invoices.selectedInvoice;
export const selectInvoiceFilters = (state: { invoices: InvoicesState }) => state.invoices.filters;
