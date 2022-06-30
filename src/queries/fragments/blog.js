import { graphql } from 'gatsby';

export const Blog = graphql`
  fragment Blog on ContentfulBlog {
    id
    __typename
    slug
    title
    date
    tags
    summary
    post {
      raw
    }
  }
`;
