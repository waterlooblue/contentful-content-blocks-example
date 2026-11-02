# The content blocks pattern

This project builds pages from **content blocks**. A page doesn't have a fixed layout. Instead, a `Post` entry in Contentful has a `mainContent` reference field, which holds an ordered list of entries of different types (`Blog`, `Author`, …). Each block type has its own GraphQL fragment and React component. At build time Gatsby fetches all the blocks a page needs, and the page renders each block with the component that matches its type.

This document explains how the pieces fit together, why the pattern is used, and what it does and doesn't do for performance.

## How it works

```
Contentful                     Gatsby build                         Browser
──────────                     ────────────                         ───────
Post                           gatsby-node.ts                       /my-post
 └─ mainContent: [             creates one page per Post             └─ page-data.json
      Blog,           ──────►  templates/post.tsx runs ONE  ──────►     (only the fields
      Author,                  page query using ...Post                  the fragments ask for)
      Blog                      └─ ...Blog / ...Author fragments    <Layout>
    ]                                                                 <Blocks/> → <Blog/>
                                                                      <Blocks/> → <Author/>
                                                                      <Blocks/> → <Blog/>
```

| Piece | File | Role |
| --- | --- | --- |
| Page creation | `gatsby-node.ts` | Queries every `Post` slug and creates one page per post, using the post template. |
| Page query | `src/templates/post.tsx` | Fetches a single `Post` by slug and spreads the `Post` fragment. |
| Post fragment | `src/queries/post.ts` | Selects `mainContent`. It adds one inline fragment per block type, so each block returns only its own fields. |
| Block fragments | `src/queries/fragments/*.ts` | Lists the fields one block type needs. Each one includes `id` and `__typename`. |
| Block registry | `src/components/blocks.tsx` | Maps each `__typename` to its component and renders the matching one. |
| Block components | `src/components/blocks/*.tsx` | Render one block type each, typed with the interfaces in `src/types/contentful.ts`. |

## Why use this pattern

### Editors build pages without a developer
Editors can add, remove and reorder blocks in Contentful to build a new page layout. A new layout doesn't need a new content model, a new template or a deploy. Developers only get involved when a new *kind* of block is needed.

### One template instead of many
Without blocks, every layout (landing page, article, profile page…) tends to get its own content type, page query and template, each with nearly the same code. With blocks, one `Post` type and one `post.tsx` template cover every layout. The variety lives in the blocks, which are small and isolated.

### Each block is self-contained
Each block type owns its fragment, TypeScript interface and component. You can change one block without touching the others or the page query. The pieces stay together and are easy to review.

### Adding a block type follows the same steps every time
1. Create the content type in Contentful and allow it in the `mainContent` reference field.
2. Add a fragment in `src/queries/fragments/` that includes `id` and `__typename`.
3. Spread that fragment inside `mainContent` in `src/queries/post.ts`.
4. Add an interface in `src/types/contentful.ts` and add it to the `ContentBlock` union.
5. Add a component in `src/components/blocks/` and register it in `src/components/blocks.tsx`.

The `components` map in `blocks.tsx` is typed against `ContentBlock['__typename']`. If you add a type to the union but forget to register its component, `npm run typecheck` fails. If a block type with no component still shows up at runtime, it renders nothing and logs a message to the console, so the rest of the page still renders.

## How it helps performance

Most of the performance gain comes from fetching all page data at build time with Gatsby, done in a way that keeps each page's data small and the number of queries low.

### Content is fetched at build time, not when someone visits
`gatsby-source-contentful` pulls content from Contentful during the build, and each page's query runs once, also at build time. The output is static HTML plus a `page-data.json` file for each page. Visitors never wait on the Contentful API: there are no client-side API calls, loading spinners or rate limits on page views. The site can be served from a CDN like any other static files.

### One query per page, no matter how many blocks
The page query in `post.tsx` fetches the post and **every** block in `mainContent` in a single GraphQL query, through the inline fragments in `post.ts`. A page with 3 blocks and a page with 30 blocks both run one query. This avoids the "N+1" problem you'd get if each block component fetched its own data.

### Pages only carry the fields they render
Each fragment lists exactly the fields its component needs. Gatsby saves only the query result in `page-data.json`, so a block's unused Contentful fields never reach the browser. The inline fragments (`... on ContentfulBlog`) also mean each block in the list returns only its own type's fields, not every field of every type.

This keeps the HTML and `page-data.json` small. That matters because Gatsby prefetches `page-data.json` for links as they appear on screen, to make navigating between pages faster. Smaller payloads mean cheaper prefetching.

To keep this benefit, ask only for fields a component actually uses. For example, rich text `raw` fields are JSON strings and can be large.

### Builds stay fast as content grows
- **Fewer queries:** one template and one query per page is less work than many template-specific queries.
- **Incremental sync:** `gatsby-source-contentful` uses Contentful's Sync API. After the first build it fetches only the entries that changed. Keep the `.cache` folder between builds (most Gatsby hosts do) to benefit from this.
- **Shared fragments:** fragments are defined once and reused, so the GraphQL layer doesn't parse and validate copies of the same field lists.

### What it does *not* do
- **The JavaScript bundle doesn't shrink automatically.** `blocks.tsx` imports every block component directly, so all of them ship in the template's JavaScript chunk, even on pages that use only one. That's fine for a handful of small blocks. If you end up with many large blocks (carousels, maps, embeds), load the heavy ones lazily, for example with `React.lazy` and `<Suspense>`. Keep the cheap ones as direct imports.
- **It doesn't make individual components faster.** Each block is still a normal React component. Images should go through `gatsby-plugin-image` (already installed), and expensive rendering should be kept out of the critical path as usual.

## Gotchas

- **Every fragment needs `id` and `__typename`.** `__typename` is how `Blocks` picks a component, and `id` is the React `key` for the list.
- **Fragment names must be unique across the project.** Gatsby registers every exported `graphql` fragment globally.
- **Keep fragments and types in sync.** The interfaces in `src/types/contentful.ts` are written by hand. If you change a fragment, update its interface. For generated types, see Gatsby's `graphqlTypegen` option.
- **Allowed types are set in Contentful.** If editors can't add a block to `mainContent`, check the reference field's validation rules for allowed content types.
