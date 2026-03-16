/**
 * Flutterwave Payment Integration
 * Handles payment processing for audit requests
 */

export interface FlutterwaveConfig {
  publicKey: string;
  baseUrl: string;
}

export interface PaymentPayload {
  tx_ref: string;
  amount: number;
  currency: string;
  payment_options: string;
  customer: {
    email: string;
    phonenumber: string;
    name: string;
  };
  customizations: {
    title: string;
    description: string;
    logo: string;
  };
  meta: {
    auditType: string;
    companyName: string;
    industry: string;
  };
}

const FLUTTERWAVE_PUBLIC_KEY = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY;
const FLUTTERWAVE_SECRET_KEY = import.meta.env.VITE_FLUTTERWAVE_SECRET_KEY;

export const flutterwaveConfig: FlutterwaveConfig = {
  publicKey: FLUTTERWAVE_PUBLIC_KEY,
  baseUrl: 'https://api.flutterwave.com/v3',
};

/**
 * Initialize Flutterwave payment
 */
export function initializeFlutterwavePayment(payload: PaymentPayload) {
  // Load Flutterwave script dynamically
  const script = document.createElement('script');
  script.src = 'https://checkout.flutterwave.com/v3.js';
  script.async = true;
  
  script.onload = () => {
    // @ts-ignore
    if (window.FlutterwaveCheckout) {
      // @ts-ignore
      window.FlutterwaveCheckout({
        public_key: flutterwaveConfig.publicKey,
        tx_ref: payload.tx_ref,
        amount: payload.amount,
        currency: payload.currency,
        payment_options: payload.payment_options,
        customer: payload.customer,
        customizations: payload.customizations,
        meta: payload.meta,
        onclose: () => {
          console.log('Payment window closed');
        },
        callback: (response: any) => {
          console.log('Payment response:', response);
          if (response.status === 'successful') {
            handlePaymentSuccess(response);
          } else {
            handlePaymentFailure(response);
          }
        },
      });
    }
  };
  
  document.body.appendChild(script);
}

/**
 * Handle successful payment
 */
function handlePaymentSuccess(response: any) {
  console.log('✅ Payment successful:', response);
  
  // Store payment confirmation
  const paymentData = {
    transactionId: response.transaction_id,
    reference: response.tx_ref,
    amount: response.amount,
    currency: response.currency,
    status: response.status,
    timestamp: new Date().toISOString(),
  };
  
  // Save to localStorage for verification
  localStorage.setItem('lastPayment', JSON.stringify(paymentData));
  
  // Redirect to success page
  window.location.href = '/payment-success?ref=' + response.tx_ref;
}

/**
 * Handle failed payment
 */
function handlePaymentFailure(response: any) {
  console.error('❌ Payment failed:', response);
  
  // Redirect to failure page
  window.location.href = '/payment-failed?ref=' + response.tx_ref;
}

/**
 * Verify payment with backend
 */
export async function verifyPayment(transactionId: string): Promise<boolean> {
  try {
    const response = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactionId }),
    });
    
    const data = await response.json();
    return data.verified === true;
  } catch (error) {
    console.error('Payment verification failed:', error);
    return false;
  }
}

/**
 * Generate unique transaction reference
 */
export function generateTransactionRef(): string {
  return `IA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
