import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !isLoading) {
      if (isAuthenticated) {
        router.push('/app/dashboard');
      } else {
      
        router.push('/auth/login');
      }
    }
  }, [isAuthenticated, isLoading, router, isClient]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}
