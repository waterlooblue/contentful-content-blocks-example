// Types mirroring the GraphQL fragments in src/queries.
// Update these alongside the fragments when your content types change.
//
// Contentful's GraphQL Content API names each type after its content type ID,
// in PascalCase: a `blog` content type becomes `Blog`, `author` becomes `Author`.

export interface Sys {
  id: string;
}

export interface RichText {
  // Rich text document. Render it with @contentful/rich-text-react-renderer
  // (or the equivalent for your framework).
  json: unknown;
}

export interface Blog {
  __typename: 'Blog';
  sys: Sys;
  slug: string | null;
  title: string | null;
  date: string | null;
  tags: string[] | null;
  summary: string | null;
  post: RichText | null;
}

export interface Author {
  __typename: 'Author';
  sys: Sys;
  name: string | null;
  title: string | null;
  bio: RichText | null;
}

export type ContentBlock = Blog | Author;

export interface Post {
  sys: Sys;
  slug: string;
  mainContentCollection: {
    // An entry the API can't resolve (e.g. unpublished) comes back as null.
    items: (ContentBlock | null)[];
  } | null;
}

export interface PostSummary {
  sys: Sys;
  slug: string;
}

export interface BlockProps<T extends ContentBlock> {
  data: T;
}
