import type { APIRoute } from 'astro'
import { siteConfig } from '../lib/config'

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      name: siteConfig.name,
      short_name: siteConfig.author ?? siteConfig.name,
      description: siteConfig.description,
      lang: siteConfig.language,
      start_url: '/',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      ...(siteConfig.manifestIcon ? { icons: [siteConfig.manifestIcon] } : {}),
    }),
    { headers: { 'Content-Type': 'application/manifest+json; charset=UTF-8' } },
  )
