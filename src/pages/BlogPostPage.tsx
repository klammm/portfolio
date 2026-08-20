import { ArrowLeft } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import styled from 'styled-components';
import { getPostBySlug } from '../features/blog/blog';
import { DemoFrame } from '../features/playground/DemoFrame';
import { getDemoBySlug } from '../features/playground/registry';
import { Prose } from '../theme/Prose';

const Section = styled.section`
  padding: 4rem 6vw 7rem;

  @media (max-width: 760px) {
    padding: 3rem 1rem 5rem;
  }
`;

const Wrap = styled.div`
  max-width: 680px;
  margin: 0 auto;
`;

const Back = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
  font-weight: 700;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const PostHeader = styled.header`
  margin-bottom: 2.5rem;
`;

const PostDate = styled.p`
  margin: 0 0 0.6rem;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.palette.missionOrange};
`;

const PostTitle = styled.h1`
  margin: 0;
  font-size: clamp(2rem, 4vw, 2.8rem);
  line-height: 1.1;
`;

function formatDate(iso: string) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;
  const demo = post?.demo ? getDemoBySlug(post.demo) : undefined;

  if (!post) {
    // Unknown slug — send back to the index rather than showing a dead page.
    return <Navigate to="/blog" replace />;
  }

  return (
    <Section>
      <Wrap>
        <Back to="/blog">
          <ArrowLeft size={15} /> Back to writing
        </Back>

        <PostHeader>
          <PostDate>{formatDate(post.date)}</PostDate>
          <PostTitle>{post.title}</PostTitle>
        </PostHeader>

        <Prose>
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug, rehypeHighlight]}>
            {post.content}
          </ReactMarkdown>
        </Prose>

        {/* Optional live demo referenced by the post's `demo:` frontmatter field.
            Rendered outside <Prose> — it's a real interactive component, not markdown content. */}
        {/* {demo && <DemoFrame demo={demo} />} */}
      </Wrap>
    </Section>
  );
}
