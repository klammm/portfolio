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
    title: 'Debounced Search and Stopwatch Timer',
    description: 'Debounced Search and a Stopwatch Timer as part of state closures practice',
    Component: lazy(() =>
      import('./demos/DebouncedSearch/DebouncedSearch').then((m) => ({ default: m.DebouncedSearch })),
    ),
  },
];

export function getDemoBySlug(slug: string): PlaygroundDemo | undefined {
  return demos.find((demo) => demo.slug === slug);
}
