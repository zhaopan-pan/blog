import type { APIRoute } from 'astro'
import { globSync, readFileSync } from 'node:fs'
import { extname, join } from 'node:path'
import { siteConfig } from '../../lib/config'

const root = join(siteConfig.contentRoot, 'posts')
const types: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
}

export function getStaticPaths() {
  return globSync('**/*', { cwd: root, withFileTypes: true }).flatMap((file) => {
    const type = types[extname(file.name).toLowerCase()]
    if (!file.isFile() || !type) return []
    const filePath = join(file.parentPath, file.name)
    const asset = filePath.slice(root.length + 1).replaceAll('\\', '/')
    return [{ params: { asset }, props: { filePath, type } }]
  })
}

export const GET: APIRoute = ({ props }) =>
  new Response(readFileSync(props.filePath), {
    headers: { 'Content-Type': props.type },
  })
