import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { extname, join, relative, resolve } from 'node:path'
import { load } from 'cheerio'
import siteConfig from '../cabin.config.mjs'

const baseline = JSON.parse(
  readFileSync(new URL('./migration-baseline.json', import.meta.url), 'utf8'),
)
const out = resolve('dist')
const origin = new URL(siteConfig.url).origin
const problems = []
let anchors = 0
let images = 0

for (const [path, digest] of Object.entries(baseline.sources)) {
  if (
    !existsSync(path) ||
    createHash('sha256').update(readFileSync(path)).digest('hex') !== digest
  ) {
    problems.push(`原始内容或图片有变动：${path}`)
  }
}

function outputPath(pathname) {
  const path = decodeURIComponent(pathname)
  return join(out, path.endsWith('/') ? `${path}index.html` : path)
}

const routes = new Map()
for (const file of readdirSync(out, { recursive: true, withFileTypes: true })) {
  if (file.isFile() && extname(file.name) === '.html') {
    const path = join(file.parentPath, file.name)
    routes.set(relative(out, path), load(readFileSync(path, 'utf8')))
  }
}
for (const [path, headings] of Object.entries(baseline.routes)) {
  const $ = routes.get(path)
  if (!$) {
    problems.push(`旧路由缺失：/${path}`)
    continue
  }
  const actual = new Set(
    $('main h1[id], main h2[id], main h3[id], main h4[id], main h5[id], main h6[id]')
      .map((_, el) => $(el).attr('id'))
      .get(),
  )
  for (const id of headings) {
    if (!actual.has(id)) problems.push(`旧锚点缺失：/${path}#${id}`)
    else anchors++
  }
}

for (const [path, $] of routes) {
  const canonical = $('link[rel="canonical"]').attr('href')
  if (
    path !== '404.html' &&
    (!canonical || outputPath(new URL(canonical).pathname) !== join(out, path))
  ) {
    problems.push(`Canonical 与静态文件不一致：/${path} (${canonical ?? 'missing'})`)
  }
  const isPost = path.startsWith('posts/') && path !== 'posts/index.html'
  if (isPost && (!$('article .prose').length || $('astro-island').length))
    problems.push(`文章没有静态正文或加载了岛屿：/${path}`)
  const base = canonical ?? new URL(`/${path}`, origin)
  for (const img of $('main img[src]').get()) {
    const url = new URL($(img).attr('src'), base)
    if (url.origin !== origin) continue
    if (!existsSync(outputPath(url.pathname)))
      problems.push(`本地图片缺失：/${path} → ${url.pathname}`)
    else images++
  }
  for (const link of $(
    '.toc a[href], .dock-nav a[href], .entries a[href], .index-list a[href], .section-nav a[href]',
  ).get()) {
    const url = new URL($(link).attr('href'), base)
    if (url.origin !== origin) continue
    if (!existsSync(outputPath(url.pathname)))
      problems.push(`站点导航链接缺失：/${path} → ${url.pathname}`)
    if (
      url.hash &&
      !$('[id]')
        .get()
        .some((el) => $(el).attr('id') === decodeURIComponent(url.hash.slice(1)))
    ) {
      problems.push(`目录锚点缺失：/${path}${url.hash}`)
    }
  }
}

const sourceCount = Object.keys(baseline.sources).filter((path) => path.endsWith('.md')).length
assert.equal(problems.length, 0, problems.join('\n'))
console.log(
  `迁移校验通过：${sourceCount} 份 Markdown、${Object.keys(baseline.routes).length} 条旧路由、${anchors} 个旧锚点、${images} 处本地图片引用。`,
)
