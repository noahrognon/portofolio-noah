// @ts-check
import { defineConfig } from 'astro/config';
import node from "@astrojs/node";
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: "server", // obligatoire pour SSR
  adapter: node({
    mode: "standalone" // génère dist/server/entry.mjs
  }),
  vite: {
    plugins: [tailwindcss()]
  }
});
