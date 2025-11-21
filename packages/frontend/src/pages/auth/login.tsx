"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useLoginMutation } from "../../services/endpoints/authApi";
import { setCredentials, setError, selectAuthError } from "../../features/auth/authSlice";
import FormInput from "../../components/ui/FormInput";
import { Button } from "../../components/ui/Button";
import NotificationToast from "../../components/ui/NotificationToast";
import Image from "next/image";

/* ---------------- Schema ---------------- */
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string(),
});
type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const authError = useAppSelector(selectAuthError);
  const [showNotification, setShowNotification] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const { register, handleSubmit, formState: { errors }, setError: setFormError } =
    useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

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

  const onSubmit = async (data: LoginFormData) => {
    // alert('Login button clicked!');
    try {
      const response = await login({
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
      if (response.check_subscription) {
  router.replace("/app/dashboard");
} else {
  router.replace("/app/subscription");
}
        
        }
      } else {
        router.replace("/auth/login");
      }
    } catch (err: any) {
      if (err?.data?.errors) {
        Object.entries(err.data.errors).forEach(([field, messages]) => {
          setFormError(field as keyof LoginFormData, {
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

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-700"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#f2f4ff] px-4">

      {/* Top Right — Super User Button */}
      <div className="absolute top-6 right-6">
        <Link href="/auth/super-user-login">
          <button className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-medium text-sm">
            Super User Login
          </button>
        </Link>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* LEFT PANEL - Gradient welcome section */}
        <div className="p-12 bg-gradient-to-b from-[#6b4efc] to-[#386bfd] text-white flex flex-col justify-center">

          <h1 className="text-4xl font-bold mb-4">Welcome back</h1>

          <p className="text-lg opacity-90 mb-6">
            Sign in to manage billing, invoices, customers and subscriptions.
          </p>

          <ul className="space-y-3 text-white text-sm opacity-95">
            <li>• Secure & encrypted</li>
            <li>• Role-based access control</li>
            <li>• Audit logs & analytics</li>
          </ul>

          <div className="mt-10 w-56 h-56 relative mx-auto">
            <Image
              src="/login-illustrations.png" // Illustration
              alt="Illustration"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>

        {/* RIGHT PANEL – Login Form */}
        <div className="p-10 md:p-14 flex items-center">
          <div className="w-full">

            {/* ⭐ LOGO HERE */}
            <div className="flex justify-center mb-6">
              <Image
                src="/logo.png"
                alt="Logo"
                width={120}
                height={120}
                className="object-contain"
              />
          </div>

            <h2 className="text-3xl font-semibold text-slate-900 text-center">
              Sign in to your account
            </h2>

            <p className="mt-2 mb-8 text-center text-sm text-slate-600">
              Or{" "}
              <Link href="/auth/register" className="text-blue-600 hover:underline">
                create a new account
              </Link>
                </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                {/* </div> */}

              <div className="flex items-center justify-between text-sm mt-2">
                <label className="flex items-center gap-2 text-slate-700">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  <span>Remember me</span>
                  </label>

                <Link href="/auth/forgot-password" className="text-blue-600 hover:underline">
                  Forgot password?
                </Link>
                </div>

              <Button type="submit" disabled={isLoading} isLoading={isLoading} className="w-full">
                  Sign in
                </Button>
              </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              By signing in you agree to our{" "}
              <Link href="/terms" className="text-blue-600 hover:underline">Terms</Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
            </p>

              {isClient && (
              <NotificationToast
                show={showNotification}
                onClose={() => setShowNotification(false)}
                message={authError || ""}
                type="error"
              />
              )}
          </div>
        </div>
      </div>
     </div>
  );
};

export default Login;





//    <Link href="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  //   Forgot your password?
                  // </Link>
































// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/router";
// import Link from "next/link";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useAppDispatch, useAppSelector } from "../../store/hooks";
// import { useLoginMutation } from "../../services/endpoints/authApi";
// import {
//   setCredentials,
//   setError,
//   selectAuthError,
// } from "../../features/auth/authSlice";
// import FormInput from "../../components/ui/FormInput";
// import { Button } from "../../components/ui/Button";
// import NotificationToast from "../../components/ui/NotificationToast";

// const loginSchema = z.object({
//   email: z.string().email("Invalid email address"),
//   password: z.string(),
// });
// type LoginFormData = z.infer<typeof loginSchema>;

// const Login: React.FC = () => {
//   const [login, { isLoading }] = useLoginMutation();
//   const dispatch = useAppDispatch();
//   const router = useRouter();
//   const authError = useAppSelector(selectAuthError);
//   const [showNotification, setShowNotification] = useState(false);
//   const [isClient, setIsClient] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setError: setFormError,
//   } = useForm<LoginFormData>({
//     resolver: zodResolver(loginSchema),
//   });

//   /** Clear any stale tokens on first mount */
//   useEffect(() => {
//     setIsClient(true);
//     try {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//     } catch {}
//     dispatch(setError(null));
//   }, [dispatch]);

//   /** Show toast on auth error */
//   useEffect(() => {
//     if (authError && isClient) setShowNotification(true);
//   }, [authError, isClient]);

//   const onSubmit = async (data: LoginFormData) => {
//     try {
//       const response = await login({
//         email: data.email,
//         password: data.password,
//       }).unwrap();

//       // Persist creds in Redux
//       dispatch(
//         setCredentials({ user: response.user, token: response.accessToken })
//       );

//       // Also persist in localStorage for axios interceptors
//       localStorage.setItem("token", response.accessToken);
//       localStorage.setItem("user", JSON.stringify(response.user));
// console.log("🚀 ~ file: login.tsx:78 ~ onSubmit ~ response.user:", response.user)
//       // Navigate once router is ready
//       if (response.user?.tenantId) {
//         if(response.user.role == 'super_admin'){
//           router.replace("/SuperAdminPage");
//         }else{
//               router.replace("/app/dashboard");
//         }
    
//       } else {
//         router.replace("/auth/login");
//       }
//     } catch (err: any) {
//       // handle form-field errors
//       if (err?.data?.errors) {
//         Object.entries(err.data.errors).forEach(([field, messages]) => {
//           setFormError(field as keyof LoginFormData, {
//             type: "server",
//             message: (messages as string[]).join(", "),
//           });
//         });
//       } else {
//         dispatch(
//           setError(err?.data?.message || "An error occurred during login")
//         );
//       }
//       // Clear tokens on any login failure
//       try {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//       } catch {}
//     }
//   };

//   if (!isClient) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
//       {/* Left side */}
//       <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 text-white p-12">
//         <div className="flex flex-col items-center space-y-6">
//           <img
//             src="/logo.png"
//             alt="Company Logo"
//             className="w-32 h-32 object-contain"
//           />
//           <h1 className="text-4xl font-bold tracking-wide">Welcome Back!</h1>
//           <p className="text-lg text-center opacity-80">
//             Manage your billing, invoices, and customers effortlessly.
//           </p>
//         </div>
//       </div>

//       {/* Right side */}
//       <div className="flex items-center justify-center bg-gray-50 p-8">
//         <div className="max-w-md w-full space-y-8 bg-white shadow-2xl rounded-2xl p-8">
//        <Link
//                 href="/auth//super-user-login"
//                 className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
//               >
//                Super User Login
//               </Link>
//           <div>
//             <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
//               Sign in to your account
//             </h2>
//             <p className="mt-2 text-center text-sm text-gray-600">
//               Or{" "}
//               <Link
//                 href="/auth/register"
//                 className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
//               >
//                 create a new account
//               </Link>
//             </p>
//           </div>

//           <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
//             <div className="space-y-4">
//               <FormInput
//                 id="email"
//                 type="email"
//                 label="Email address"
//                 autoComplete="email"
//                 required
//                 error={errors.email?.message}
//                 {...register("email")}
//               />

//               <FormInput
//                 id="password"
//                 type="password"
//                 label="Password"
//                 autoComplete="current-password"
//                 required
//                 error={errors.password?.message}
//                 {...register("password")}
//               />
//             </div>

//             <div className="flex items-center justify-between">
//               <label className="flex items-center space-x-2">
//                 <input
//                   id="remember-me"
//                   name="remember-me"
//                   type="checkbox"
//                   className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                 />
//                 <span className="text-sm text-gray-900">Remember me</span>
//               </label>

//               <Link
//                 href="/forgot-password"
//                 className="text-sm font-medium text-blue-600 hover:text-blue-500"
//               >
//                 Forgot your password?
//               </Link>
//             </div>

//             <Button
//               type="submit"
//               className="w-full"
//               disabled={isLoading}
//                isLoading={isLoading} 
//             >
//               Sign in
//             </Button>
//           </form>

//           {isClient && (
//             <NotificationToast
//               show={showNotification}
//               onClose={() => setShowNotification(false)}
//               message={authError || ""}
//               type="error"
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;











// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/router";
// import Link from "next/link";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useAppDispatch, useAppSelector } from "../../store/hooks";
// import { useLoginMutation } from "../../services/endpoints/authApi";
// import {
//   setCredentials,
//   setError,
//   selectAuthError,
// } from "../../features/auth/authSlice";
// import FormInput from "../../components/ui/FormInput";
// import { Button } from "../../components/ui/Button";
// import NotificationToast from "../../components/ui/NotificationToast";

// const loginSchema = z.object({
//   email: z.string().email("Invalid email address"),
//   password: z.string(),
// });

// type LoginFormData = z.infer<typeof loginSchema>;

// const Login: React.FC = () => {
//   const [login, { isLoading }] = useLoginMutation();
//   const dispatch = useAppDispatch();
//   const router = useRouter();
//   const authError = useAppSelector(selectAuthError);
//   const [showNotification, setShowNotification] = useState(false);
//   const [isClient, setIsClient] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setError: setFormError,
//   } = useForm<LoginFormData>({
//     resolver: zodResolver(loginSchema),
//   });

//   useEffect(() => {
//     setIsClient(true);
//     dispatch(setError(null));
//   }, [dispatch]);

//   useEffect(() => {
//     if (authError && isClient) {
//       setShowNotification(true);
//     }
//   }, [authError, isClient]);

//   const onSubmit = async (data: LoginFormData) => {
//     try {
//       const response = await login({
//         email: data.email,
//         password: data.password,
//       }).unwrap();
//         //  tenantId: "e2cabb80-a8ce-4fe8-947e-5c18d903dae9",

//     //  console.log("Login response:", response);

//       dispatch(
//         setCredentials({ user: response.user, token: response.accessToken })
//       );
//      // localStorage.setItem("token", response.accessToken);

//       if (response.user?.tenantId) {
//        // await new Promise((res) => setTimeout(res, 2000));
//         router.push("/app/dashboard");
//       } else {
//         // router.push("auth/login");
//        // await new Promise((res) => setTimeout(res, 2000));
//         router.push("/auth/login");
//       }
//     } catch (err: any) {
//       if (err.data?.errors) {
//         Object.entries(err.data.errors).forEach(([field, messages]) => {
//           setFormError(field as keyof LoginFormData, {
//             type: "server",
//             message: (messages as string[]).join(", "),
//           });
//         });
//       } else {
//         dispatch(
//           setError(err.data?.message || "An error occurred during login")
//         );
//       }
//     }
//   };

//   if (!isClient) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
//       {/* Left Side - Logo / Branding */}
//       <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 text-white p-12">
//         <div className="flex flex-col items-center space-y-6">
//           <img
//             src="/logo.png" // <-- put your logo here
//             alt="Company Logo"
//             className="w-32 h-32 object-contain"
//           />
//           <h1 className="text-4xl font-bold tracking-wide">
//             Welcome Back!
//           </h1>
//           <p className="text-lg text-center opacity-80">
//             Manage your billing, invoices, and customers effortlessly.
//           </p>
//         </div>
//       </div>

//       {/* Right Side - Login Form */}
//       <div className="flex items-center justify-center bg-gray-50 p-8">
//         <div className="max-w-md w-full space-y-8 bg-white shadow-2xl rounded-2xl p-8">
//           <div>
//             <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
//               Sign in to your account
//             </h2>
//             <p className="mt-2 text-center text-sm text-gray-600">
//               Or{" "}
//               <Link
//                 href="/auth/register"
//                 className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
//               >
//                 create a new account
//               </Link>
//             </p>
//           </div>

//           <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
//             <div className="space-y-4">
//               <FormInput
//                 id="email"
//                 type="email"
//                 label="Email address"
//                 autoComplete="email"
//                 required
//                 error={errors.email?.message}
//                 {...register("email")}
//               />

//               <FormInput
//                 id="password"
//                 type="password"
//                 label="Password"
//                 autoComplete="current-password"
//                 required
//                 error={errors.password?.message}
//                 {...register("password")}
//               />
//             </div>

//             <div className="flex items-center justify-between">
//               <label className="flex items-center space-x-2">
//                 <input
//                   id="remember-me"
//                   name="remember-me"
//                   type="checkbox"
//                   className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                 />
//                 <span className="text-sm text-gray-900">Remember me</span>
//               </label>

//               <Link
//                 href="/forgot-password"
//                 className="text-sm font-medium text-blue-600 hover:text-blue-500"
//               >
//                 Forgot your password?
//               </Link>
//             </div>

//             <Button
//               type="submit"
//               className="w-full"
//               disabled={isLoading}
//               loading={isLoading}
//             >
//               Sign in
//             </Button>
//           </form>

//           {isClient && (
//             <NotificationToast
//               show={showNotification}
//               onClose={() => setShowNotification(false)}
//               message={authError || ""}
//               type="error"
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


