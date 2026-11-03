import React from 'react';

import Blog from './blocks/blog';
import Author from './blocks/author';
import type { ContentBlock } from '../types/contentful';

// Maps each Contentful `__typename` to the component that renders it.
// The type below requires an entry for every member of the ContentBlock
// union, so `npm run typecheck` fails if a block type has no component.
//
// Note: these are static imports, so every block component is in the same
// JavaScript chunk. If you add large blocks, load them lazily with
// React.lazy. See docs/content-blocks.md.
const components: {
  [K in ContentBlock['__typename']]: React.ComponentType<{ data: Extract<ContentBlock, { __typename: K }> }>;
} = {
  Blog,
  Author,
};

interface BlocksProps {
  data: ContentBlock;
}

const Blocks = ({ data }: BlocksProps) => {
  const Component = components[data?.__typename] as React.ComponentType<{ data: ContentBlock }> | undefined;
  if (Component) {
    return <Component data={data} />;
  }
  console.warn('Missing component for type: ' + data?.__typename);
  return null;
}

export default Blocks
