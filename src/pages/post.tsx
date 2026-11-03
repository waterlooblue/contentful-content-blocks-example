import React from 'react';

import Layout from '../components/layout';
import Blocks from '../components/blocks';
import NotFoundPage from './not-found';
import { contentful } from '../lib/client';
import { useQuery } from '../lib/use-query';
import { getPostBySlug } from '../queries/post';

interface PostPageProps {
  slug: string;
}

const PostPage = ({ slug }: PostPageProps) => {
  const state = useQuery(slug, (signal) => getPostBySlug(contentful, slug, signal));

  if (state.status === 'loading') {
    return <Layout><p>Loading…</p></Layout>;
  }
  if (state.status === 'error') {
    return <Layout><p>Couldn't load this page: {state.error.message}</p></Layout>;
  }
  if (!state.data) {
    return <NotFoundPage />;
  }

  const blocks = state.data.mainContentCollection?.items ?? [];
  return (
    <Layout>
      {blocks.map((block) => block && (
        <Blocks key={block.sys.id} data={block} />
      ))}
    </Layout>
  )
}

export default PostPage
