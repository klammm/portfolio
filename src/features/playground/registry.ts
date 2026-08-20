// import { lazy } from 'react';

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
  // {
  //   slug: 'product-filter-dashboard',
  //   title: 'Product Filter Dashboard',
  //   description: 'Search, category filter, price filter, and sort — from Day 1 of the study plan.',
  //   Component: lazy(() =>
  //     import('./demos/ProductFilterDashboard').then((m) => ({ default: m.ProductFilterDashboard })),
  //   ),
  // },
];

export function getDemoBySlug(slug: string): PlaygroundDemo | undefined {
  return demos.find((demo) => demo.slug === slug);
}
