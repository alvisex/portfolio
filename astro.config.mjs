import { defineConfig } from 'astro/config';
import vue from "@astrojs/vue";
import tailwindcss from "@tailwindcss/vite";
import yaml from '@rollup/plugin-yaml';
import templateCompilerOptions from '@tresjs/core/template-compiler-options';

// https://astro.build/config
export default defineConfig({
  // Tres: treat <Tres*> / <primitive> as renderer elements, not Vue components
  integrations: [vue(templateCompilerOptions)],
  vite: {
    plugins: [
      tailwindcss(),
      yaml()
    ]
  }
});