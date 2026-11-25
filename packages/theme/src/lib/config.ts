import config from 'virtual:cabin/config'
import { themeCopy } from '../theme-copy.js'
import type { ThemeSite } from '../types'

export const sources = import.meta.glob<string>(
  [
    '/docs/posts/**/*.md',
    '/docs/README.md',
    '/docs/about.md',
    '/docs/talks.md',
    '/docs/home/index.md',
  ],
  { query: '?raw', import: 'default', eager: true },
)

export const siteConfig = config

export const sections = [
  { key: 'archive', label: themeCopy.nav.archive, href: '/posts/' },
  { key: 'categories', label: themeCopy.nav.categories, href: '/category/' },
  { key: 'tags', label: themeCopy.nav.tags, href: '/tag/' },
] as const

export const documentLinks = {
  'about.md': { key: 'about', href: '/about.html', label: themeCopy.nav.about },
  'talks.md': { key: 'talks', href: '/talks.html', label: themeCopy.nav.talks },
} as const

export const themeSite: ThemeSite = {
  ...siteConfig,
  navigation: siteConfig.navigation ?? [
    sections[0],
    sections[1],
    ...(Object.hasOwn(sources, '/docs/talks.md') ? [documentLinks['talks.md']] : []),
    ...(Object.hasOwn(sources, '/docs/about.md') ? [documentLinks['about.md']] : []),
  ],
  icons: { manifest: '/manifest.webmanifest', ...siteConfig.icons },
}
