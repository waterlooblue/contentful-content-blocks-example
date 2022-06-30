import { graphql } from 'gatsby';

export const Post = graphql`
  fragment Post on ContentfulPost {
    mainContent {
      ... on ContentfulBlog {
        ...Blog
      }
      ... on ContentfulAuthor {
        ...Author
      }
    }
  }
`
