import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useSuperUserLoginMutation } from "../../services/endpoints/authApi";
import { setCredentials, setError, selectAuthError } from "../../features/auth/authSlice";
import FormInput from "../../components/ui/FormInput";
import { Button } from "../../components/ui/Button";
import NotificationToast from "../../components/ui/NotificationToast";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/Select";
import { useApi } from '../../hooks/useApi';

const superUserLoginSchema = z.object({
  tenant: z.string(),
  email: z.string().email("Invalid email address"),
  password: z.string(),
});

type SuperUserLoginFormData = z.infer<typeof superUserLoginSchema>;

interface Tenant { 
  id: string; 
  name: string;
  businessName: string;
}
const SuperUserLogin: React.FC = () => {
    const { get } = useApi<any>();
  const [superUserLogin, { isLoading }] = useSuperUserLoginMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const authError = useAppSelector(selectAuthError);
  const [showNotification, setShowNotification] = useState(false);
  const [isClient, setIsClient] = useState(false);
    const [tenantId, setTenantId] = useState<string>('');
     const [searchTerm, setSearchTerm] = useState<string>('');  // Search term for filtering
  const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);

  const { register, handleSubmit, formState: { errors },setError: setFormError, setValue } = useForm<SuperUserLoginFormData>({
    resolver: zodResolver(superUserLoginSchema),
  });

  useEffect(() => {
    setIsClient(true);
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch {}
    dispatch(setError(null));
  }, [dispatch]);

  useEffect(() => {
    if (authError && isClient) setShowNotification(true);
  }, [authError, isClient]);

    const fetchData = async () => {
      setLoading(true);
      try {
        const tenantsResult = await get('/api/auth/all-tenants');
        setTenants(tenantsResult || []);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => { fetchData(); }, []);

  const onSubmit = async (data: SuperUserLoginFormData) => {
    // alert('Login button clicked!');
    try {
      const response = await superUserLogin({
        tenant: data.tenant,
        email: data.email,
        password: data.password,
      }).unwrap();

      dispatch(setCredentials({ user: response.user, token: response.accessToken }));
      localStorage.setItem("token", response.accessToken);
      localStorage.setItem("user", JSON.stringify(response.user));

      if (response.user?.tenantId) {
        if (response.user.role == "super_admin") {
          router.replace("/SuperAdminPage");
        } else {
          router.replace("/app/dashboard");
        }
      } else {
        router.replace("/auth/super-user-login");
      }
    } catch (err: any) {
      if (err?.data?.errors) {
        Object.entries(err.data.errors).forEach(([field, messages]) => {
          setFormError(field as keyof SuperUserLoginFormData, {
            type: "server",
            message: (messages as string[]).join(", "),
          });
        });
      } else {
        dispatch(setError(err?.data?.message || "An error occurred during login"));
      }
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } catch {}
    }
  };

    const handleTenantChange = (value: string) => {
    setTenantId(value);
    setValue('tenant', value); // Update form value
  };

  // Filter tenants based on searchTerm
  const filteredTenants = tenants.filter((tenant) =>
    tenant.businessName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tl from-gray-100 via-blue-50 to-indigo-100">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left side */}
          <div className="flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-lg shadow-lg">
            <div className="flex flex-col items-center space-y-6">
              <img src="/logo.png" alt="Company Logo" className="w-32 h-32 object-contain" />
              <h1 className="text-4xl font-bold tracking-wide">Welcome Back!</h1>
              <p className="text-lg text-center opacity-80">
                Manage your billing, invoices, and customers effortlessly.
              </p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center justify-center bg-gray-50 p-8 rounded-lg shadow-lg">
            <div className="max-w-md w-full space-y-8">
              <div>
                <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                  Or{" "}
                   <Link
                    href="/auth/login"
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    Regular login
                  </Link>
     
                </p>
              </div>

              <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">

                  <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tenant
                                      </label>
                                      <Select onValueChange={handleTenantChange} value={tenantId}>
                                        <SelectTrigger className="w-full">
                                          <SelectValue placeholder="Select Tenant" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {/* Search input inside Select dropdown */}
                                          <div className="p-2">
                                            <input
                                              type="text"
                                              className="w-full px-2 py-1 border rounded-md"
                                              placeholder="Search tenant..."
                                              value={searchTerm}
                                              onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                          </div>
                                          {/* Map filtered tenants */}
                                          {filteredTenants.map(t => (
                                            <SelectItem key={t.id} value={t.id}>
                                              {t.businessName}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      {errors.tenant && (
                                        <p className="text-red-500 text-sm">{errors.tenant.message}</p>
                                      )}
                                    </div>
                  <FormInput
                    id="email"
                    type="email"
                    label="Email address"
                    autoComplete="email"
                    required
                    error={errors.email?.message}
                    {...register("email")}
                  />

                  <FormInput
                    id="password"
                    type="password"
                    label="Password"
                    autoComplete="current-password"
                    required
                    error={errors.password?.message}
                    {...register("password")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-900">Remember me</span>
                  </label>

               
                </div>

                <Button type="submit" className="w-full" disabled={isLoading} isLoading={isLoading}>
                  Sign in
                </Button>
              </form>

              {isClient && (
                <NotificationToast show={showNotification} onClose={() => setShowNotification(false)} message={authError || ""} type="error" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperUserLogin;


