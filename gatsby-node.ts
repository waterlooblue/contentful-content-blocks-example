import path from 'path';
import type { GatsbyNode } from 'gatsby';

interface AllPostsQuery {
  allContentfulPost: {
    edges: {
      node: {
        slug: string;
      };
    }[];
  };
}

// Log out information after a build is done
export const onPostBuild: GatsbyNode['onPostBuild'] = ({ reporter }) => {
  reporter.info(`Your Gatsby site has been built!`);
};

// Create blog pages dynamically
export const createPages: GatsbyNode['createPages'] = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;
  const post = path.resolve(`./src/templates/post.tsx`);
  const result = await graphql<AllPostsQuery>(`
    query {
      allContentfulPost {
        edges {
          node {
            slug
          }
        }
      }
    }
  `);
  if (result.errors || !result.data) {
    reporter.panicOnBuild('Error while running GraphQL query for posts.', result.errors);
    return;
  }
  result.data.allContentfulPost.edges.forEach((edge) => {
    createPage({
      path: `/${edge.node.slug}`,
      component: post,
      context: {
        slug: edge.node.slug,
      },
    });
  });
};
