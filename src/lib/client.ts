import { createContentfulClient } from './contentful';

// The app's Contentful client, configured from Vite's environment variables.
// This is the only file in src/lib that knows about Vite; swap it out to use
// the core in another framework.
const env = import.meta.env;
const preview = env.VITE_CONTENTFUL_PREVIEW === 'true';

export const contentful = createContentfulClient({
  spaceId: env.VITE_CONTENTFUL_SPACE_ID,
  environment: env.VITE_CONTENTFUL_ENVIRONMENT,
  accessToken: preview ? env.VITE_CONTENTFUL_PREVIEW_ACCESS_TOKEN ?? '' : env.VITE_CONTENTFUL_ACCESS_TOKEN,
  preview,
});
