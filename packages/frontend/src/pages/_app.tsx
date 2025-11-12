import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import type { AppProps } from 'next/app';
import { store } from '../store/store';
import { useAppDispatch } from '../store/hooks';
import { setCredentials, setCurrentTenant } from '../features/auth/authSlice';
import { TenantProvider } from '../contexts/TenantContext';
import { AuthProvider } from '../contexts/AuthContext';
import '../styles/globals.css';
import { Toaster } from 'sonner';

// ✅ Import MUI date localization
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function AppContent({ Component, pageProps }: AppProps) {
  const dispatch = useAppDispatch();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      try {
        const userStr = localStorage.getItem("user");
        const tokenStr = localStorage.getItem("authToken");
        const tenantStr = localStorage.getItem("tenant");

        const user = userStr ? JSON.parse(userStr) : null;
        const token = tokenStr || null;
        const tenant = tenantStr ? JSON.parse(tenantStr) : null;

        if (user && token) {
          store.dispatch(setCredentials({ user, token }));
        }
        if (tenant) {
          store.dispatch(setCurrentTenant(tenant));
        }
      } catch (error) {
        console.error('Error restoring auth data from localStorage:', error);
      }
    }
  }, [dispatch]);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    // ✅ Wrap all components inside LocalizationProvider
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </LocalizationProvider>
  );
}

function App(props: AppProps) {
  return (
    <Provider store={store}>
      <AuthProvider>
        <TenantProvider>
          <AppContent {...props} />
        </TenantProvider>
      </AuthProvider>
    </Provider>
  );
}

export default App;



// import { useEffect, useState } from 'react';
// import { Provider } from 'react-redux';
// import type { AppProps } from 'next/app';
// import { store } from '../store/store';
// import { useAppDispatch } from '../store/hooks';
// import { setCredentials, setCurrentTenant } from '../features/auth/authSlice';
// import { TenantProvider } from '../contexts/TenantContext';
// import { AuthProvider } from '../contexts/AuthContext';
// import '../styles/globals.css';
// import { Toaster } from 'sonner';

// function AppContent({ Component, pageProps }: AppProps) {
//   const dispatch = useAppDispatch();
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);

//     if (typeof window !== 'undefined') {
//       try {
  


// const userStr = localStorage.getItem("user");
// const tokenStr = localStorage.getItem("authToken");
// const tenantStr = localStorage.getItem("tenant");

// const user = userStr ? JSON.parse(userStr) : null;
// const token = tokenStr || null;  // ✅ no JSON.parse needed
// const tenant = tenantStr ? JSON.parse(tenantStr) : null;

// if (user && token) {
//   store.dispatch(setCredentials({ user, token }));
// }
// if (tenant) {
//   store.dispatch(setCurrentTenant(tenant));
// }
//       } catch (error) {
//         console.error('Error restoring auth data from localStorage:', error);
//       }
//     }
//   }, [dispatch]);

//   if (!isClient) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <Component {...pageProps} />
//       <Toaster position="top-right" />
//     </>
//   );
// }

// function App(props: AppProps) {
//   return (
//     <Provider store={store}>
//       <AuthProvider>
//         <TenantProvider>
//           <AppContent {...props} />
//         </TenantProvider>
//       </AuthProvider>
//     </Provider>
//   );
// }

// export default App;

































































