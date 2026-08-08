export type Project = {
  title: string;
  tag: string;
  description: string;
  impact: string;
  // Optional: link to a case study, repo, or live URL. If omitted, the card
  // renders without the "go somewhere" arrow instead of faking a link.
  url?: string;
};

export const projects: Project[] = [
  {
    title: 'Workflow builder',
    tag: 'Rewst',
    description:
      'Rebuilt the main canvas with React Flow and helped define the interaction patterns for creating node-based automations.',
    impact: 'React Flow, canvas UI, product architecture',
  },
  {
    title: 'Dashboards and workflow lists',
    tag: 'Rewst',
    description:
      'Worked on analytics views, workflow summary cards, activity feeds, and large tables with filtering and date range controls.',
    impact: 'React Table, Material UI, filtering UX',
  },
  {
    title: 'Fender web app',
    tag: 'Tech Holding',
    description:
      'Moved legacy pages toward Next.js and TypeScript, integrated the web tuner, and shipped product work across Fender Play.',
    impact: 'Next.js, TypeScript, Contentful, GraphQL',
  },
];
