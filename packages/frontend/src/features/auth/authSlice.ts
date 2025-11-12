import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { User, Tenant, AuthState } from '../../types';

// ✅ Helper to safely access localStorage
const getStoredItem = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Error accessing localStorage for key ${key}:`, error);
    return null;
  }
};

// ✅ Try to get stored auth data from localStorage
const getStoredAuthState = (): Partial<AuthState> => {
  try {
    const token = getStoredItem('authToken');
    const userStr = getStoredItem('user');
    const tenantStr = getStoredItem('currentTenant');
    return {
      token: token || null,
      user: userStr ? JSON.parse(userStr) : null,
      currentTenant: tenantStr ? JSON.parse(tenantStr) : null,
    };
  } catch (error) {
    console.error('Failed to parse stored auth state:', error);
    return {
      token: null,
      user: null,
      currentTenant: null,
    };
  }
};

const storedState = getStoredAuthState();

const initialState: AuthState = {
  user: storedState.user || null,
  token: storedState.token || null,
  isLoading: false,
  error: null,
  currentTenant: storedState.currentTenant || null,
};

// ✅ Async thunk to refresh access token
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refresh = localStorage.getItem('refreshToken');
      if (!refresh) throw new Error('No refresh token found');

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
        refreshToken: refresh,
      });

      const newToken = response.data?.accessToken;
      if (newToken) {
        localStorage.setItem('authToken', newToken);
        return newToken;
      } else {
        throw new Error('Invalid refresh token response');
      }
    } catch (error: any) {
      console.error('Token refresh failed:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to refresh token');
    }
  }
);

// ✅ Main Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string; refreshToken?: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('user', JSON.stringify(action.payload.user));
          localStorage.setItem('authToken', action.payload.token);
          if (action.payload.refreshToken) {
            localStorage.setItem('refreshToken', action.payload.refreshToken);
          }
        } catch (error) {
          console.error('Error storing auth data:', error);
        }
      }
    },

    setCurrentTenant: (state, action: PayloadAction<Tenant>) => {
      state.currentTenant = action.payload;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('currentTenant', JSON.stringify(action.payload));
        } catch (error) {
          console.error('Error storing tenant data:', error);
        }
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.currentTenant = null;
      state.error = null;
      state.isLoading = false;

      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          localStorage.removeItem('currentTenant');
        } catch (error) {
          console.error('Error clearing auth data:', error);
        }
      }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(refreshToken.fulfilled, (state, action) => {
      state.token = action.payload;
    });
  },
});

export const { setCredentials, setCurrentTenant, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer;

// ✅ Selectors
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectCurrentToken = (state: { auth: AuthState }) => state.auth.token;
export const selectCurrentTenant = (state: { auth: AuthState }) => state.auth.currentTenant;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
