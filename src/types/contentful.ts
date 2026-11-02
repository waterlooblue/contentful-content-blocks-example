// Types mirroring the GraphQL fragments in src/queries.
// Update these alongside the fragments when your content types change.

export interface RichText {
  raw: string;
}

export interface ContentfulBlog {
  __typename: 'ContentfulBlog';
  id: string;
  slug: string;
  title: string;
  date: string;
  tags: string[] | null;
  summary: string | null;
  post: RichText | null;
}

export interface ContentfulAuthor {
  __typename: 'ContentfulAuthor';
  id: string;
  name: string;
  title: string | null;
  bio: RichText | null;
}

export type ContentBlock = ContentfulBlog | ContentfulAuthor;

export interface ContentfulPost {
  mainContent: ContentBlock[] | null;
}

export interface BlockProps<T extends ContentBlock> {
  data: T;
}
