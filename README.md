<p align="center">
  <a href="https://www.gatsbyjs.com/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter">
    <img alt="Gatsby" src="https://www.gatsbyjs.com/Gatsby-Monogram.svg" width="60" />
  </a>
</p>
<h1 align="center">
  Contentful Content Blocks Example
</h1>

## 🧱 Why content blocks?

Pages here aren't hard-coded layouts. A Contentful `Post` holds an ordered list of **blocks** (`Blog`, `Author`, …). Each block type has its own GraphQL fragment and React component, and `src/components/blocks.tsx` renders the right component for each block based on its `__typename`.

- **Editors build pages on their own:** they add, remove and reorder blocks in Contentful, with no new template or deploy.
- **One template covers every layout:** the variety lives in small, self-contained blocks.
- **Content is fetched at build time:** pages are static, and visitors never wait on the Contentful API.
- **One query per page:** the post and all its blocks come from a single page query, with no per-block fetching.
- **Small page payloads:** fragments select only the fields each component renders, so unused Contentful data never reaches the browser.

See [docs/content-blocks.md](docs/content-blocks.md) for how it works, the steps for adding a new block type, and the limits of the pattern, including what it does *not* do for bundle size.

## 🚀 Quick start

1.  **Setup your own env file**

    Add your contentful details into your env file. Copy `.env.example` and then save it as `.env`

2.  **Create your content types**

    Update the fragments in `src/queries` with the names of your own content types, and keep the matching TypeScript types in `src/types/contentful.ts` in sync, before moving on to the next step.

3.  **Start developing.**

    Navigate into your new site’s directory and start it up.

    ```shell
    npm run develop
    ```

4.  **Open the code and start customizing!**

    Your site is now running at http://localhost:8000!

    Edit `src/pages/index.tsx` to see your site update in real-time!

5.  **Type check**

    The project is written in TypeScript. Run the type checker with:

    ```shell
    npm run typecheck
    ```
