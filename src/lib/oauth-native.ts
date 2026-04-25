import { Browser } from '@capacitor/browser';
import { supabase } from '@/integrations/supabase/client';

/** Custom URL scheme used for OAuth deep link callbacks on both iOS and Android */
export const OAUTH_CALLBACK_URL = 'breeze://login-callback';

/**
 * Opens the Supabase OAuth flow in the in-app browser with a deep link redirect.
 * Used on native platforms (iOS/Android) instead of the Lovable web flow.
 */
export async function signInWithOAuthNative(provider: 'google' | 'apple') {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: OAUTH_CALLBACK_URL,
      skipBrowserRedirect: true,
    },
  });

  if (error) return { error };
  if (!data.url) return { error: new Error('No OAuth URL returned') };

  await Browser.open({ url: data.url, windowName: '_self' });
  return {};
}

/**
 * Handles the deep link URL opened after OAuth redirect.
 * Call this from App.addListener('appUrlOpen').
 *
 * Supabase v2 uses PKCE by default (code in query params).
 * Falls back to implicit flow (tokens in hash) just in case.
 */
export async function handleOAuthCallback(url: string): Promise<boolean> {
  if (!url.includes('login-callback')) return false;

  try {
    // PKCE flow: ?code=... in query params (Supabase v2 default)
    const parsed = new URL(url.replace(/^breeze:\/\//, 'https://breeze.app/'));
    const code = parsed.searchParams.get('code');

    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) console.error('[OAuth] Code exchange failed:', error);
    } else {
      // Implicit flow fallback: #access_token=...&refresh_token=... in hash
      const hash = url.split('#')[1];
      if (hash) {
        const params = new URLSearchParams(hash);
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');
        if (access_token && refresh_token) {
          await supabase.auth.setSession({ access_token, refresh_token });
        }
      }
    }
  } catch (e) {
    console.error('[OAuth] Callback handling failed:', e);
  }

  await Browser.close();
  return true;
}
