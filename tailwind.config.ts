import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'
import { join } from 'path'
import forms from '@tailwindcss/forms'

// 1. Import the Skeleton plugin
import { skeleton } from '@skeletonlabs/tw-plugin'

export default {
  theme: {
    extend: {},
  },

  darkMode: 'class',
  content: [
    './src/**/*.{html,js,svelte,ts}',
    // 3. Append the path to the Skeleton package
    join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}'),
  ],
  plugins: [
    // 4. Append the Skeleton plugin (after other plugins)
    skeleton({
      themes: {
        preset: [
          { name: 'gold-nouveau', enhancements: true },
          { name: 'wintry', enhancements: true },
        ],
      },
    }),
    forms,
    typography(),
  ],
} satisfies Config
