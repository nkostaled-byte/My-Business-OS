import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * SEO — Centralized Route Metadata
 * ================================
 * Single source of truth for per-route title, meta description, canonical URL
 * and robots directives. Dependency-free: manages head tags directly.
 *
 * The static defaults in index.html match the home route so the raw HTML
 * fetched by crawlers is already correct; this hook keeps every client-side
 * navigation in sync (title, description, canonical, Open Graph, robots).
 *
 * NOTE: SITE_URL is the confirmed production origin serving this frontend
 * (dashboard.mygrafixmedia.com). It must stay in sync with public/sitemap.xml
 * and public/robots.txt.
 */

export const SITE_URL = 'https://dashboard.mygrafixmedia.com';
export const SITE_NAME = 'My Business OS';

export interface RouteMeta {
  title: string;
  description: string;
  /** Canonical path when it differs from the current pathname. */
  path?: string;
  /** Whether search engines may index this route. Defaults to true. */
  index?: boolean;
}

const ROUTE_META: Record<string, RouteMeta> = {
  '/': {
    title: 'My Business OS — Bookings, POS, Orders & Inventory in One Platform',
    description:
      'My Business OS helps you manage bookings, orders, point of sale, inventory, and analytics — all in one platform designed for growth.',
  },
  '/features': {
    title: 'My Business OS Features — Bookings, POS, Invoices & Inventory',
    description:
      'Bookings, point of sale, orders, invoicing, inventory, staff, forms, and analytics in one unified business platform.',
  },
  '/pricing': {
    title: 'My Business OS Pricing — Free to Professional Plans',
    description:
      'Simple, transparent pricing for My Business OS. Start free and choose Starter, Business or Professional as you grow — upgrade, downgrade or cancel anytime.',
  },
  '/resources': {
    title: 'Resources & Guides | My Business OS',
    description:
      'Guides and tutorials to help you master your operations and grow your business with My Business OS.',
  },
  '/company': {
    title: 'About My Business OS | My Grafix Media',
    description:
      'Learn about My Business OS — our mission to eliminate software fragmentation with enterprise-grade operational tools for growing businesses.',
  },
  '/contact': {
    title: 'Contact Us | My Business OS',
    description:
      'Contact the My Business OS team with any questions, partnership ideas, or support requests — we are here to help your business grow.',
  },
  '/privacy': {
    title: 'Privacy Policy | My Business OS',
    description:
      'How My Business OS and My Grafix Media collect, use, and protect your personal information.',
  },
  '/terms': {
    title: 'Terms of Service | My Business OS',
    description:
      'The terms and conditions governing your use of My Business OS, including subscriptions, billing, and acceptable use.',
  },
  '/security': {
    title: 'Security | My Business OS',
    description:
      'Security measures, compliance standards, and best practices that protect your business data on My Business OS.',
  },
  '/login': {
    title: 'Sign in | My Business OS',
    description: 'Sign in to your My Business OS dashboard.',
    index: false,
  },
  '/onboarding': {
    title: 'Set Up Your Business | My Business OS',
    description: 'Create or claim your business workspace in My Business OS.',
    index: false,
  },
};

const DASHBOARD_META: RouteMeta = {
  title: 'Dashboard | My Business OS',
  description: 'My Business OS business dashboard.',
  index: false,
};

const HOME_META = ROUTE_META['/'];

export function resolveRouteMeta(pathname: string): RouteMeta {
  if (ROUTE_META[pathname]) return ROUTE_META[pathname];
  if (pathname === '/app' || pathname.startsWith('/app/')) return DASHBOARD_META;
  return HOME_META;
}

function upsertMeta(key: string, content: string, attribute: 'name' | 'property' = 'name'): void {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function upsertCanonical(href: string | null): void {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!href) {
    element?.remove();
    return;
  }
  if (!element) {
    element = document.createElement('link');
    element.rel = 'canonical';
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

function canonicalUrlFor(path: string): string {
  return `${SITE_URL}${path === '/' ? '/' : `/${path.replace(/^\/+/, '')}`}`;
}

/** Apply metadata for the current route. Must be used inside <BrowserRouter>. */
export function usePageMeta(): void {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = resolveRouteMeta(pathname);
    const canonicalUrl = canonicalUrlFor(meta.path ?? pathname);
    const isIndexable = meta.index !== false;

    document.title = meta.title;
    upsertMeta('description', meta.description);
    upsertMeta('robots', isIndexable ? 'index, follow' : 'noindex, nofollow');
    upsertMeta('og:title', meta.title, 'property');
    upsertMeta('og:description', meta.description, 'property');
    upsertMeta('og:url', canonicalUrl, 'property');
    if (isIndexable) {
      upsertCanonical(canonicalUrl);
    } else {
      upsertCanonical(null);
    }
  }, [pathname]);
}
