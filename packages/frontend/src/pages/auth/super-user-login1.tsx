import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormInput from "../../components/ui/FormInput";
import { Button } from "../../components/ui/Button";
import { useApi } from '../../hooks/useApi';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/Select";
import Link from "next/link";

// Schema for validating Super User Login form
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
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<SuperUserLoginFormData>({
    resolver: zodResolver(superUserLoginSchema),
  });
  const { get } = useApi<any>();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tenantId, setTenantId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');  // Search term for filtering

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

  const onSubmit = (data: SuperUserLoginFormData) => {
    console.log("Super User Login data", data);
    router.push('/SuperAdminPage'); // Redirect to the super admin page after successful login
  };

  const handleTenantChange = (value: string) => {
    setTenantId(value);
    setValue('tenant', value); // Update form value
  };

  // Filter tenants based on searchTerm
  const filteredTenants = tenants.filter((tenant) =>
    tenant.businessName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tl from-gray-100 via-blue-50 to-indigo-100">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side - Branding */}
          <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-r from-blue-600 to-purple-700 text-white p-8 rounded-lg shadow-lg">
            <div className="flex flex-col items-center space-y-6">
              <img
                src="/logo.png"
                alt="Company Logo"
                className="w-32 h-32 object-contain"
              />
              <h1 className="text-4xl font-bold tracking-wide">Super User Login</h1>
              <p className="text-lg text-center opacity-80">
                Access the admin features for managing tenants.
              </p>
            </div>
          </div>

          {/* Right Side - Super User Login Form */}
          <div className="flex items-center justify-center bg-gray-50 p-8 rounded-lg shadow-lg">
            <div className="max-w-md w-full space-y-8">
              <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                  {/* Tenant Dropdown with Search (Single Field) */}
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

                  {/* Email Field */}
                  <FormInput
                    id="email"
                    type="email"
                    label="Email address"
                    autoComplete="email"
                    required
                    error={errors.email?.message}
                    {...register("email")}
                  />

                  {/* Password Field */}
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

                <Button type="submit" className="w-full">
                  Log In
                </Button>
              </form>

              {/* Link to the Regular User Login Page */}
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Or{" "}
                  <Link
                    href="/auth/login"
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    Regular login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperUserLogin;
