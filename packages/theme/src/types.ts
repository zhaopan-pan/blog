export interface NavItem {
  key: string
  label: string
  href: string
}

export interface ThemeSite {
  url: string
  name: string
  description: string
  language: string
  socialLocale?: string
  github?: string
  footer?: { name?: string; language?: string; copyright?: string }
  navigation?: readonly NavItem[]
  search?: boolean
  themeStorageKey?: string
  seo?: {
    keywords?: readonly string[]
    image?: string
    verification?: Readonly<Record<string, string>>
  }
  icons?: { favicon?: string; appleTouch?: string; manifest?: string }
}

export interface CabinOptions extends Omit<ThemeSite, 'language'> {
  language?: string
  author?: string
  email?: string
  editBase?: string
  comments?: { serverURL: string; lang?: string }
  manifestIcon?: { src: string; sizes: string; type: string }
  home?: {
    title?: string
    titleLanguage?: string
    intro?: readonly (readonly { text: string; href?: string }[])[]
    recentCount?: number
    cabinArchiveBefore?: string
  }
}

export interface Heading {
  id: string
  title: string
  level: 2 | 3 | 4
}

export interface PostSummary {
  href: string
  title: string
  date: string
}

export interface PageDocument {
  href: string
  title: string
  description?: string
  html: string
  mermaid?: boolean
}
