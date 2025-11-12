'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Only set client-side rendering ready
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Redirect when clicking the Get Started button
  const handleGetStarted = () => {
    //alert('Get Started button clicked!');
    if (isLoading) return;
    if (isAuthenticated) {
      router.push('/app/dashboard');
    } else {
      router.push('/auth/login');
    }
  };

  if (!isClient) return null;

  return (
    <div>
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <nav className="container mx-auto flex justify-between items-center py-4 px-6">
          <div className="text-xl font-bold text-gray-900">BillingSoftware</div>
          <ul className="hidden md:flex gap-8">
            <li><a href="#features" className="text-gray-700 hover:text-blue-600">Features</a></li>
            <li><a href="#testimonials" className="text-gray-700 hover:text-blue-600">Testimonials</a></li>
            <li><a href="#pricing" className="text-gray-700 hover:text-blue-600">Pricing</a></li>
            <li><a href="#contact" className="text-gray-700 hover:text-blue-600">Contact</a></li>
          </ul>
          <button
            onClick={handleGetStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium"
          >
            Get Started
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-center py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">Simplify Your SaaS Billing with BillingSoftware</h1>
          <p className="text-lg mb-10">
            Automate invoices, track subscriptions, and get paid faster—all in one user-friendly dashboard.
          </p>
          <div className="flex justify-center flex-wrap gap-4">
            <button onClick={handleGetStarted} className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-md hover:shadow-lg">
              Start Monthly (₹299)
            </button>
            <button onClick={handleGetStarted} className="border-2 border-white text-white px-6 py-3 rounded-md hover:bg-white hover:text-blue-600 font-semibold">
              Save with Annual (₹1499)
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white text-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-semibold text-center mb-12">Why Choose BillingSoftware?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              ['📊', 'Automated Invoicing', 'Generate professional invoices in seconds and send them instantly.'],
              ['💳', 'Payment Tracking', 'Monitor payments in real-time and reduce overdue accounts.'],
              ['🔒', 'Secure & Compliant', 'Bank-level security with GDPR and PCI compliance.'],
              ['📱', 'Mobile-Friendly', 'Access from anywhere, anytime on any device.'],
              ['⚡', 'Lightning Fast Setup', 'Get started in under 5 minutes with guided onboarding.'],
              ['📈', 'Analytics & Reports', 'Gain insights into revenue and growth trends.']
            ].map(([icon, title, desc], i) => (
              <div key={i} className="p-8 rounded-xl shadow-md text-center hover:-translate-y-1 transition">
                <div className="text-4xl mb-3">{icon}</div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50 text-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-semibold text-center mb-12">What Our Customers Say</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              ['"BillingSoftware transformed our invoicing process."', 'Sarah Johnson', 'CEO, TechStart Inc.'],
              ['"The subscription management is top-notch."', 'Mike Chen', 'Founder, InnovateHub'],
              ['"Secure, scalable, and affordable. A game-changer."', 'Emily Rodriguez', 'Operations Lead, GrowthForge']
            ].map(([quote, name, role], i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-md text-center relative">
                <blockquote className="italic text-lg mb-6">{quote}</blockquote>
                <p className="font-semibold text-gray-900">{name}</p>
                <p className="text-sm text-gray-500">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white text-gray-800">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-semibold mb-6">Affordable Plans for Every Business</h2>
          <p className="text-gray-500 mb-12">No hidden fees. Cancel anytime. 14-day free trial on all plans.</p>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="border rounded-xl p-10 shadow-sm">
              <h3 className="text-2xl font-semibold mb-2">Monthly</h3>
              <div className="text-5xl font-bold text-blue-600 mb-2">₹299</div>
              <p className="text-gray-500 mb-4">per month</p>
              <ul className="text-gray-700 mb-6">
                <li>Unlimited Invoices</li>
                <li>Basic Analytics</li>
                <li>Email Support</li>
                <li>Up to 500 Customers</li>
              </ul>
              <button onClick={handleGetStarted} className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700">
                Choose Monthly
              </button>
            </div>

            <div className="border-2 border-blue-600 rounded-xl p-10 shadow-md scale-105">
              <h3 className="text-2xl font-semibold mb-2">Annual (Best Value)</h3>
              <div className="text-5xl font-bold text-blue-600 mb-2">₹1499</div>
              <p className="text-gray-500 mb-4">billed yearly (Save 20%)</p>
              <ul className="text-gray-700 mb-6">
                <li>Unlimited Invoices</li>
                <li>Advanced Analytics</li>
                <li>Priority Support</li>
                <li>Unlimited Customers</li>
                <li>API Access</li>
              </ul>
              <button onClick={handleGetStarted} className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700">
                Choose Annual
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Billing?</h2>
        <p className="mb-6 text-gray-300">Join thousands of businesses automating their finances today.</p>
        <button
          onClick={handleGetStarted}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-semibold"
        >
          Start Free Trial
        </button>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-950 text-gray-400 text-center py-6">
        <p>
          © 2025 3SD. All rights reserved. |{' '}
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>{' '}
          |{' '}
          <a href="#" className="hover:underline">
            Terms of Service
          </a>
        </p>
      </footer>
    </div>
  );
}
