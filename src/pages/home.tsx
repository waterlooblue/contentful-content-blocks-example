import React from 'react';

import Layout from '../components/layout';
import { contentful } from '../lib/client';
import { useQuery } from '../lib/use-query';
import { getAllPosts } from '../queries/post';

const HomePage = () => {
  const state = useQuery('all-posts', (signal) => getAllPosts(contentful, signal));

  return (
    <Layout>
      <h1>Posts</h1>
      {state.status === 'loading' && <p>Loading…</p>}
      {state.status === 'error' && <p>Couldn't load posts: {state.error.message}</p>}
      {state.status === 'success' && (
        state.data.length === 0 ? (
          <p>No posts yet. Create a Post entry in Contentful to see it here.</p>
        ) : (
          <ul>
            {state.data.map((post) => (
              <li key={post.sys.id}>
                <a href={`/${post.slug}`}>{post.slug}</a>
              </li>
            ))}
          </ul>
        )
      )}
    </Layout>
  )
}

export default HomePage
