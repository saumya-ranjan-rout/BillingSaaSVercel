'use client';
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { Box, Stepper, Step, StepLabel, Typography, Container } from '@mui/material';
import { SubscriptionPlan, BillingCycle } from '../types';
import { tenantOnboardingService } from '../services/tenantOnboardingService';

// Dynamic imports (no SSR)
const TenantForm = dynamic(() => import('../components/tenant/TenantForm').then(m => m.TenantForm), { ssr: false });
const SubscriptionPlans = dynamic(() => import('../components/onboarding/SubscriptionPlans').then(m => m.SubscriptionPlans), { ssr: false });
const PaymentForm = dynamic(() => import('../components/onboarding/PaymentForm').then(m => m.PaymentForm), { ssr: false });
const ProfessionalSelection = dynamic(() => import('../components/onboarding/ProfessionalSelection').then(m => m.ProfessionalSelection), { ssr: false });

const steps = ['Tenant Details', 'Select Plan', 'Choose Professional', 'Payment'];

const TenantOnboardingPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(BillingCycle.MONTHLY);
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null);
  const [tenantData, setTenantData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const plansData = await tenantOnboardingService.getSubscriptionPlans();
        setPlans(plansData);
      } catch (err) {
        console.error('Error loading subscription plans:', err);
      }
    })();
  }, []);

  const handleTenantSubmit = (data: any) => {
    setTenantData(data);
    setActiveStep(1);
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setActiveStep(2);
  };

  const handleProfessionalSelect = (professionalId: string) => {
    setSelectedProfessional(professionalId);
    setActiveStep(3);
  };

  const handlePaymentSubmit = async (paymentMethodId: string) => {
    try {
      setLoading(true);
      await tenantOnboardingService.createTenantWithSubscription({
        tenantData,
        planId: selectedPlan!,
        paymentMethodId,
        professionalId: selectedProfessional
      });
      window.location.href = '/onboarding/success';
    } catch (error) {
      console.error('Error creating tenant:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSelectedPlan = () => plans.find(plan => plan.id === selectedPlan);

  const getPlanPrice = (plan: SubscriptionPlan | undefined) => {
    if (!plan) return 0;
    switch (billingCycle) {
      case BillingCycle.QUARTERLY: return plan.price * 3 * 0.9;
      case BillingCycle.ANNUALLY: return plan.price * 12 * 0.8;
      default: return plan.price;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3">Get Started with BillingSoftware</Typography>
        <Typography color="textSecondary">Complete these steps to set up your account</Typography>
      </Box>

      <Stepper activeStep={activeStep} sx={{ mb: 6 }}>
        {steps.map(label => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>

      {activeStep === 0 && <TenantForm onSubmit={handleTenantSubmit} />}
      {activeStep === 1 && (
        <SubscriptionPlans
          plans={plans}
          selectedPlan={selectedPlan}
          onPlanSelect={handlePlanSelect}
          billingCycle={billingCycle}
          onBillingCycleChange={setBillingCycle}
        />
      )}
      {activeStep === 2 && (
        <ProfessionalSelection
          selectedProfessional={selectedProfessional}
          onProfessionalSelect={handleProfessionalSelect}
          onSkip={() => setActiveStep(3)}
        />
      )}
      {activeStep === 3 && (
        <PaymentForm
          amount={getPlanPrice(getSelectedPlan())}
          onSubmit={handlePaymentSubmit}
          isLoading={loading}
        />
      )}
    </Container>
  );
};

export default TenantOnboardingPage;
