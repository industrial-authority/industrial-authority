/**
 * Currency Service
 * Handles IP-based geolocation to determine user currency and provides exchange rates.
 */

export interface GeoInfo {
  currency: string;
  country: string;
  countryCode: string;
}

export interface ExchangeRates {
  [key: string]: number;
}

/**
 * Get user's currency and country based on IP
 */
export async function getUserGeoInfo(): Promise<GeoInfo> {
  try {
    // Using ip-api.com (Free for non-commercial use, no API key required)
    const response = await fetch('http://ip-api.com/json/?fields=status,message,country,countryCode,currency');
    const data = await response.json();

    if (data.status === 'success') {
      return {
        currency: data.currency || 'USD',
        country: data.country || 'United States',
        countryCode: data.countryCode || 'US',
      };
    }
  } catch (error) {
    console.error('Error fetching geo info:', error);
  }

  // Fallback to USD
  return {
    currency: 'USD',
    country: 'United States',
    countryCode: 'US',
  };
}

/**
 * Get exchange rates for a base currency
 */
export async function getExchangeRates(base: string = 'USD'): Promise<ExchangeRates> {
  try {
    // Using Frankfurter API (Free, open-source, no API key required)
    const response = await fetch(`https://api.frankfurter.app/latest?from=${base}`);
    const data = await response.json();

    if (data.rates) {
      return {
        ...data.rates,
        [base]: 1, // Include base currency itself
      };
    }
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
  }

  // Fallback rates (approximate)
  return {
    USD: 1,
    NGN: 1500,
    EUR: 0.92,
    GBP: 0.79,
  };
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  } catch (e) {
    return `${currency} ${amount.toFixed(2)}`;
  }
}
