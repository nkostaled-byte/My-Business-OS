import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {PostHogProvider} from 'posthog-js/react';
import posthog from './lib/posthog';
import App from './App.tsx';
import './index.css';

async function removeLegacyPwaState(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    const legacyRegistrations = registrations.filter((registration) => {
      const scriptUrl = registration.active?.scriptURL || registration.waiting?.scriptURL || registration.installing?.scriptURL || '';
      return /\/(?:sw|service-worker|registerSW)\.js(?:$|\?)/i.test(scriptUrl);
    });
    await Promise.all(legacyRegistrations.map((registration) => registration.unregister()));

    if ('caches' in window) {
      const pwaCacheNames = (await caches.keys()).filter((name) =>
        name === 'cloudinary-images' ||
        name === 'google-fonts' ||
        name.startsWith('workbox-precache-') ||
        name.startsWith('workbox-runtime-')
      );
      await Promise.all(pwaCacheNames.map((name) => caches.delete(name)));
    }
  } catch (error) {
    console.warn('[APP] Legacy service-worker cleanup failed:', error);
  }
}

void removeLegacyPwaState();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostHogProvider client={posthog}>
      <App />
    </PostHogProvider>
  </StrictMode>,
);
