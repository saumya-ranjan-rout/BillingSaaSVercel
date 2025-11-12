import { useContext } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import {
  selectCurrentUser,
  selectCurrentToken,
  selectAuthLoading,
  logout, // ✅ correct import
} from '../features/auth/authSlice';
import { useRouter } from 'next/router';

// ✅ Enhanced useAuth Hook
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const user = useAppSelector(selectCurrentUser);
  const token = useAppSelector(selectCurrentToken);
  const isLoading = useAppSelector(selectAuthLoading);

  // ✅ Extract tenantId safely (if available)
  const tenantId = user?.tenantId || null;

  // ✅ Add logout functionality
const handleLogout = () => {
    try {
      // ✅ Redux logout
      dispatch(logout());

      // ✅ Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    user,
    token,
    tenantId,
    isLoading,
    isAuthenticated: !!user && !!token,
    logout: handleLogout, // ✅ use correct function
  };
};
