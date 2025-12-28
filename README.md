# march-am site 🏘️

## 🧞 Commands

| Command             | Action                                           |
| :------------------ | :----------------------------------------------- |
| `pnpm dev`          | Starts local dev server at `localhost:3000`      |
| `pnpm build`        | Build your production site to `./dist/`          |
| `pnpm preview`      | Preview your build locally, before deploying     |
| `pnpm astro ...`    | Run CLI commands like `astro add`, `astro check` |

## Stacks

- Astro.js
- Tailwind
- Contentful

## dev

- generate types
  - `pnpm dlx cf-content-types-generator --out src/infra/contentful --environment ENV --spaceId SPACE --token TOKEN --v10 --jsdoc --response`
