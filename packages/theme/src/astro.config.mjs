import { stat } from 'node:fs/promises'
import { defineConfig } from 'astro/config'
import cabin from './integration.js'

export default defineConfig({
  integrations: [
    {
      name: 'cabin:site-config',
      hooks: {
        async 'astro:config:setup'({ config, updateConfig, addWatchFile }) {
          const file = new URL('cabin.config.mjs', config.root)
          // Node caches imported modules. Reload the options when Astro restarts after a change.
          file.searchParams.set('mtime', String((await stat(file)).mtimeMs))
          const { default: options } = await import(file.href)
          file.search = ''
          addWatchFile(file)
          updateConfig({ integrations: [cabin(options)] })
        },
      },
    },
  ],
})
