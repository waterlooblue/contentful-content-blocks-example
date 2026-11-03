// Fields the Author block renders. Every block fragment must select
// `__typename` (to pick the component) and `sys { id }` (for the React key).
export const AUTHOR_FIELDS = /* GraphQL */ `
  fragment AuthorFields on Author {
    __typename
    sys { id }
    name
    title
    bio {
      json
    }
  }
`;
