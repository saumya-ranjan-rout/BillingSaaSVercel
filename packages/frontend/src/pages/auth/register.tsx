import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch } from "../../store/hooks";
import { useRegisterMutation } from "../../services/endpoints/authApi";
import { Button } from "../../components/ui/Button";
import FormInput from "../../components/ui/FormInput";
import NotificationToast from "../../components/ui/NotificationToast";
import Image from "next/image";

// ✅ Validation Schema Updated
const registerSchema = z
  .object({
    accountType: z.enum(["admin", "professional"]),
    businessName: z.string().min(2, "Business name is required"),
    subdomain: z.string().optional(),
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),

    professionType: z.enum(["CA", "CS", "Advocate", "TaxConsultant"]).optional(),
    licenseNo: z.string().optional(),

    pan: z
      .string()
      .min(10, "PAN number is required")
      .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number format"),

    gst: z
      .string()
      .min(15, "GST number is required")
      .regex(
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        "Invalid GST number format"
      ),
  })
  .refine(
    (data) => {
      if (data.professionType && data.licenseNo) {
        const patterns: Record<string, RegExp> = {
          CA: /^[A-Z]{2}\d{4,6}$/,
          CS: /^(ACS|FCS)\d{4,6}$/,
          Advocate: /^[A-Z]{2,3}\/\d{3,6}\/\d{4}$/,
          TaxConsultant: /^[A-Z]{2,4}\d{3,6}$/,
        };
        const regex = patterns[data.professionType];
        return regex ? regex.test(data.licenseNo) : true;
      }
      return true;
    },
    {
      message: "Enter a valid License No based on profession type",
      path: ["licenseNo"],
    }
  );


