import styled from 'styled-components';

// Long-form prose needs different rules than the landing page's punchy
// headline type: a constrained reading width, taller line-height, and
// styles for elements the rest of the site never uses (blockquote, code,
// tables, lists from markdown).
export const Prose = styled.div`
  max-width: 680px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.05rem;
  line-height: 1.75;

  > * + * {
    margin-top: 1.35em;
  }

  h1,
  h2,
  h3 {
    margin-top: 2em;
    line-height: 1.25;
    font-weight: 800;
  }

  h2 {
    font-size: 1.5rem;
  }

  h3 {
    font-size: 1.2rem;
  }

  p,
  li {
    color: ${({ theme }) => theme.colors.text};
  }

  a {
    color: ${({ theme }) => theme.palette.bayTeal};
    text-decoration: underline;
    text-underline-offset: 2px;

    &:hover {
      color: ${({ theme }) => theme.palette.missionOrange};
    }
  }

  ul,
  ol {
    padding-left: 1.4em;
  }

  li + li {
    margin-top: 0.4em;
  }

  li::marker {
    color: ${({ theme }) => theme.palette.goldRush};
  }

  blockquote {
    margin: 1.5em 0;
    padding: 0.2em 0 0.2em 1.1em;
    border-left: 3px solid ${({ theme }) => theme.palette.goldRush};
    color: ${({ theme }) => theme.colors.textMuted};
    font-style: italic;
  }

  code {
    padding: 0.15em 0.4em;
    border-radius: 4px;
    background: ${({ theme }) => theme.colors.bgMuted};
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 0.88em;
  }

  pre {
    margin: 1.5em 0;
    padding: 1.1em 1.2em;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius};
    background: ${({ theme }) => theme.colors.bgElevated};
    overflow-x: auto;

    code {
      padding: 0;
      background: none;
      font-size: 0.85em;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.92em;
  }

  th,
  td {
    padding: 0.5em 0.75em;
    border: 1px solid ${({ theme }) => theme.colors.border};
    text-align: left;
  }

  th {
    background: ${({ theme }) => theme.colors.bgMuted};
  }

  img {
    max-width: 100%;
    border-radius: ${({ theme }) => theme.radius};
  }

  hr {
    border: none;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }

  /* Minimal syntax-highlight palette for rehype-highlight's hljs-* classes,
     tied to theme tokens rather than an imported highlight.js stylesheet,
     so code blocks respect light/dark mode like everything else. */
  .hljs-keyword,
  .hljs-selector-tag,
  .hljs-literal {
    color: ${({ theme }) => theme.palette.bayTeal};
  }

  .hljs-string,
  .hljs-attr {
    color: ${({ theme }) => theme.palette.missionOrange};
  }

  .hljs-comment {
    color: ${({ theme }) => theme.colors.textMuted};
    font-style: italic;
  }

  .hljs-number,
  .hljs-title {
    color: ${({ theme }) => theme.palette.goldRush};
  }
`;
