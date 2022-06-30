require('dotenv').config();

module.exports = {
  siteMetadata: {
    title: `My Gatsby Site`,
    siteUrl: `https://www.yourdomain.tld`
  },
  plugins: [
    {
      resolve: `gatsby-source-contentful`,
        options: {
          accessToken: process.env.ACCESS_TOKEN,
          spaceId: process.env.SPACE_ID,
          host: process.env.NODE_ENV === 'production' ? process.env.HOST : process.env.PREVIEW_HOST,
          enableTags: true
        },
    },
    'gatsby-plugin-sass',
    'gatsby-plugin-image',
    {
      resolve: 'gatsby-plugin-module-resolver',
      options: {
        aliases: {
          '@node_modules': './node_modules',
          '@components': './src/components',
          '@common': './src/components/common',
          '@images': './src/images',
          '@pages': './src/pages',
          '@styles': './src/styles',
          '@queries': './src/queries',
        },
      },
    },
  ]
};