type RegisterFormData = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");
  const [isClient, setIsClient] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const accountType = watch("accountType"); // 👀 Watch dropdown value

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await registerUser(data).unwrap();

      console.log("REGISTER RESPONSE:", response);

      if (response?.user) {
        setNotificationMsg("Registration successful! You can now sign in.");
        setShowNotification(true);
        await new Promise((res) => setTimeout(res, 2000));
        router.push("/auth/login");
      } else {
        throw new Error("Registration failed. Please try again.");
      }
    } catch (error: any) {
      setNotificationMsg(error?.data?.error || "Something went wrong");
      setShowNotification(true);
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eef2ff] px-4">
      {/* MAIN WRAPPER */}
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* LEFT PANEL */}
       <div className="p-12 bg-gradient-to-b from-[#6b4efc] to-[#386bfd] text-white flex flex-col justify-center">

          <h1 className="text-4xl font-bold mb-4">Create Your Account</h1>

           <p className="text-lg opacity-90 mb-6">
            Register and start using your billing & compliance dashboard.
          </p>

          <ul className="space-y-3 text-white text-sm opacity-95">
            <li>• Easy account setup in minutes</li>
            <li>• Role-based access control</li>
            <li>• Advanced security & encryption</li>
            <li>• Personalized dashboard & reports</li>
            <li>• 24/7 support and guidance</li>
          </ul>


          {/* Illustration */}
          <div className="mt-10 w-56 h-56 relative mx-auto">
            <Image
              src="/register-illustration.png"
              alt="Register Illustration"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="p-10 md:p-14 flex items-center">
          <div className="w-full">
            {/* Logo above form */}
            <div className="flex justify-center mb-6">
              <Image
                src="/logo.png"
                alt="Logo"
                width={110}
                height={110}
                className="object-contain"
              />
          </div>

            <h2 className="text-3xl font-semibold text-center text-slate-900">
                  Register your Account
                </h2>

            <p className="mt-2 mb-8 text-center text-sm text-slate-600">
              Already have an account?
                  <Link
                    href="/auth/login"
                className="text-blue-600 hover:underline ml-1"
                  >
                    Sign in
                  </Link>
                </p>

            {/* FORM */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* 2 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* LEFT FIELDS */}
                  <div className="space-y-4">
                    <FormInput
                      id="firstName"
                      label="First Name"
                      error={errors.firstName?.message}
                      {...register("firstName")}
                    />
                    <FormInput
                      id="lastName"
                      label="Last Name"
                      error={errors.lastName?.message}
                      {...register("lastName")}
                    />
                    <FormInput
                      id="businessName"
                      label="Business Name"
                      error={errors.businessName?.message}
                      {...register("businessName")}
                    />
                    <FormInput
                      id="subdomain"
                      label="Subdomain"
                      error={errors.subdomain?.message}
                      {...register("subdomain")}
                    />
                    <FormInput
                      id="email"
                      type="email"
                      label="Email Address"
                      error={errors.email?.message}
                      {...register("email")}
                    />
                    <FormInput
                      id="password"
                      type="password"
                      label="Password"
                      error={errors.password?.message}
                      {...register("password")}
                    />
                  </div>

                  {/* Right Column (6 fields) */}
                  <div className="space-y-4">
                    {/* ✅ Account Type Dropdown */}
                    <div>
                    <label
                      htmlFor="accountType"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Account Type
                      </label>
                      <select
                      id="accountType"
                        {...register("accountType")}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      >
                        {/* <option value="">Select Account Type</option> */}
                        <option value="admin">Business User</option>
                      <option value="professional">
                        Professional (CA, CS, Lawyer, Tax Consultant)
                      </option>
                      </select>
                      {errors.accountType && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.accountType.message}
                        </p>
                      )}
                    </div>

                    {accountType === "professional" && (
                      <>
                       <div>
                        <label
                          htmlFor="professionType"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
         Profession Type
       </label>
       <select
         {...register("professionType")}
                          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
       >
         <option value="">Select Profession</option>
         <option value="CA">Chartered Accountant (CA)</option>
         <option value="CS">Company Secretary (CS)</option>
       <option value="Advocate">Advocate</option>
         <option value="TaxConsultant">Tax Consultant</option>
       </select>
       {errors.professionType && (
         <p className="text-red-500 text-sm mt-1">
           {errors.professionType.message}
         </p>
      )}
    </div>
                        <FormInput
                          id="licenseNo"
                          label="License No (e.g., CA: CA12345 | CS: ACS12345 | Lawyer: UP/1234/2015 | TaxConsultant: TXC1234)"
                          error={errors.licenseNo?.message}
                          {...register("licenseNo")}
                        />
                        <Button
                          type="button"
                          className="w-full bg-green-600 text-white mt-2"
                          onClick={async () => {
                            const licence = getValues("licenseNo");
                            const prof = getValues("professionType");

                            if (!licence || !prof) {
                              alert("Select profession and enter license number");
                              return;
                            }

                            try {
                              const res = await fetch("/api/auth/validate-license", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ professionType: prof, licenseNo: licence }),
                              });
                              const data = await res.json();
                              if (data.success) {
                                alert(`✅ Verified: ${data.data.name || "Valid License"}`);
                              } else {
                                alert(`❌ ${data.message}`);
                              }
                            } catch (err) {
                              alert("Verification failed, try again later");
                            }
                          }}
                        >
                          Verify License
                        </Button>
                      </>
                    )}

                    <FormInput
                      id="pan"
                      label="PAN No. (e.g.,ABCDE1234F)"
                      error={errors.pan?.message}
                      {...register("pan")}
                    />
                    <FormInput
                      id="gst"
                      label="GST No. (e.g.,22AAAAA0000A1Z5)"
                      error={errors.gst?.message}
                      {...register("gst")}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                  isLoading={isLoading}
                >
                  Create Account
                </Button>
              </form>

              {isClient && (
                <NotificationToast
                  show={showNotification}
                  onClose={() => setShowNotification(false)}
                  message={notificationMsg}
                  type={
                    notificationMsg.includes("successful") ? "success" : "error"
                  }
                />
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;



















// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { useRouter } from "next/router";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useAppDispatch } from "../../store/hooks";
// import { useRegisterMutation } from "../../services/endpoints/authApi";
// import { Button } from "../../components/ui/Button";
// import FormInput from "../../components/ui/FormInput";
// import NotificationToast from "../../components/ui/NotificationToast";

// // ✅ Validation Schema Updated
// const registerSchema = z.object({
//   accountType: z.enum(["business", "professional"]),
//   businessName: z.string().min(2, "Business name is required"),
//   subdomain: z.string().optional(),
//   firstName: z.string().min(2, "First name is required"),
//   lastName: z.string().min(2, "Last name is required"),
//   email: z.string().email("Invalid email address"),
//   password: z.string().min(6, "Password must be at least 6 characters"),

//   // ✅ Add this line
//   professionType: z.enum(["CA", "CS", "Advocate", "TaxConsultant"]).optional(),

//   licenseNo: z
//     .string()
//     .optional()
//     .refine(
//       (val) => !val || /^[A-Za-z0-9]{6,15}$/.test(val),
//       "License No must be alphanumeric and 6–15 characters long"
//     ),

//   pan: z
//     .string()
//     .min(10, "PAN number is required")
//     .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number format"),

//   gst: z
//     .string()
//     .min(15, "GST number is required")
//     .regex(
//       /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
//       "Invalid GST number format"
//     ),
// });



// type RegisterFormData = z.infer<typeof registerSchema>;

// const Register: React.FC = () => {
//   const router = useRouter();
//   const dispatch = useAppDispatch();
//   const [registerUser, { isLoading }] = useRegisterMutation();
//   const [showNotification, setShowNotification] = useState(false);
//   const [notificationMsg, setNotificationMsg] = useState("");
//   const [isClient, setIsClient] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     watch,
//      getValues,
//     formState: { errors },
//   } = useForm<RegisterFormData>({
//     resolver: zodResolver(registerSchema),
//   });

//   const accountType = watch("accountType"); // 👀 Watch dropdown value

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   const onSubmit = async (data: RegisterFormData) => {
//     try {
//       const response = await registerUser(data).unwrap();

//       console.log("REGISTER RESPONSE:", response);

//       if (response?.user) {
//         setNotificationMsg("Registration successful! You can now sign in.");
//         setShowNotification(true);
//         await new Promise((res) => setTimeout(res, 2000));
//         router.push("/auth/login");
//       } else {
//         throw new Error("Registration failed. Please try again.");
//       }
//     } catch (error: any) {
//       setNotificationMsg(error?.data?.error || "Something went wrong");
//       setShowNotification(true);
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
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-tl from-gray-100 via-blue-50 to-indigo-100">
//       <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg p-10">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Left Side - Branding */}
//           <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-r from-blue-600 to-purple-700 text-white p-8 rounded-lg shadow-lg">
//             <div className="flex flex-col items-center space-y-6">
//               <img
//                 src="/logo.png"
//                 alt="Company Logo"
//                 className="w-32 h-32 object-contain"
//               />
//               <h1 className="text-4xl font-bold tracking-wide">Create Account</h1>
//               <p className="text-lg text-center opacity-80">
//                 Start managing your business with our billing platform.
//               </p>
//             </div>
//           </div>

//           {/* Right Side - Register Form */}
//           <div className="flex items-center justify-center bg-gray-50 p-8 rounded-lg shadow-lg">
//             <div className="max-w-md w-full space-y-8">
//               <div>
//                 <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
//                   Register your Account
//                 </h2>
//                 <p className="mt-2 text-center text-sm text-gray-600">
//                   Already have an account?{" "}
//                   <Link
//                     href="/auth/login"
//                     className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
//                   >
//                     Sign in
//                   </Link>
//                 </p>
//               </div>

//               <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold text-gray-700">
//                     Your Details
//                   </h3>

//                   {/* ✅ Account Type Dropdown */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Account Type
//                     </label>
//                     <select
//                       {...register("accountType")}
//                       className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
//                     >
//                       <option value="">Select Account Type</option>
//                       <option value="business">Business User</option>
//                       <option value="professional">Professional User(Lawyer,CS,CA,Tax Consultant)</option>
//                     </select>
//                     {errors.accountType && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {errors.accountType.message}
//                       </p>
//                     )}
//                   </div>

//                   {/* ✅ Conditional License Field */}
//                 {/*  {accountType === "professional" && (
//                     <FormInput
//                       id="licenseNo"
//                       label="License No"
//                       error={errors.licenseNo?.message}
//                       {...register("licenseNo")}
//                     />
//                   )} */}

//     {accountType === "professional" && (
//   <>
//     <div>
//       <label className="block text-sm font-medium text-gray-700 mb-1">
//         Profession Type
//       </label>
//       <select
//         {...register("professionType")}
//         className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
//       >
//         <option value="">Select Profession</option>
//         <option value="CA">Chartered Accountant (CA)</option>
//         <option value="CS">Company Secretary (CS)</option>
//         <option value="Advocate">Advocate</option>
//         <option value="TaxConsultant">Tax Consultant</option>
//       </select>
//       {errors.professionType && (
//         <p className="text-red-500 text-sm mt-1">
//           {errors.professionType.message}
//         </p>
//       )}
//     </div>

//     <FormInput
//       id="licenseNo"
//       label="License No"
//       error={errors.licenseNo?.message}
//       {...register("licenseNo")}
//     />


//     <Button
//       type="button"
//       className="w-full bg-green-600 text-white mt-2"
//       onClick={async () => {
//        const licence = getValues("licenseNo");
// const prof = getValues("professionType");


//         if (!licence || !prof) {
//           alert("Select profession and enter license number");
//           return;
//         }

//         try {
//           const res = await fetch("/api/auth/validate-license", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ professionType: prof, licenseNo: licence }),
//           });
//           const data = await res.json();
//           if (data.success) {
//             alert(`✅ Verified: ${data.data.name || "Valid License"}`);
//           } else {
//             alert(`❌ ${data.message}`);
//           }
//         } catch (err) {
//           alert("Verification failed, try again later");
//         }
//       }}
//     >
//       Verify License
//     </Button>
//   </>
// )}


//                   <FormInput
//                     id="firstName"
//                     label="First Name"
//                     error={errors.firstName?.message}
//                     {...register("firstName")}
//                   />
//                   <FormInput
//                     id="lastName"
//                     label="Last Name"
//                     error={errors.lastName?.message}
//                     {...register("lastName")}
//                   />
//                   <FormInput
//                     id="businessName"
//                     label="Business Name"
//                     error={errors.businessName?.message}
//                     {...register("businessName")}
//                   />
//                   <FormInput
//                     id="subdomain"
//                     label="Subdomain"
//                     error={errors.subdomain?.message}
//                     {...register("subdomain")}
//                   />
//                   <FormInput
//                     id="email"
//                     type="email"
//                     label="Email Address"
//                     error={errors.email?.message}
//                     {...register("email")}
//                   />
//                   <FormInput
//                     id="password"
//                     type="password"
//                     label="Password"
//                     error={errors.password?.message}
//                     {...register("password")}
//                   />

//                   {/* ✅ PAN and GST fields */}
//                   <FormInput
//                     id="pan"
//                     label="PAN Number"
//                     error={errors.pan?.message}
//                     {...register("pan")}
//                   />
//                   <FormInput
//                     id="gst"
//                     label="GST Number"
//                     error={errors.gst?.message}
//                     {...register("gst")}
//                   />
//                 </div>

//                 <Button
//                   type="submit"
//                   className="w-full"
//                   disabled={isLoading}
//                   isLoading={isLoading}
//                 >
//                   Create Account
//                 </Button>
//               </form>

//               {isClient && (
//                 <NotificationToast
//                   show={showNotification}
//                   onClose={() => setShowNotification(false)}
//                   message={notificationMsg}
//                   type={
//                     notificationMsg.includes("successful") ? "success" : "error"
//                   }
//                 />
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;







