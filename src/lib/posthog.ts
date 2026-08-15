import posthog from 'posthog-js';

export function getPostHog(): typeof posthog | null {
  if (posthog.__loaded) return posthog;
  return null;
}
