import type { APIRoute } from 'astro'
import { getDocuments, getPosts } from '../lib/content'
import { getTaxonomy } from '../lib/site'

export const GET: APIRoute = async ({ site }) => {
  const urls = [
    '/',
    '/posts/',
    '/category/',
    '/tag/',
    ...(await getPosts()).map((entry) => entry.href),
    ...(await getDocuments()).map((entry) => entry.href),
    ...(await getTaxonomy('category')).map(({ href }) => href),
    ...(await getTaxonomy('tag')).map(({ href }) => href),
  ]
  const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;')
  return new Response(
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      [...new Set(urls)]
        .map((url) => `  <url><loc>${escape(new URL(url, site).href)}</loc></url>`)
        .join('\n') +
      '\n</urlset>\n',
    { headers: { 'Content-Type': 'application/xml; charset=UTF-8' } },
  )
}
