import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import tailwindcss from '@tailwindcss/vite'

const name = '@huanwu/blog-theme-cabin'
const toolbarEntry = 'astro/runtime/client/dev-toolbar/entrypoint.js'

/** @param {import('./types').CabinOptions} options @returns {import('astro').AstroIntegration} */
export default function cabin(options) {
  const { home, search = true, language = 'zh-CN', ...site } = options
  const configId = 'virtual:cabin/config'
  const resolvedConfigId = `\0${configId}`

  return {
    name,
    hooks: {
      'astro:config:setup'({ config, updateConfig }) {
        const contentRoot = fileURLToPath(new URL('docs/', config.root))
        updateConfig({
          site: site.url,
          // File-based routing preserves both article.html and directory/index.html.
          srcDir: new URL('./', import.meta.url),
          output: 'static',
          build: { format: 'preserve' },
          vite: {
            resolve: {
              alias: {
                [toolbarEntry]: fileURLToPath(import.meta.resolve(toolbarEntry)),
              },
            },
            plugins: [
              tailwindcss(),
              {
                name: 'cabin:framework',
                enforce: 'pre',
                resolveId(id) {
                  // Astro's virtual modules and build entries resolve from the site, not Cabin.
                  if (id === 'astro' || id.startsWith('astro/')) {
                    return fileURLToPath(import.meta.resolve(id))
                  }
                },
                configEnvironment: {
                  order: 'post',
                  handler(_name, { optimizeDeps }) {
                    if (optimizeDeps?.include) {
                      optimizeDeps.include = optimizeDeps.include.map((id) =>
                        id.startsWith('astro > ') ? `${name} > ${id}` : id,
                      )
                    }
                  },
                },
              },
              {
                name: 'cabin:config',
                resolveId(id) {
                  if (id === configId) return resolvedConfigId
                },
                load(id) {
                  if (id !== resolvedConfigId) return
                  return `export default ${JSON.stringify({
                    ...site,
                    language,
                    search,
                    contentRoot,
                    home: {
                      title: site.name,
                      intro: [],
                      recentCount: 3,
                      ...home,
                    },
                  })}`
                },
              },
            ],
          },
        })
      },
      async 'astro:build:done'({ dir, logger }) {
        if (!search) return
        const { createIndex, close } = await import('pagefind')
        try {
          const { index, errors } = await createIndex()
          if (!index) throw new Error(errors.join('\n'))
          const path = fileURLToPath(dir)
          const result = await index.addDirectory({ path })
          if (result.errors.length) throw new Error(result.errors.join('\n'))
          const written = await index.writeFiles({ outputPath: join(path, 'pagefind') })
          if (written.errors.length) throw new Error(written.errors.join('\n'))
          logger.info(`Pagefind indexed ${result.page_count} pages`)
        } finally {
          await close()
        }
      },
    },
  }
}
