import type { APIRoute } from 'astro'
import { siteConfig } from '../lib/config'

export const GET: APIRoute = () =>
  new Response(
    `User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap.xml', siteConfig.url).href}\n`,
    {
      headers: { 'Content-Type': 'text/plain; charset=UTF-8' },
    },
  )
