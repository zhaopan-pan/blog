export const themeCopy = {
  nav: {
    primary: '主导航',
    home: '首页',
    archive: '文章',
    categories: '分类',
    tags: '标签',
    talks: '交流',
    about: '关于',
    browse: '文章浏览方式',
    github: 'GitHub',
    email: '邮件',
    skip: '跳到正文',
    toggleTheme: '切换浅色与深色主题',
  },
  home: {
    recent: '最近的文章',
    allPosts: '全部文章',
  },
  cabin: {
    label: '小屋互动插画',
    toggleTheme: '切换昼夜',
    randomPost: '翻一篇旧文',
  },
  archive: {
    /** @param {number} count */
    description: (count) => `${count} 篇文章，按发表年份归档`,
    /** @param {number} count */
    count: (count) => `${count} 篇`,
  },
  post: {
    archive: '文章归档',
    returnToArchive: '返回文章归档',
    edit: '编辑此页面',
    top: '返回顶部',
    toc: '本文目录',
    openToc: '打开本文目录',
  },
  search: {
    label: '搜索',
    shortcut: '搜索（Ctrl/⌘ K）',
    preview: '请运行 pnpm build 和 pnpm preview 预览搜索。',
    loading: '正在加载搜索…',
    error: '无法加载本地搜索，请稍后再试。',
  },
  comments: {
    title: '评论',
    views: '阅读次数',
    viewPrefix: '阅读',
    error: '无法加载评论，请稍后刷新。',
  },
  notFound: {
    title: '找不到页面',
    description: '链接可能已失效。',
    home: '返回首页',
  },
  callouts: { tip: '提示', warning: '注意', danger: '警告', details: '' },
}
