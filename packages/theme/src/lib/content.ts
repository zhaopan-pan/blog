import { posix } from 'node:path'
import matter from 'gray-matter'
import type { Heading, PostSummary } from '../types'
import { siteConfig, sources } from './config'
import { loadHighlighter, markdownHref, parseMarkdown, renderMarkdown } from './markdown'

export interface Document {
  title: string
  source: string
  href: string
  description?: string
  html: string
  headings: Heading[]
  mermaid: boolean
}

export interface Post extends Document, PostSummary {
  author?: string
  categories: string[]
  tags: string[]
}

interface Frontmatter {
  title?: unknown
  date?: unknown
  description?: unknown
  author?: unknown
  category?: unknown
  tag?: unknown
  head?: [string, { name?: string; content?: string }][]
}

interface LoadedContent {
  posts: Post[]
  documents: Document[]
}

export function taxonomyKey(value: string) {
  // VuePress blog2's taxonomy slugs are distinct from Markdown heading slugs.
  return value
    .replace(/[ _]/g, '-')
    .replace(/[:?*|\\/<>]/g, '')
    .toLowerCase()
}

function normalizeTaxonomy(value: unknown) {
  const items = Array.isArray(value) ? value : [value]
  const labels = new Set<string>()
  for (const item of items) {
    if (typeof item !== 'string') continue
    const label = item.trim()
    if (label) labels.add(label)
  }
  return [...labels]
}

function postDate(value: unknown, source: string) {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  const parts = typeof value === 'string' && /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(value)
  if (!parts) throw new Error(`Expected a publication date in docs/${source}`)
  return `${parts[1]}-${parts[2].padStart(2, '0')}-${parts[3].padStart(2, '0')}`
}

async function loadContent(): Promise<LoadedContent> {
  const entries = Object.entries(sources).map(([path, raw]) => {
    const source = path.slice('/docs/'.length)
    const { data, content } = matter(raw)
    return { source, data: data as Frontmatter, tokens: parseMarkdown(content) }
  })
  const highlighter = await loadHighlighter(entries.map(({ tokens }) => tokens))
  const posts: Post[] = []
  const documents: Document[] = []
  for (const { source, data, tokens } of entries) {
    const rendered = renderMarkdown(tokens, source, highlighter)
    const description =
      typeof data.description === 'string'
        ? data.description
        : (data.head?.find(([tag, attrs]) => tag === 'meta' && attrs?.name === 'description')?.[1]
            .content ?? rendered.description)
    const document: Document = {
      source,
      href: markdownHref(source),
      title:
        (typeof data.title === 'string' && data.title.trim()) ||
        rendered.title ||
        posix.basename(source, '.md'),
      ...(description ? { description } : {}),
      html: rendered.html,
      headings: rendered.headings,
      mermaid: rendered.mermaid,
    }
    if (source.startsWith('posts/')) {
      posts.push({
        ...document,
        date: postDate(data.date, source),
        author: (typeof data.author === 'string' && data.author.trim()) || siteConfig.author,
        categories: normalizeTaxonomy(data.category),
        tags: normalizeTaxonomy(data.tag),
      })
    } else {
      documents.push(document)
    }
  }
  posts.sort((a, b) => b.date.localeCompare(a.date) || a.href.localeCompare(b.href))
  return { posts, documents }
}

let content: Promise<LoadedContent> | undefined

export async function getPosts() {
  return (await (content ??= loadContent())).posts
}

export async function getDocuments() {
  return (await (content ??= loadContent())).documents
}
