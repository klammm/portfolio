export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  keywords: string[];
  /** Optional slug into the playground demo registry — renders that live component inline in the post. */
  demo?: string;
  content: string;
};

const files = import.meta.glob('/src/data/blog/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

function slugFromPath(path: string): string {
  const filename = path.split('/').pop() ?? path;
  return filename.replace(/\.md$/, '');
}

function stripQuotes(value: string): string {
  return value.trim().replace(/^["']|["']$/g, '');
}

function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const [, frontmatterBlock, content] = match;
  const data: Record<string, unknown> = {};
  const lines = frontmatterBlock.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const lineMatch = lines[i].match(/^(\w+):\s*(.*)$/);
    if (!lineMatch) continue;
    const [, key, rawValue] = lineMatch;
    const trimmed = rawValue.trim();

    if (trimmed === '') {
      // Possibly a multi-line list under this key — collect indented `- item` lines.
      const items: string[] = [];
      let j = i + 1;
      while (j < lines.length && /^\s*-\s+/.test(lines[j])) {
        items.push(stripQuotes(lines[j].replace(/^\s*-\s+/, '')));
        j++;
      }
      if (items.length > 0) {
        data[key] = items;
        i = j - 1;
        continue;
      }
      data[key] = '';
    } else if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      data[key] = trimmed
        .slice(1, -1)
        .split(',')
        .map(stripQuotes)
        .filter(Boolean);
    } else {
      data[key] = stripQuotes(trimmed);
    }
  }

  return { data, content: content.trim() };
}

// Old posts don't all have a frontmatter excerpt (Gatsby generated theirs
// differently) — fall back to the first real paragraph instead of leaving
// the blog index with a blank line.
function deriveExcerpt(content: string): string {
  const firstParagraph = content
    .split('\n\n')
    .map((block) => block.trim())
    .find((block) => block.length > 0 && !block.startsWith('#'));
  if (!firstParagraph) return '';
  const plain = firstParagraph.replace(/[*_`#>[\]]/g, '');
  return plain.length > 160 ? `${plain.slice(0, 160).trimEnd()}…` : plain;
}

function parsePost(path: string, raw: string): BlogPost {
  const { data, content } = parseFrontmatter(raw);
  return {
    slug: slugFromPath(path),
    title: (data.title as string) ?? slugFromPath(path),
    date: (data.date as string) ?? '',
    excerpt: (data.excerpt as string) || deriveExcerpt(content),
    tags: (data.tags as string[]) ?? [],
    keywords: (data.keywords as string[]) ?? [],
    demo: (data.demo as string) || undefined,
    content,
  };
}

const allPosts: BlogPost[] = Object.entries(files)
  .map(([path, raw]) => parsePost(path, raw))
  .sort((a, b) => (a.date < b.date ? 1 : -1)); // newest first

export function getAllPosts(): BlogPost[] {
  return allPosts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return allPosts.find((post) => post.slug === slug);
}
