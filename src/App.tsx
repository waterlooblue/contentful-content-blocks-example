import React from 'react';

import HomePage from './pages/home';
import PostPage from './pages/post';

// Deliberately minimal routing: `/` lists posts and `/<slug>` renders one.
// Replace this with your framework's router when you move the blocks into a real app.
const App = () => {
  const slug = decodeURIComponent(window.location.pathname.replace(/^\/+|\/+$/g, ''));
  return slug ? <PostPage slug={slug} /> : <HomePage />;
}

export default App
