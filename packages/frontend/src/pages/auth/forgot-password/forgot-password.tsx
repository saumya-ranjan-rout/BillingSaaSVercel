import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log(data);
      setIsLoading(false);
      setIsSubmitted(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      </div>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 md:p-10 z-10">
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
            <ShieldCheck className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset your password</h2>
          <p className="text-gray-600">
            {isSubmitted 
              ? "Check your email for a reset link" 
              : "Enter your email and we'll send you a reset link"}
          </p>
        </div>

        {!isSubmitted ? (
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  {...register('email')} 
                  type="email" 
                  autoComplete="email"
                  className={`relative block w-full pl-10 pr-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 ${
                    errors.email 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="Email address"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                  </svg>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending reset link...
                  </>
                ) : (
                  <>
                    Send reset link
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Check your email</h3>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to your email address. The link will expire in 1 hour.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Resend email
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <Link 
              href="/auth/login" 
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
