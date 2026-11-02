import { graphql } from 'gatsby';

// Fetches every block in `mainContent` in the page's single query.
// Each inline fragment selects only that block type's own fields, so
// page-data.json carries just what the components render.
// Add a `... on ContentfulX { ...X }` entry here for each new block type.
// See docs/content-blocks.md.

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
