# The content blocks pattern

This project builds pages from **content blocks**. A page doesn't have a fixed layout. Instead, a `Post` entry in Contentful has a `mainContent` reference field, which holds an ordered list of entries of different types (`Blog`, `Author`, …). Each block type has its own GraphQL fragment and React component. One query fetches the post and all of its blocks, and the page renders each block with the component that matches its type.

The pattern isn't tied to any framework. This repo runs it in a small Vite + React app, but the core (Contentful client, queries, types and block components) only needs `fetch` and React. You can move it into Next.js, Remix, Astro or anything else.

## How it works

```
Contentful                     src/queries/post.ts                  React
──────────                     ───────────────────                  ─────
Post                           getPostBySlug(client, slug)          <PostPage>
 └─ mainContent: [               │                                    <Blocks/> → <Blog/>
      Blog,           ──────►    └─ ONE GraphQL request     ──────►   <Blocks/> → <Author/>
      Author,                       ...BlogFields                     <Blocks/> → <Blog/>
      Blog                          ...AuthorFields
    ]                               (only the fields the
                                     components render)
```

| Piece | File | Role |
| --- | --- | --- |
| Contentful client | `src/lib/contentful.ts` | Sends GraphQL queries to Contentful's GraphQL Content API with `fetch`. No framework dependencies. |
| App config | `src/lib/client.ts` | Creates the client from Vite environment variables. This is the only Vite-specific file in `src/lib`. |
| Post query | `src/queries/post.ts` | `getPostBySlug` fetches one post and its `mainContent` blocks. It adds one inline fragment per block type, so each block returns only its own fields. |
| Block fragments | `src/queries/fragments/*.ts` | Lists the fields one block type needs. Each one includes `__typename` and `sys { id }`. |
| Types | `src/types/contentful.ts` | TypeScript interfaces matching the fragments, and the `ContentBlock` union. |
| Block registry | `src/components/blocks.tsx` | Maps each `__typename` to its component and renders the matching one. |
| Block components | `src/components/blocks/*.tsx` | Render one block type each. |
| Pages | `src/pages/*.tsx`, `src/App.tsx` | Example app: a post list at `/` and a post at `/<slug>`. |

Contentful's GraphQL API names each type after its content type **ID** in PascalCase. A content type with ID `blog` becomes `Blog`, and a reference field `mainContent` becomes `mainContentCollection`. If your IDs differ, rename the types in the fragments, the query and `src/types/contentful.ts`.

## Why use this pattern

### Editors build pages without a developer
Editors can add, remove and reorder blocks in Contentful to build a new page layout. A new layout doesn't need a new content model, page or deploy. Developers only get involved when a new *kind* of block is needed.

### One page component instead of many
Without blocks, every layout (landing page, article, profile page…) tends to get its own content type, query and page component, each with nearly the same code. With blocks, one `Post` type and one post page cover every layout. The variety lives in the blocks, which are small and isolated.

### Each block is self-contained
Each block type owns its fragment, TypeScript interface and component. You can change one block without touching the others or the page. The pieces stay together and are easy to review.

### Not tied to a framework
The client is a few lines around `fetch`, the queries are plain strings, and the components are plain React. Moving to another framework means replacing `src/lib/client.ts` (where the config comes from), `src/App.tsx` (routing) and the pages (where data is loaded). The blocks, fragments, types and query functions stay as they are.

### Adding a block type follows the same steps every time
1. Create the content type in Contentful and allow it in the `mainContent` reference field.
2. Add a fragment in `src/queries/fragments/` that includes `__typename` and `sys { id }`.
3. Add the fragment to `POST_BY_SLUG_QUERY` in `src/queries/post.ts`: an `... on X { ...XFields }` entry inside `mainContentCollection`, plus `${X_FIELDS}` at the end of the query.
4. Add an interface in `src/types/contentful.ts` and add it to the `ContentBlock` union.
5. Add a component in `src/components/blocks/` and register it in `src/components/blocks.tsx`.

The `components` map in `blocks.tsx` is typed against `ContentBlock['__typename']`. If you add a type to the union but forget to register its component, `npm run typecheck` fails. If a block type with no component still shows up at runtime, it renders nothing and logs a console warning, so the rest of the page still renders.

## How it helps performance

### One request per page, no matter how many blocks
`getPostBySlug` fetches the post and **every** block in `mainContent` in a single GraphQL request, through the inline fragments in `post.ts`. A page with 3 blocks and a page with 20 blocks both make one request. This avoids the "N+1" problem you'd get if each block component fetched its own data: N+1 requests, often one after another, each adding a round trip before the page can finish rendering.

### Responses only carry the fields that get rendered
Each fragment lists exactly the fields its component needs, and the inline fragments (`... on Blog`) mean each block returns only its own type's fields. A REST call to the Content Delivery API, by contrast, returns every field of every entry and every linked entry it includes. Smaller responses download and parse faster, which matters most on mobile connections.

To keep this benefit, ask only for fields a component actually uses. For example, rich text `json` fields can be large.

### Smaller queries stay within Contentful's limits
Contentful's GraphQL API rejects queries above a complexity limit. The limit is based on how many entries a query could return, which is why `mainContentCollection` sets `limit: 20` rather than the default of 100. Raise it if a page needs more blocks. Keeping each fragment small also leaves room for more block types in the same query.

### Where the request runs is up to you
The example app fetches in the browser, which is the simplest setup. Visitors see "Loading…" briefly, and the content isn't in the initial HTML. Because the core only needs `fetch`, the same `getPostBySlug` call can run:
- **at build time**, to generate static pages (e.g. Next.js `generateStaticParams`, Astro, or a prerender script). This gives the fastest pages and no Contentful requests on page views.
- **on the server per request**, e.g. in a Next.js server component or a Remix loader, with your own caching.
- **in the browser**, as here. Fine for previews, internal tools and highly dynamic pages.

The block pattern gives the same benefits in all three; only the rendering strategy changes.

### What it does *not* do
- **The JavaScript bundle doesn't shrink automatically.** `blocks.tsx` imports every block component directly, so all of them ship in the same chunk, even on pages that use only one. That's fine for a handful of small blocks. If you end up with many large blocks (carousels, maps, embeds), load the heavy ones lazily with `React.lazy` and `<Suspense>` so Vite splits them into their own chunks. Keep the cheap ones as direct imports.
- **It doesn't make individual components faster.** Each block is still a normal React component. Optimise images (for example with Contentful's Images API parameters `w`, `fm=webp`) and keep expensive rendering off the critical path as usual.
- **There's no caching built in.** Each page view makes a request to Contentful. Add a cache (or render at build time) if you expect a lot of traffic.

## Gotchas

- **Every fragment needs `__typename` and `sys { id }`.** `__typename` is how `Blocks` picks a component, and `sys.id` is the React `key` for the list.
- **Fragment names must be unique within a query.** That's why they're called `BlogFields` and `AuthorFields`.
- **Keep fragments and types in sync.** The interfaces in `src/types/contentful.ts` are written by hand. If you change a fragment, update its interface. Tools like GraphQL Code Generator can generate them from your Contentful schema instead.
- **Unpublished or deleted references come back as `null`.** The post page skips them.
- **Allowed types are set in Contentful.** If editors can't add a block to `mainContent`, check the reference field's validation rules for allowed content types.
- **The access token is public in this setup.** Vite puts `VITE_*` variables in the browser bundle. A Content Delivery API token is read-only and meant for this, but don't ship a Content Preview API token in a public build, because it exposes drafts. Fetch on the server instead if you need to keep tokens private.
