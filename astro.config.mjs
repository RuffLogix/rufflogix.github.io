import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://rufflogix.github.io",
  integrations: [mdx(), sitemap(), tailwind(), react()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
