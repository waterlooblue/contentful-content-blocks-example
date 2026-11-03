import React from 'react';

import '../styles/custom.scss';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <header><a href="/">Header</a></header>
      <main>{children}</main>
      <footer>Footer</footer>
    </>
  )
}

export default Layout
