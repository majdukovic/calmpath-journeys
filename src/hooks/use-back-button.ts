import { useEffect, useRef } from 'react';
import { App } from '@capacitor/app';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { isNativeApp } from '@/lib/platform';

const EXIT_TIMEOUT = 2000; // ms to wait for second back press

/**
 * Handles native back button / swipe-back gesture on Android & iOS.
 * If user can navigate back in history → go back.
 * If already on root → show "Press back again to exit" toast.
 * If pressed again within 2s → exit app.
 */
export function useBackButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const lastBackPress = useRef<number>(0);

  useEffect(() => {
    if (!isNativeApp) return;

    const listener = App.addListener('backButton', ({ canGoBack }) => {
      // If we're on a sub-page, navigate back
      const isRoot = location.pathname === '/';

      if (!isRoot && canGoBack) {
        navigate(-1);
        return;
      }

      // On root screen — double-press to exit
      const now = Date.now();
      if (now - lastBackPress.current < EXIT_TIMEOUT) {
        App.exitApp();
      } else {
        lastBackPress.current = now;
        toast('Press back again to exit', {
          duration: EXIT_TIMEOUT,
          id: 'exit-toast', // prevent stacking
        });
      }
    });

    return () => {
      listener.then(l => l.remove());
    };
  }, [navigate, location.pathname]);
}
