import React from 'react';

import type { BlockProps, ContentfulAuthor } from '@typings/contentful';

const Author = ({ data }: BlockProps<ContentfulAuthor>) => {
  return (
    <div>Author</div>
  )
}

export default Author
