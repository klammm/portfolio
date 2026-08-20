import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import styled from 'styled-components';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { HomePage } from './pages/HomePage';
import type { ThemeName } from './theme/theme';

// Code-split: the markdown/syntax-highlighting pipeline (react-markdown +
// remark/rehype plugins) is a meaningful chunk of bundle size and has no
// reason to load for anyone just visiting the homepage.
const BlogIndexPage = lazy(() => import('./pages/BlogIndexPage').then((m) => ({ default: m.BlogIndexPage })));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage').then((m) => ({ default: m.BlogPostPage })));
const PlaygroundIndexPage = lazy(() =>
  import('./pages/PlaygroundIndexPage').then((m) => ({ default: m.PlaygroundIndexPage })),
);
const PlaygroundDemoPage = lazy(() =>
  import('./pages/PlaygroundDemoPage').then((m) => ({ default: m.PlaygroundDemoPage })),
);

const Shell = styled.div`
  min-height: 100vh;
`;

type AppProps = {
  theme: ThemeName;
  onToggleTheme: () => void;
};

export default function App({ theme, onToggleTheme }: AppProps) {
  return (
    <Shell>
      <Header theme={theme} onToggleTheme={onToggleTheme} />
      <main id="top">
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog" element={<BlogIndexPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/playground" element={<PlaygroundIndexPage />} />
            <Route path="/playground/:slug" element={<PlaygroundDemoPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </Shell>
  );
}
