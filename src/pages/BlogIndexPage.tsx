import { Link } from 'react-router';
import styled from 'styled-components';
import { getAllPosts } from '../features/blog/blog';
import { Eyebrow, Heading2 } from '../components/shared/SectionHeading';

const Section = styled.section`
  padding: 5.5rem 6vw 7rem;
  max-width: 900px;
  margin: 0 auto;

  @media (max-width: 760px) {
    padding: 4rem 1rem 5rem;
  }
`;

const Intro = styled.div`
  margin-bottom: 3rem;
`;

const PostList = styled.div`
  display: grid;
  gap: 1rem;
`;

const PostCard = styled(Link)`
  display: block;
  padding: 1.4rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  background: ${({ theme }) => theme.colors.bgElevated};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.colors.shadow};
  }
`;

const PostDate = styled.span`
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.palette.missionOrange};
`;

const PostTitle = styled.h3`
  margin: 0.5rem 0 0.4rem;
  font-size: 1.3rem;
`;

const PostExcerpt = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.8rem;
`;

const Tag = styled.span`
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.bgMuted};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.74rem;
  font-weight: 700;
`;

function formatDate(iso: string) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <Section aria-labelledby="blog-title">
      <Intro>
        <Eyebrow $variant="orange">Writing</Eyebrow>
        <Heading2 id="blog-title">Notes on frontend work, mostly.</Heading2>
      </Intro>

      <PostList>
        {posts.map((post) => (
          <PostCard key={post.slug} to={`/blog/${post.slug}`}>
            <PostDate>{formatDate(post.date)}</PostDate>
            <PostTitle>{post.title}</PostTitle>
            <PostExcerpt>{post.excerpt}</PostExcerpt>
            {post.tags.length > 0 && (
              <TagRow>
                {post.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </TagRow>
            )}
          </PostCard>
        ))}
      </PostList>
    </Section>
  );
}
