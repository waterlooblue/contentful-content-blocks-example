import React from 'react';

import type { BlockProps, Author as AuthorBlock } from '../../types/contentful';

const Author = ({ data }: BlockProps<AuthorBlock>) => {
  return (
    <aside>
      <strong>{data.name}</strong>
      {data.title && <span> · {data.title}</span>}
    </aside>
  )
}

export default Author
