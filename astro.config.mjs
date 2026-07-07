// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  integrations: [
    icon({
      include: {
        logos: ['javascript', 'typescript', 'react', 'nextjs', 'nodejs', 'dotnet', 'nestjs', 'python', 'angular', 'mongodb', 'mysql', 'graphql', 'git', 'docker', 'html-5', 'css'],
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  },
  adapter: vercel()
});
