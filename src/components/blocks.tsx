import React from 'react';

import Blog from '@components/blocks/blog';
import Author from '@components/blocks/author';
import type { ContentBlock } from '@typings/contentful';

// List of dynamic components
const components: {
  [K in ContentBlock['__typename']]: React.ComponentType<{ data: Extract<ContentBlock, { __typename: K }> }>;
} = {
  ContentfulBlog: Blog,
  ContentfulAuthor: Author,
};

interface BlocksProps {
  data: ContentBlock;
}

const Blocks = ({ data }: BlocksProps) => {
  const Component = components[data?.__typename] as React.ComponentType<{ data: ContentBlock }> | undefined;
  if (Component) {
    return <Component data={data} />;
  }
  console.log('Missing component for type: ' + data?.__typename);
  return null;
}

export default Blocks
