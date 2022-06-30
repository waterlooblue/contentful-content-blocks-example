import React from 'react';

import Blog from '@components/blocks/author';
import Author from '@components/blocks/blog';

// List of dynamic components
const components = {
  ContentfulBlog: Blog,
  ContentfulAuthor: Author,
}

const Blocks = ({ data }) => {
  const Component = components[data?.__typename];
  if (Component) {
    return <Component data={data} />;
  }
  console.log('Missing component for type: ' + data?.__typename);
  return null;
}

export default Blocks
