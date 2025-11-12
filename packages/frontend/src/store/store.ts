import { configureStore } from '@reduxjs/toolkit';
import { api } from '../services/api'; // if you have a base api
import { authApi } from '../services/endpoints/authApi';
import { purchasesApi } from '../services/endpoints/purchasesApi';

import authReducer from '../features/auth/authSlice';
import invoicesReducer from '../features/invoices/invoicesSlice';
import customersReducer from '../features/customers/customersSlice';
import productsReducer from '../features/products/productsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    invoices: invoicesReducer,
    customers: customersReducer,
    products: productsReducer,

    // register all api reducers
    [api.reducerPath]: api.reducer,
    // [authApi.reducerPath]: authApi.reducer,
    [purchasesApi.reducerPath]: purchasesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
        ignoredPaths: ['api.mutations'],
      },
    })
      // add all api middlewares
      .concat(api.middleware)
      // .concat(authApi.middleware)
      .concat(purchasesApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


