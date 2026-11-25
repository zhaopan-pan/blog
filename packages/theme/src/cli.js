#!/usr/bin/env node
import { createRequire } from 'node:module'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { parseArgs } from 'node:util'

const require = createRequire(import.meta.url)
const astroManifest = require.resolve('astro/package.json')
const astroBin = resolve(dirname(astroManifest), require(astroManifest).bin.astro)

const { values } = parseArgs({
  strict: false,
  allowPositionals: true,
  options: { config: { type: 'string' }, root: { type: 'string' } },
})
if (values.config === undefined) {
  const astroConfig = fileURLToPath(new URL('./astro.config.mjs', import.meta.url))
  // Astro resolves --config relative to the site root, including in background processes.
  process.argv.splice(2, 0, `--config=${relative(resolve(values.root ?? '.'), astroConfig)}`)
}

process.argv[1] = astroBin
await import(pathToFileURL(astroBin).href)
