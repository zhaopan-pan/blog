import type { SidebarConfig } from 'vuepress-theme-zp'

export const sidebarZh: SidebarConfig = {
  '/': [
    {
      text: 'js',
      collapsible: true,
      children: ['/posts/series-demo/js-1.md', '/posts/series-demo/js-2.md'],
    },
  ],
}
