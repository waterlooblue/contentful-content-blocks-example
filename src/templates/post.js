import React from 'react';
import { graphql } from 'gatsby';

import Layout from '@components/layout';
import Blocks from '@components/blocks';

export const query = graphql`
  query($slug: String!) {
    contentfulPost(slug: { eq: $slug }) {
      ...Post
    }
  }
`

const Page = ({ data }) => {
  const {
    mainContent
  } = data?.contentfulPost;
  return (
    <Layout>
      {mainContent && mainContent.map(content => (
        <Blocks key={content.id} data={content}/>
      ))}
    </Layout>
  )
}

export default Page
