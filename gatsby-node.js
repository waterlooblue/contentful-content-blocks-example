const path = require(`path`);
// Log out information after a build is done
exports.onPostBuild = ({ reporter }) => {
  reporter.info(`Your Gatsby site has been built!`);
};
//Create blog pages dynamically
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const post = path.resolve(`./src/templates/post.js`);
  const result = await graphql(`
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
