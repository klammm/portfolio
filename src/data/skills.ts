export type SkillGroup = {
  label: string;
  items: string[];
};

// Grouped instead of one flat list of 15 pills, so it reads in one glance.
export const skillGroups: SkillGroup[] = [
  {
    label: 'Core',
    items: ['React', 'TypeScript', 'Next.js', 'React Native'],
  },
  {
    label: 'UI & data',
    items: ['React Flow', 'React Table', 'Material UI', 'GraphQL'],
  },
  {
    label: 'Quality',
    items: ['Storybook', 'Chromatic', 'Cypress', 'Jest'],
  },
  {
    label: 'Practices',
    items: ['Accessibility', 'WCAG', 'CI/CD'],
  },
];
