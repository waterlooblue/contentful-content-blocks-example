import { graphql } from 'gatsby';

export const Author = graphql`
  fragment Author on ContentfulAuthor {
    id
    __typename
    name
    title
    bio {
      raw
    }
  }
`;
