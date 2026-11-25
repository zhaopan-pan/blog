import { posix } from 'node:path'
import MarkdownIt, {
  type Env,
  type MarkdownIt as MarkdownParser,
  type RendererRule,
  type Token,
} from 'markdown-it'
import anchor from 'markdown-it-anchor'
import container from 'markdown-it-container'
import { full as emoji } from 'markdown-it-emoji'
import {
  bundledLanguages,
  getSingletonHighlighter,
  type BundledLanguage,
  type Highlighter,
} from 'shiki'
import { themeCopy } from '../theme-copy.js'
import type { Heading } from '../types'

interface RenderEnv extends Env {
  source: string
  highlighter: Highlighter
  mermaid: boolean
}

// VuePress 2's @mdit-vue/shared slug algorithm. Changing it would break deep links.
function legacySlug(text: string) {
  return (
    text
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      // oxlint-disable-next-line no-control-regex -- Match VuePress control-character stripping.
      .replace(/[\u0000-\u001f]/g, '')
      .replace(/[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'“”‘’<>,.?/]+/g, '-')
      .replace(/-{2,}/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/^(\d)/, '_$1')
      .toLowerCase()
  )
}

export function markdownHref(source: string) {
  const path = `/${source}`.replace(/\.md$/, '.html').replace(/\/(README|index)\.html$/i, '/')
  // VuePress sanitizes each pathname component before encoding the URL.
  return encodeURI(
    path
      .split('/')
      .map((part) => {
        const drive = /^[a-z]:/i.exec(part)?.[0] ?? ''
        return (
          drive +
          part
            .slice(drive.length)
            // oxlint-disable-next-line no-control-regex -- Match VuePress filename sanitization.
            .replace(/[\x00-\x1f\x7f<>*#"{}|^[\]`;?:&=+$,]/g, '_')
            .replace(/^_+/, '')
        )
      })
      .join('/'),
  )
}

function resolveUrl(url: string, source: string, image: boolean) {
  if (!url || /^(?:[a-z][\w+.-]*:|\/\/|[#?])/i.test(url)) return url
  const end = url.search(/[?#]/)
  const path = end === -1 ? url : url.slice(0, end)
  const suffix = end === -1 ? '' : url.slice(end)
  let decoded: string
  try {
    decoded = decodeURIComponent(path)
  } catch {
    return url
  }
  const absolute = posix.resolve('/', posix.dirname(source), decoded)
  if (!image) {
    if (decoded.endsWith('.md')) return markdownHref(absolute.slice(1)) + suffix
    if (decoded.endsWith('/')) return `${encodeURI(absolute).replace(/\/$/, '')}/${suffix}`
    if (decoded.endsWith('.html')) return encodeURI(absolute) + suffix
    return url
  }
  if (absolute.startsWith('/posts/')) {
    const asset = absolute
      .slice('/posts/'.length)
      .split('/')
      .map((part) => encodeURIComponent(part).replace(/'/g, '%27'))
      .join('/')
    return `/post-assets/${asset}${suffix}`
  }
  return url
}

function renderImages(html: string, source: string) {
  return html.replace(/<(?:Image|img)(?=[\s/>])(?:"[^"]*"|'[^']*'|[^'">])*>/g, (tag) => {
    const component = tag.startsWith('<Image')
    const image = component ? `<img${tag.slice('<Image'.length)}` : tag
    const resolved = image.replace(
      /(\s+src\s*=\s*)(['"])(.*?)\2/is,
      (_, attr: string, quote: string, src: string) =>
        `${attr}${quote}${resolveUrl(src.trim(), source, true)}${quote}`,
    )
    return /\s+alt\s*=/i.test(resolved)
      ? resolved
      : `<img alt="${component ? 'img' : ''}"${resolved.slice(4)}`
  })
}

const themes = { light: 'vitesse-light', dark: 'vitesse-dark' } as const

function fenceLanguage(info: string) {
  return info.match(/^[^ :[{]+/)?.[0].toLowerCase() ?? 'text'
}

function highlightLanguage(language: string) {
  if (language === 's') return 'shellscript'
  return Object.hasOwn(bundledLanguages, language) ? (language as BundledLanguage) : 'text'
}

function languageLabel(language: string) {
  switch (language) {
    case 'javascript':
      return 'js'
    case 'typescript':
      return 'ts'
    case 'bash':
    case 'shell':
    case 'zsh':
      return 'sh'
    case 'text':
      return ''
    default:
      return language
  }
}

function highlightedLines(info: string) {
  return info
    .match(/\{(\d+(?:-\d+)?(?:\s*,\s*\d+(?:-\d+)?)*)\}/)?.[1]
    .split(',')
    .map((range) => {
      const [start, end = start] = range.split('-').map(Number)
      return { start, end }
    })
}

const md = new MarkdownIt({ html: true }).use(anchor, {
  level: [1, 2, 3, 4, 5, 6],
  slugify: legacySlug,
  permalink: anchor.permalink.ariaHidden({
    class: 'header-anchor',
    symbol: '#',
    space: true,
    placement: 'before',
  }),
})

// These plugins still declare their parser parameter against the pre-v15 @types package.
const useEmoji = emoji as unknown as (parser: MarkdownParser) => void
const useContainer = container as unknown as (
  parser: MarkdownParser,
  kind: string,
  options: { render: RendererRule },
) => void
md.use(useEmoji)

for (const [kind, fallback] of Object.entries(themeCopy.callouts)) {
  md.use(useContainer, kind, {
    render(tokens, index, _options, env) {
      const token = tokens[index]
      if (token.nesting === -1) return kind === 'details' ? '</details>\n' : '</div>\n'
      const title = token.info.trim().slice(kind.length).trim() || fallback
      const text = title ? md.renderInline(title, env) : ''
      if (kind === 'details')
        return `<details class="custom-container details">${text ? `<summary>${text}</summary>` : ''}\n`
      return `<div class="custom-container ${kind}"><p class="custom-container-title">${text}</p>\n`
    },
  })
}

const imageRule = md.renderer.rules.image!
md.renderer.rules.image = (tokens, index, options, env, renderer) => {
  const token = tokens[index]
  const src = token.attrGet('src')
  if (typeof src === 'string' && src)
    token.attrSet('src', resolveUrl(src, (env as RenderEnv).source, true))
  token.attrSet('loading', 'lazy')
  token.attrSet('decoding', 'async')
  return imageRule(tokens, index, options, env, renderer)
}

md.renderer.rules.html_inline = md.renderer.rules.html_block = (tokens, index, _options, env) =>
  renderImages(tokens[index].content, (env as RenderEnv).source)

md.renderer.rules.link_open = (tokens, index, options, env, renderer) => {
  const token = tokens[index]
  const href = token.attrGet('href')
  if (typeof href === 'string' && href) {
    token.attrSet('href', resolveUrl(href, (env as RenderEnv).source, false))
    if (/^(?:https?:)?\/\//i.test(href)) {
      token.attrSet('target', '_blank')
      token.attrSet('rel', 'noopener noreferrer')
    }
  }
  return renderer.renderToken(tokens, index, options)
}

md.renderer.rules.fence = (tokens, index, _options, env) => {
  const context = env as RenderEnv
  const token = tokens[index]
  const info = md.utils.unescapeAll(token.info).trim()
  const language = fenceLanguage(info)
  if (language === 'mermaid') {
    context.mermaid = true
    return `<pre class="mermaid-source"><code>${md.utils.escapeHtml(token.content)}</code></pre>\n`
  }
  const ranges = highlightedLines(info)
  const label = md.utils.escapeHtml(languageLabel(language))
  const html = context.highlighter.codeToHtml(token.content.replace(/\n$/, ''), {
    lang: highlightLanguage(language),
    themes,
    defaultColor: false,
    transformers: ranges
      ? [
          {
            line(node, line) {
              if (ranges.some(({ start, end }) => line >= start && line <= end))
                this.addClassToHast(node, 'highlighted')
            },
          },
        ]
      : undefined,
  })
  return `<div class="code-block" data-language="${label}">${html}</div>\n`
}

function inlineText(token?: Token) {
  return (
    token?.children
      ?.filter(
        (child) =>
          (child.type === 'text' || child.type === 'code_inline' || child.type === 'emoji') &&
          !child.meta?.isPermalinkSymbol,
      )
      .map((child) => child.content)
      .join('')
      .trim() ?? ''
  )
}

export function parseMarkdown(content: string) {
  return md.parse(content, {})
}

export function loadHighlighter(documents: Iterable<Token[]>) {
  const langs = new Set<BundledLanguage>()
  for (const tokens of documents) {
    for (const token of tokens) {
      if (token.type !== 'fence') continue
      const language = fenceLanguage(md.utils.unescapeAll(token.info).trim())
      if (language === 'mermaid') continue
      const lang = highlightLanguage(language)
      if (lang !== 'text') langs.add(lang)
    }
  }
  return getSingletonHighlighter({ themes: Object.values(themes), langs: [...langs] })
}

export function renderMarkdown(tokens: Token[], source: string, highlighter: Highlighter) {
  const env: RenderEnv = { source, highlighter, mermaid: false }
  const headings: Heading[] = []
  let title = ''
  let summary = ''
  for (const [index, token] of tokens.entries()) {
    if (token.type === 'heading_open') {
      const level = Number(token.tag.slice(1))
      const id = token.attrGet('id')
      if (level === 1 && !title) title = inlineText(tokens[index + 1])
      if (
        typeof id === 'string' &&
        id &&
        token.level === 0 &&
        (level === 2 || level === 3 || level === 4)
      ) {
        headings.push({ level, id, title: inlineText(tokens[index + 1]) })
      }
    }
    if (token.type === 'inline' && summary.length < 150) {
      const text = inlineText(token)
      if (text) summary += (summary ? ' ' : '') + text
    }
  }
  const characters = [...summary.replace(/\s+/g, ' ')]
  const description =
    characters.length > 150 ? `${characters.slice(0, 149).join('')}…` : characters.join('')
  const html = md.renderer.render(tokens, md.options, env)
  return { html, headings, title, description, mermaid: env.mermaid }
}
