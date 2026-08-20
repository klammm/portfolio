export type ExperienceItem = {
  company: string;
  role: string;
  dates: string;
  highlights: string[];
};

export const experience: ExperienceItem[] = [
  {
    company: 'Rewst',
    role: 'Senior Frontend Engineer',
    dates: 'May 2024 - Jan 2026',
    highlights: [
      'Built the frontend architecture and dashboard experience for a workflow automation platform, working extensively with data-heavy tables, filters, and complex UI states.',
      'Built and standardized a component library and design system with Storybook, Chromatic, and Material UI, integrating visual regression testing and automated deployments through GitHub Actions.',
      'Led the first pass of the workflow builder redesign and rebuilt the canvas experience with React Flow.',
    ],
  },
  {
    company: 'Tech Holding',
    role: 'Senior Software Engineer',
    dates: 'Mar 2020 - Apr 2024',
    highlights: [
      'Built user-facing experiences for Fender, including the Online Web Tuner, video player redesign, Shop Bundles, Engagement pages, Home 2.0, and Streaks 2.0.',
      'Led accessibility improvements across Fender ecommerce and Fender Play, improving experiences for keyboard and screen reader users.',
      'Migrated parts of the application to Next.js and TypeScript, while working with Contentful and GraphQL to power content-driven experiences.',
    ],
  },
  {
    company: 'Walmart Labs',
    role: 'Software Engineer',
    dates: 'Jul 2017 - Sep 2019',
    highlights: [
      'Rebuilt Walmart’s global header and footer in plain JavaScript, removing lodash from the critical path and improving performance.',
      'Built React A/B testing modules used across ecommerce experiments.',
      'Improved accessibility and analytics performance, including reducing unnecessary beacon dispatches.',
    ],
  },
];
