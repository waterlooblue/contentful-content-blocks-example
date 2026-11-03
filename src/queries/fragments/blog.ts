// Fields the Blog block renders. Every block fragment must select
// `__typename` (to pick the component) and `sys { id }` (for the React key).
export const BLOG_FIELDS = /* GraphQL */ `
  fragment BlogFields on Blog {
    __typename
    sys { id }
    slug
    title
    date
    tags
    summary
    post {
      json
    }
  }
`;
