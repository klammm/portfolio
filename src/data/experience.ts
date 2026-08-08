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
      'Led the first pass of the workflow builder redesign and rebuilt the canvas with React Flow.',
      'Added Storybook and Chromatic so the frontend team had a better place to document and review components.',
      'Helped move design tokens and theming from Emotion to Material UI.',
    ],
  },
  {
    company: 'Tech Holding',
    role: 'Senior Software Engineer',
    dates: 'Mar 2020 - Apr 2024',
    highlights: [
      'Worked on Fender features including Shop Bundles, Engagement pages, Home 2.0, and Streaks 2.0.',
      'Migrated parts of the app to Next.js and TypeScript, with Contentful content coming through GraphQL.',
      'Spent a lot of time on code review, Cypress cleanup, responsive polish, accessibility, and analytics.',
    ],
  },
  {
    company: 'Walmart Labs',
    role: 'Software Engineer',
    dates: 'Jul 2017 - Sep 2019',
    highlights: [
      'Rebuilt the global header and footer in plain JavaScript and removed lodash from that path.',
      'Built React A/B testing modules used in ecommerce experiments.',
      'Worked on accessibility and analytics performance, including reducing beacon dispatches.',
    ],
  },
];
