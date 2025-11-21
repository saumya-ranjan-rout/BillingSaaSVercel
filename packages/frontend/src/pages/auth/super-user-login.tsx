"use client";

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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/Select";
import { useApi } from "../../hooks/useApi";
import Image from "next/image";

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-gray-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#f2f4ff] px-4">

      {/* TOP RIGHT — Regular Login */}
      <div className="absolute top-6 right-6">
        <Link href="/auth/login">
          <button className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-medium text-sm">
            Regular Login
          </button>
        </Link>
      </div>

      {/* MAIN CONTAINER */}
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* LEFT PANEL */}
         <div className="p-12 bg-gradient-to-b from-[#6b4efc] to-[#386bfd] text-white flex flex-col justify-center">

          <h1 className="text-4xl font-bold mb-4">Super User Access</h1>

          <p className="text-lg opacity-90 mb-6">
            Manage tenants, settings, billing and elevated controls.
          </p>

          <ul className="space-y-3 text-white text-sm opacity-95">
            <li>• Multi-tenant access</li>
            <li>• Elevated permissions</li>
            <li>• Secure & encrypted login</li>
          </ul>

          {/* Illustration */}
          <div className="mt-10 w-56 h-56 relative mx-auto">
            <Image
              src="/superuser-illustration.png"
              alt="Super user illustration"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="p-10 md:p-14 flex items-center">
          <div className="w-full">

            {/* ⭐ LOGO ADDED HERE (same as previous login page) */}
            <div className="flex justify-center mb-6">
              <Image
                src="/logo.png"
                alt="Logo"
                width={120}
                height={120}
                className="object-contain"
              />
          </div>

            <h2 className="text-3xl font-semibold text-center text-slate-900">
              Super User Login
            </h2>

            <p className="mt-2 mb-8 text-center text-sm text-slate-600">
              Choose a tenant and enter your credentials.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              {/* TENANT */}
               <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Tenant</label>

                  <Select onValueChange={(v) => setValue("tenant", v)}>
                                        <SelectTrigger className="w-full">
                                          <SelectValue placeholder="Select Tenant" />
                                        </SelectTrigger>
                                        <SelectContent>
                                        
                                          <div className="p-2">
                                            <input
                                              type="text"
                                              className="w-full px-2 py-1 border rounded-md"
                                              placeholder="Search tenant..."
                                              value={searchTerm}
                                              onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                          </div>
                                      
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
                 

      
             <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-slate-700">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600"                     />
                    <span>Remember me</span>
                  </label>

                <Link href="/auth/forgot-password" className="text-blue-600 hover:underline">
                  Forgot password?
                </Link>
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
      
   
  );
};

export default SuperUserLogin;


