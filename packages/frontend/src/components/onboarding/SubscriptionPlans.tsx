import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Radio,
  FormControlLabel,
  RadioGroup,
  Chip
} from '@mui/material';
import { CheckCircle, Star } from '@mui/icons-material';
import { SubscriptionPlan, PlanType, BillingCycle } from '../../types';

interface SubscriptionPlansProps {
  plans: SubscriptionPlan[];
  selectedPlan: string | null;
  onPlanSelect: (planId: string) => void;
  billingCycle: BillingCycle;
  onBillingCycleChange: (cycle: BillingCycle) => void;
}

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
  plans,
  selectedPlan,
  onPlanSelect,
  billingCycle,
  onBillingCycleChange
}) => {
  const getPrice = (plan: SubscriptionPlan) => {
    switch (billingCycle) {
      case BillingCycle.MONTHLY:
        return plan.price;
      case BillingCycle.QUARTERLY:
        return plan.price * 3 * 0.9; // 10% discount
      case BillingCycle.ANNUALLY:
        return plan.price * 12 * 0.8; // 20% discount
      default:
        return plan.price;
    }
  };

  const getBillingCycleText = (cycle: BillingCycle) => {
    switch (cycle) {
      case BillingCycle.MONTHLY:
        return 'month';
      case BillingCycle.QUARTERLY:
        return 'quarter';
      case BillingCycle.ANNUALLY:
        return 'year';
    }
  };

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Choose Your Plan
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Select the billing cycle that works best for you
        </Typography>
        
        <RadioGroup
          row
          value={billingCycle}
          onChange={(e) => onBillingCycleChange(e.target.value as BillingCycle)}
          sx={{ justifyContent: 'center', mt: 2 }}
        >
          <FormControlLabel
            value={BillingCycle.MONTHLY}
            control={<Radio />}
            label="Monthly"
          />
          <FormControlLabel
            value={BillingCycle.QUARTERLY}
            control={<Radio />}
            label="Quarterly (10% off)"
          />
          <FormControlLabel
            value={BillingCycle.ANNUALLY}
            control={<Radio />}
            label="Annual (20% off)"
          />
        </RadioGroup>
      </Box>

      <Grid container spacing={3}>
        {plans.map((plan) => (
          <Grid item xs={12} md={4} key={plan.id}>
            <Card 
              sx={{ 
                height: '100%',
                border: selectedPlan === plan.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                position: 'relative'
              }}
            >
              {plan.planType === PlanType.PREMIUM && (
                <Chip
                  icon={<Star />}
                  label="Most Popular"
                  color="primary"
                  sx={{ position: 'absolute', top: 16, right: 16 }}
                />
              )}
              
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  {plan.name}
                </Typography>
                
                <Box sx={{ my: 2 }}>
                  <Typography variant="h3" component="div" color="primary">
                    ₹{getPrice(plan)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    per {getBillingCycleText(billingCycle)}
                  </Typography>
                </Box>

                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                  {plan.description}
                </Typography>

                <Box sx={{ textAlign: 'left', mb: 3 }}>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckCircle color="success" sx={{ mr: 1, fontSize: 16 }} />
                    {plan.features.maxUsers} users
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckCircle color="success" sx={{ mr: 1, fontSize: 16 }} />
                    {plan.features.maxStorage}MB storage
                  </Typography>
                  {plan.features.gstFiling && (
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CheckCircle color="success" sx={{ mr: 1, fontSize: 16 }} />
                      GST Filing
                    </Typography>
                  )}
                  {plan.features.taxFiling && (
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CheckCircle color="success" sx={{ mr: 1, fontSize: 16 }} />
                      Tax Filing
                    </Typography>
                  )}
                  {plan.features.advancedReporting && (
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CheckCircle color="success" sx={{ mr: 1, fontSize: 16 }} />
                      Advanced Reporting
                    </Typography>
                  )}
                </Box>

                <Button
                  variant={selectedPlan === plan.id ? "contained" : "outlined"}
                  fullWidth
                  onClick={() => onPlanSelect(plan.id)}
                >
                  {selectedPlan === plan.id ? "Selected" : "Select Plan"}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
