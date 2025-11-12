import React from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/Button';
import { authService } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';

export function LogoutButton() {
  const router = useRouter();
  const { logout } = useAuth(); // ✅ use logout instead of clearUser

  const handleLogout = async () => {
    try {
      // Call logout API to invalidate token on server
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: authService.getAuthHeaders(),
      });
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Always clear local tokens and state
      authService.clearTokens();
      logout(); // ✅ call logout() from context
      
      // Force complete reload to clear all state
      window.location.href = '/auth/login';
    }
  };

  return (
    <Button variant="outline" onClick={handleLogout}>
      Logout
    </Button>
  );
}
