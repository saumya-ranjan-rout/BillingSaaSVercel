// packages/frontend/src/utils/razorpay.ts

export const loadRazorpay = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject('Window is not defined');
      return;
    }

    if ((window as any).Razorpay) {
      // Script already loaded
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;

    script.onload = () => {
      resolve();
    };

    script.onerror = () => {
      reject(new Error('Razorpay SDK failed to load'));
    };

    document.body.appendChild(script);
  });
};
