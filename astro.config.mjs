// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import remarkGemoji from 'remark-gemoji';

// https://astro.build/config
export default defineConfig({
  site: 'https://ObsisMc.github.io',
  output: 'static',
  image: {
    service: { entrypoint: 'astro/assets/services/noop' },
  },
  markdown: {
    remarkPlugins: [remarkGemoji],
    shikiConfig: {
      theme: 'one-light',
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
