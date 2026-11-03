import React from 'react';

import Layout from '../components/layout';

const NotFoundPage = () => {
  return (
    <Layout>
      <h1>Page not found</h1>
      <p>Sorry, we couldn't find what you were looking for.</p>
      <p><a href="/">Go home</a></p>
    </Layout>
  )
}

export default NotFoundPage
