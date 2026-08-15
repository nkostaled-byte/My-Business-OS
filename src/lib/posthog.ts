import posthog from 'posthog-js';

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST;

if (POSTHOG_KEY && POSTHOG_HOST) {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: true,
    capture_pageleave: true,
    persistence: 'localStorage',
  });
  console.log('[PostHog] Initialized with project token:', POSTHOG_KEY.substring(0, 10) + '...');
} else {
  console.warn('[PostHog] Missing VITE_POSTHOG_PROJECT_TOKEN or VITE_POSTHOG_HOST. Analytics disabled.');
}

export default posthog;
