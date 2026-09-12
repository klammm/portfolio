import { lazy } from 'react';

export type PlaygroundDemo = {
  slug: string;
  title: string;
  description: string;
  Component: React.LazyExoticComponent<() => React.ReactElement>;
};

// Each demo's component code is lazy-loaded, so visiting one demo (or a
// blog post that embeds one) doesn't pull every other demo's code along
// with it. Adding a new demo: create the component file in this folder,
// then add one entry here.
export const demos: PlaygroundDemo[] = [
  {
    slug: 'product-filter-dashboard',
    title: 'Product Filter Dashboard',
    description: ' Search, category filter, price filter, and sort demo using Pokemon and One Piece Trading Cards as part of state fundamentals practice.',
    Component: lazy(() =>
      import('./demos/ProductFilterDashboard/ProductFilterDashboard').then((m) => ({ default: m.ProductFilterDashboard })),
    ),
  },
  {
    slug: 'debounced-search',
    title: 'Debounced Search',
    description: 'Debounced Search demo with One Piece anime characters as part of React state closures practice.',
    Component: lazy(() =>
      import('./demos/DebouncedSearch/DebouncedSearch').then((m) => ({ default: m.DebouncedSearch })),
    ),
  },
  {
    slug: 'stopwatch',
    title: 'Stopwatch',
    description: 'Stopwatch demo as part of React state closures practice',
    Component: lazy(() => import('./demos/Stopwatch').then((m) => ({ default: m.Stopwatch }))),
  },
  {
    slug: 'api-client',
    title: 'API Client',
    description: 'API Client as part of HTTP concepts practice',
    Component: lazy(() => import('./demos/ApiClient/ApiClient').then((m) => ({ default: m.ApiClient }))),
  }
];

export function getDemoBySlug(slug: string): PlaygroundDemo | undefined {
  return demos.find((demo) => demo.slug === slug);
}
