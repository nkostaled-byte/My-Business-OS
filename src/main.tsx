import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {PostHogProvider} from 'posthog-js/react';
import App from './App.tsx';
import './index.css';

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST;

const posthogOptions = POSTHOG_KEY && POSTHOG_HOST ? {
  api_host: POSTHOG_HOST,
  capture_pageview: false,
  capture_pageleave: true,
  persistence: 'localStorage' as const,
} : undefined;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {POSTHOG_KEY ? (
      <PostHogProvider apiKey={POSTHOG_KEY} options={posthogOptions}>
        <App />
      </PostHogProvider>
    ) : (
      <App />
    )}
  </StrictMode>,
);
