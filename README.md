<h1 align="center">
  Contentful Content Blocks Example
</h1>

Build pages in Contentful from reusable **content blocks**, and render each block with its own React component. The core isn't tied to a framework: it's a small `fetch`-based client for Contentful's GraphQL Content API, plus queries, types and components. This repo runs it in a minimal Vite + React app.

## 🧱 Why content blocks?

Pages here aren't hard-coded layouts. A Contentful `Post` holds an ordered list of **blocks** (`Blog`, `Author`, …). Each block type has its own GraphQL fragment and React component, and `src/components/blocks.tsx` renders the right component for each block based on its `__typename`.

- **Editors build pages on their own:** they add, remove and reorder blocks in Contentful, with no new page or deploy.
- **One page component covers every layout:** the variety lives in small, self-contained blocks.
- **One request per page:** the post and all its blocks come from a single GraphQL query, with no per-block fetching.
- **Small responses:** fragments select only the fields each component renders.
- **Portable:** the same blocks and queries work at build time, on a server or in the browser, in any framework.

See [docs/content-blocks.md](docs/content-blocks.md) for how it works, the steps for adding a new block type, and the limits of the pattern, including what it does *not* do for bundle size.

## 🚀 Quick start

1.  **Install dependencies**

    ```shell
    npm install
    ```

2.  **Set up your env file**

    Copy `.env.example` to `.env` and add your Contentful space ID and Content Delivery API token (Contentful → Settings → API keys).

3.  **Create your content types**

    The queries expect content types with the IDs `post` (with `slug` and a `mainContent` reference field), `blog` and `author`. If yours are different, update the fragments in `src/queries` and the matching types in `src/types/contentful.ts`.

4.  **Start developing**

    ```shell
    npm run dev
    ```

    Open http://localhost:5173 to see the list of posts, and `/<slug>` to see a post.

## 📜 Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server. |
| `npm run build` | Type check, then build to `dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm run typecheck` | Run the TypeScript type checker. |

## 📁 Project layout

```
src/
  lib/contentful.ts       fetch-based GraphQL client (no framework dependencies)
  lib/client.ts           client configured from Vite env vars
  queries/                GraphQL query + one fragment per block type
  types/contentful.ts     TypeScript types matching the fragments
  components/blocks.tsx   __typename → component registry
  components/blocks/      one component per block type
  pages/, App.tsx         example app: post list and post page
```

## 🚚 Deploying

`npm run build` outputs a static single-page app in `dist/`. Configure your host to serve `index.html` for unknown paths so that `/<slug>` URLs work. To render pages at build time or on a server instead, call `getPostBySlug` from your framework's data-loading step; see [docs/content-blocks.md](docs/content-blocks.md#where-the-request-runs-is-up-to-you).
