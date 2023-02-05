import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  markdown: { drafts: true },
  integrations: [preact(), tailwind()],
  vite: {
    ssr: {
      noExternal: ["path-to-regexp", "tinacms"],
    },
  },
});
