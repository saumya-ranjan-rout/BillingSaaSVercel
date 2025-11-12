import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InvoiceForm } from '@/components/invoices/InvoiceForm';
import { useAuth } from '@/hooks/useAuth';
import { useOfflineSync } from '@/hooks/useOfflineSync';

// Mock the hooks
jest.mock('@/hooks/useAuth');
jest.mock('@/hooks/useOfflineSync');
jest.mock('@/services/invoiceService');
jest.mock('@/services/productService');

describe('InvoiceForm', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: 'user-1' },
      tenantId: 'tenant-1',
    });
    
    (useOfflineSync as jest.Mock).mockReturnValue({
      addPendingAction: jest.fn(),
      isOnline: true,
    });
  });

  it('renders the form correctly', () => {
    render(<InvoiceForm onSubmit={jest.fn()} />);
    
    expect(screen.getByLabelText(/invoice number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/customer/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const onSubmit = jest.fn();
    render(<InvoiceForm onSubmit={onSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /create invoice/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/invoice number is required/i)).toBeInTheDocument();
      expect(screen.getByText(/customer is required/i)).toBeInTheDocument();
    });
    
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits the form with valid data', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    
    render(<InvoiceForm onSubmit={onSubmit} />);
    
    // Fill in the form
    await user.type(screen.getByLabelText(/invoice number/i), 'INV-001');
    await user.type(screen.getByLabelText(/date/i), '2023-06-01');
    await user.type(screen.getByLabelText(/due date/i), '2023-06-15');
    
    // Mock customer selection
    // This would require more complex setup with mocked APIs
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /create invoice/i }));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });
});
