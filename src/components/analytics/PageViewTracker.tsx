import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import posthog from '../../lib/posthog';

export const PageViewTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (posthog.__loaded) {
      posthog.capture('$pageview');
    }
  }, [location.pathname]);

  return null;
};
