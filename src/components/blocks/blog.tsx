import React from 'react';

import type { BlockProps, Blog as BlogBlock } from '../../types/contentful';

const Blog = ({ data }: BlockProps<BlogBlock>) => {
  return (
    <article>
      <h2>{data.title}</h2>
      {data.date && <time dateTime={data.date}>{new Date(data.date).toLocaleDateString()}</time>}
      {data.summary && <p>{data.summary}</p>}
    </article>
  )
}

export default Blog
