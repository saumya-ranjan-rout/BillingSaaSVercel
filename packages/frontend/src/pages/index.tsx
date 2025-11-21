'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Zap,
  ShieldCheck,
  BarChart3,
  Phone,
  Star
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleGetStarted = () => {
    if (isLoading) return;
    if (isAuthenticated) router.push('/app/dashboard');
    else router.push('/auth/login');
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900 antialiased">
      {/* Decorative floating blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <svg className="absolute top-0 left-1/2 -translate-x-1/2 opacity-40 blur-3xl mix-blend-plus-lighter" width="1200" height="600" viewBox="0 0 1200 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop offset="0" stopColor="#60a5fa" />
              <stop offset="1" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
          <ellipse cx="400" cy="200" rx="380" ry="180" fill="url(#g1)" />
          <ellipse cx="820" cy="380" rx="360" ry="200" fill="#06b6d4" opacity="0.12" />
        </svg>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/60 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">3S</div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Billing Software</h1>
              <p className="text-xs text-slate-500 -mt-0.5">Simple. Secure. Scalable.</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#pricing" className="hover:text-slate-900">Pricing</a>
            <a href="#testimonials" className="hover:text-slate-900">Customers</a>
            <a href="#contact" className="hover:text-slate-900">Contact</a>
            <button
              onClick={handleGetStarted}
              className="ml-2 inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-md shadow-md hover:scale-[1.02] transition-transform"
            >
              Get Started
            </button>
          </nav>

          <div className="md:hidden">
            <button onClick={handleGetStarted} className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-md">Get Started</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main>
        <section className="max-w-7xl mx-auto px-6 pt-12 pb-10">
          <div className="grid gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7">
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <h2 className="text-4xl sm:text-5xl font-bold leading-tight">Simplify billing. Accelerate growth.</h2>
                <p className="mt-4 text-lg text-slate-600 max-w-2xl">Automate invoices, manage subscriptions, and get paid faster with bank-grade security and a developer-friendly API.</p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button onClick={handleGetStarted} className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold hover:opacity-95">
                    Start Monthly — ₹299
                  </button>

                  <button onClick={handleGetStarted} className="inline-flex items-center gap-2 border border-slate-200 px-5 py-3 rounded-lg bg-white hover:shadow-md">
                    Save with Annual — ₹1499
                  </button>
                </div>

                <div className="mt-6 flex items-center gap-6 flex-wrap text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-slate-400" />
                    <span>PCI & GDPR compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-400" />
                    <span>Rated 4.8 by businesses</span>
                  </div>
                </div>
              </motion.div>

              {/* Feature chips */}
              <motion.div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                {[
                  { icon: <CreditCard className="h-5 w-5" />, title: 'Invoices' },
                  { icon: <Zap className="h-5 w-5" />, title: 'Automation' },
                  { icon: <BarChart3 className="h-5 w-5" />, title: 'Analytics' },
                  { icon: <Phone className="h-5 w-5" />, title: 'Mobile-ready' },
                  { icon: <ShieldCheck className="h-5 w-5" />, title: 'Security' },
                  { icon: <Star className="h-5 w-5" />, title: 'Priority Support' }
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/80 backdrop-blur rounded-lg px-3 py-2 shadow-sm">
                    <div className="p-2 rounded-md bg-slate-50 border border-slate-100">{f.icon}</div>
                    <div className="text-sm font-medium">{f.title}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right card - pricing / preview */}
            <div className="lg:col-span-5">
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative">
                <div className="rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200 shadow-xl p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Live dashboard preview</h3>
                      <p className="text-sm text-slate-500">A quick glance at your revenue and invoices.</p>
                    </div>
                    <div className="text-sm font-semibold text-slate-700">₹299/mo</div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-gradient-to-b from-slate-50 to-white border border-slate-100">
                      <p className="text-xs text-slate-500">Invoices</p>
                      <p className="mt-1 text-lg font-semibold">1,240</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gradient-to-b from-slate-50 to-white border border-slate-100">
                      <p className="text-xs text-slate-500">Revenue</p>
                      <p className="mt-1 text-lg font-semibold">₹1.2M</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="h-28 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center border border-slate-100">
                      <p className="text-sm text-slate-600">(Mini sparkline / chart preview)</p>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button onClick={handleGetStarted} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold">Get Started</button>
                    <button className="px-4 py-2 rounded-md border border-slate-200">Demo</button>
                  </div>
                </div>

                {/* Accent ribbon */}
                <div className="absolute -top-4 left-6 inline-flex items-center gap-2 bg-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow">Most popular</div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-12">
          <h3 className="text-3xl font-semibold text-center mb-8">Why teams choose Billing Software</h3>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Automated Invoicing', desc: 'Create and send professional invoices automatically with templates and reminders.', icon: <CreditCard className="h-6 w-6" /> },
              { title: 'Payment Tracking', desc: 'Real-time payment status, receipts and reconciliation tools.', icon: <Zap className="h-6 w-6" /> },
              { title: 'Bank-grade Security', desc: 'End-to-end encryption and role-based access control.', icon: <ShieldCheck className="h-6 w-6" /> },
              { title: 'Mobile-friendly', desc: 'Manage billing on the go with our responsive UI and mobile app.', icon: <Phone className="h-6 w-6" /> },
              { title: 'Powerful Analytics', desc: 'Detailed reports to understand revenue, churn and growth.', icon: <BarChart3 className="h-6 w-6" /> },
              { title: 'Priority Support', desc: 'Fast, human support — available to help with migrations and integrations.', icon: <Star className="h-6 w-6" /> }
            ].map((f, i) => (
              <motion.div key={i} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition" whileHover={{ y: -6 }}>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-blue-50 text-blue-600">{f.icon}</div>
                  <div>
                    <h4 className="font-semibold">{f.title}</h4>
                    <p className="text-sm text-slate-500 mt-1">{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="max-w-6xl mx-auto px-6 py-12">
          <h3 className="text-3xl font-semibold text-center mb-6">Transparent pricing</h3>
          <p className="text-center text-slate-500 mb-8">No surprises. Cancel anytime. 14-day free trial on all plans.</p>

          <div className="grid gap-6 md:grid-cols-3">
            <motion.div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <h4 className="text-lg font-semibold">Starter</h4>
              <div className="mt-4 text-3xl font-bold">₹299<span className="text-sm font-medium">/mo</span></div>
              <p className="text-sm text-slate-500 mt-2">For new businesses — unlimited invoices, up to 500 customers.</p>
              <ul className="mt-4 text-sm text-slate-700 space-y-2">
                <li>Unlimited invoices</li>
                <li>Basic analytics</li>
                <li>Email support</li>
              </ul>
              <button onClick={handleGetStarted} className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-md">Choose</button>
            </motion.div>

            <motion.div className="p-6 bg-gradient-to-b from-white to-slate-50 rounded-2xl border-2 border-indigo-600 shadow-lg text-center transform scale-105" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <h4 className="text-lg font-semibold">Business</h4>
              <div className="mt-4 text-3xl font-bold">₹1499<span className="text-sm font-medium">/yr</span></div>
              <p className="text-sm text-slate-500 mt-2">Best value — advanced analytics, API access and priority support.</p>
              <ul className="mt-4 text-sm text-slate-700 space-y-2">
                <li>Unlimited customers</li>
                <li>Advanced analytics</li>
                <li>API & integrations</li>
              </ul>
              <button onClick={handleGetStarted} className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-md">Get Business</button>
            </motion.div>

            <motion.div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <h4 className="text-lg font-semibold">Enterprise</h4>
              <div className="mt-4 text-3xl font-bold">Custom</div>
              <p className="text-sm text-slate-500 mt-2">Custom plans with SLAs, dedicated support and onboarding assistance.</p>
              <ul className="mt-4 text-sm text-slate-700 space-y-2">
                <li>Dedicated success manager</li>
                <li>Custom SLAs</li>
                <li>Priority integrations</li>
              </ul>
              <button onClick={() => router.push('/contact')} className="mt-6 w-full border border-slate-200 py-2 rounded-md">Contact Sales</button>
            </motion.div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="max-w-6xl mx-auto px-6 py-12 bg-gradient-to-b from-slate-50 to-white rounded-3xl">
          <h3 className="text-3xl font-semibold text-center mb-6">Loved by teams around the world</h3>
          <div className="grid gap-6 md:grid-cols-3">
            {[{
              quote: 'BillingSoftware transformed our cash-flow in under 30 days — reliable, fast and easy to use.',
              name: 'Sarah Johnson', role: 'CEO, TechStart'
            },{
              quote: 'Subscription management works like a charm. Integrations were painless.',
              name: 'Mike Chen', role: 'Founder, InnovateHub'
            },{
              quote: 'Secure, scalable, and the support team is outstanding.',
              name: 'Emily Rodriguez', role: 'Operations Lead, GrowthForge'
            }].map((t, i) => (
              <motion.blockquote key={i} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 * i }}>
                <p className="italic text-slate-700">“{t.quote}”</p>
                <div className="mt-4 text-sm font-medium text-slate-900">{t.name}</div>
                <div className="text-xs text-slate-500">{t.role}</div>
              </motion.blockquote>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-xl font-bold">Ready to transform your billing?</h4>
              <p className="text-sm opacity-90 mt-1">Start your free 14-day trial — no credit card required.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={handleGetStarted} className="px-6 py-3 rounded-md bg-white text-blue-600 font-semibold">Start Free Trial</button>
              <button onClick={() => router.push('/pricing')} className="px-4 py-3 rounded-md border border-white/30">See Plans</button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="mt-12 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-600">© {new Date().getFullYear()} 3SD. All rights reserved.</div>
            <div className="flex gap-4 text-sm">
              <a href="#" className="hover:underline">Privacy</a>
              <a href="#" className="hover:underline">Terms</a>
              <a href="#" className="hover:underline">Status</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
