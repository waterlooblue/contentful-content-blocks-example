import React from 'react';
import { graphql, PageProps } from 'gatsby';

import Layout from '@components/layout';
import Blocks from '@components/blocks';
import type { ContentfulPost } from '@typings/contentful';

export const query = graphql`
  query($slug: String!) {
    contentfulPost(slug: { eq: $slug }) {
      ...Post
    }
  }
`

interface PostData {
  contentfulPost: ContentfulPost | null;
}

interface PostContext {
  slug: string;
}

const Page = ({ data }: PageProps<PostData, PostContext>) => {
  const mainContent = data?.contentfulPost?.mainContent;
  return (
    <Layout>
      {mainContent && mainContent.map(content => (
        <Blocks key={content.id} data={content}/>
      ))}
    </Layout>
  )
}

export default Page
