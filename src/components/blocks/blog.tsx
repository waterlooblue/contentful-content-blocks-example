import React from 'react';

import type { BlockProps, ContentfulBlog } from '@typings/contentful';

const Blog = ({ data }: BlockProps<ContentfulBlog>) => {
  return (
    <div>Blog</div>
  )
}

export default Blog
