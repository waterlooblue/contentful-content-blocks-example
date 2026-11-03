import { AUTHOR_FIELDS } from './fragments/author';
import { BLOG_FIELDS } from './fragments/blog';
import type { Post, PostSummary } from '../types/contentful';
import type { ContentfulClient } from '../lib/contentful';

// Fetches a post and every block in `mainContent` in a single request.
// Each inline fragment selects only that block type's own fields, so the
// response carries just what the components render.
// Add a `... on X { ...XFields }` entry (and its fragment) for each new block type.
// See docs/content-blocks.md.
export const POST_BY_SLUG_QUERY = /* GraphQL */ `
  query PostBySlug($slug: String!, $preview: Boolean!) {
    postCollection(where: { slug: $slug }, limit: 1, preview: $preview) {
      items {
        sys { id }
        slug
        mainContentCollection(limit: 20) {
          items {
            __typename
            ... on Blog {
              ...BlogFields
            }
            ... on Author {
              ...AuthorFields
            }
          }
        }
      }
    }
  }
  ${BLOG_FIELDS}
  ${AUTHOR_FIELDS}
`;

export const ALL_POSTS_QUERY = /* GraphQL */ `
  query AllPosts($preview: Boolean!) {
    postCollection(limit: 100, preview: $preview) {
      items {
        sys { id }
        slug
      }
    }
  }
`;

export async function getPostBySlug(
  client: ContentfulClient,
  slug: string,
  signal?: AbortSignal,
): Promise<Post | null> {
  const data = await client.query<{ postCollection: { items: Post[] } }>(
    POST_BY_SLUG_QUERY,
    { slug },
    signal,
  );
  return data.postCollection.items[0] ?? null;
}

export async function getAllPosts(
  client: ContentfulClient,
  signal?: AbortSignal,
): Promise<PostSummary[]> {
  const data = await client.query<{ postCollection: { items: PostSummary[] } }>(
    ALL_POSTS_QUERY,
    {},
    signal,
  );
  return data.postCollection.items;
}
