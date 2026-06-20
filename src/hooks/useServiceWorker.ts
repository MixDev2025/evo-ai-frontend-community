import { useState, useEffect, useCallback } from 'react';

interface SWState {
  ready: boolean;
  updateAvailable: boolean;
  registration: ServiceWorkerRegistration | null;
}

export function useServiceWorker() {
  const [state, setState] = useState<SWState>({
    ready: false,
    updateAvailable: false,
    registration: null,
  });

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');

        if (registration.active) {
          setState({ ready: true, updateAvailable: false, registration });
        }

        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.addEventListener('statechange', () => {
              if (
                installingWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                setState({ ready: true, updateAvailable: true, registration });
              }
            });
          }
        });
      } catch (error) {
        console.error('SW registration failed:', error);
      }
    };

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      setState((prev) => ({ ...prev, updateAvailable: false }));
    });

    register();
  }, []);

  const update = useCallback(() => {
    if (state.registration?.waiting) {
      state.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }, [state.registration]);

  return { ...state, update };
}
