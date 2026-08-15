import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {PostHogProvider} from 'posthog-js/react';
import posthog from './lib/posthog';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostHogProvider client={posthog}>
      <App />
    </PostHogProvider>
  </StrictMode>,
);
