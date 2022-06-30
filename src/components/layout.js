import React from 'react';

import '@styles/custom.scss';

const Layout = ({ children }) => {
  return (
    <>
      <header>Header</header>
      <main>{children}</main>
      <footer>Footer</footer>
    </>
  )
}

export default Layout
