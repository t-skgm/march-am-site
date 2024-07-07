# march-am site

## 🧞 Commands

| Command             | Action                                           |
| :------------------ | :----------------------------------------------- |
| `npm run dev`       | Starts local dev server at `localhost:3000`      |
| `npm run build`     | Build your production site to `./dist/`          |
| `npm run preview`   | Preview your build locally, before deploying     |
| `npm run astro ...` | Run CLI commands like `astro add`, `astro check` |

## Stacks

- Astro.js
- Tailwind
- Contentful

## dev

- generate types
  - `npx cf-content-types-generator --out src/infra/contentful --environment ENV --spaceId SPACE --token TOKEN --v10 --jsdoc --response`
