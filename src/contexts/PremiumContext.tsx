// Breeze Plus — premium subscription context

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

const DEV_PREMIUM_KEY = 'breeze_dev_premium';

interface PremiumState {
  isPremium: boolean;
  isLoading: boolean;
  subscriptionEnd: string | null;
  checkSubscription: () => Promise<void>;
  startCheckout: (plan: 'monthly' | 'yearly') => Promise<void>;
  openPortal: () => Promise<void>;
  toggleDevPremium: () => void;
  isDevOverride: boolean;
}

const PremiumContext = createContext<PremiumState>({
  isPremium: false,
  isLoading: true,
  subscriptionEnd: null,
  checkSubscription: async () => {},
  startCheckout: async () => {},
  openPortal: async () => {},
  toggleDevPremium: () => {},
  isDevOverride: false,
});

export const usePremium = () => useContext(PremiumContext);

// Stripe price IDs
const PRICES = {
  monthly: 'price_1T8oYv2XleSPsthQHkxocQmj',
  yearly: 'price_1T8oZ42XleSPsthQMMhKg2W7',
} as const;

export const PremiumProvider = ({ children }: { children: ReactNode }) => {
  const [isPremiumReal, setIsPremiumReal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [isDevOverride, setIsDevOverride] = useState(() => {
    try { return localStorage.getItem(DEV_PREMIUM_KEY) === 'true'; } catch { return false; }
  });

  const isPremium = isDevOverride || isPremiumReal;

  const toggleDevPremium = useCallback(() => {
    setIsDevOverride(prev => {
      const next = !prev;
      try { localStorage.setItem(DEV_PREMIUM_KEY, String(next)); } catch {}
      return next;
    });
  }, []);

  const checkSubscription = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsPremiumReal(false);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;

      setIsPremiumReal(data?.subscribed ?? false);
      setSubscriptionEnd(data?.subscription_end ?? null);
    } catch (e) {
      console.error('Failed to check subscription:', e);
      setIsPremiumReal(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSubscription();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkSubscription();
    });

    const interval = setInterval(checkSubscription, 60_000);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, [checkSubscription]);

  const startCheckout = useCallback(async (plan: 'monthly' | 'yearly') => {
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { priceId: PRICES[plan] },
    });
    if (error) throw error;
    if (data?.url) {
      window.open(data.url, '_blank');
    }
  }, []);

  const openPortal = useCallback(async () => {
    const { data, error } = await supabase.functions.invoke('customer-portal');
    if (error) throw error;
    if (data?.url) {
      window.open(data.url, '_blank');
    }
  }, []);

  return (
    <PremiumContext.Provider value={{ isPremium, isLoading, subscriptionEnd, checkSubscription, startCheckout, openPortal, toggleDevPremium, isDevOverride }}>
      {children}
    </PremiumContext.Provider>
  );
};
