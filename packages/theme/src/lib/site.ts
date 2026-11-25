import { getPosts, taxonomyKey } from './content'

export function taxonomyHref(group: 'category' | 'tag', label: string) {
  return `/${group}/${encodeURIComponent(taxonomyKey(label))}/`
}

export async function getTaxonomy(group: 'category' | 'tag') {
  const posts = await getPosts()
  const entries = new Map<string, { label: string; posts: typeof posts }>()
  for (const post of posts) {
    for (const label of new Set(group === 'category' ? post.categories : post.tags)) {
      const key = taxonomyKey(label)
      const existing = entries.get(key)
      if (existing) existing.posts.push(post)
      else entries.set(key, { label, posts: [post] })
    }
  }
  return [...entries]
    .map(([key, value]) => ({ key, href: `/${group}/${encodeURIComponent(key)}/`, ...value }))
    .sort((a, b) => b.posts.length - a.posts.length || a.label.localeCompare(b.label, 'zh-CN'))
}
