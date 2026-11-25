// @ts-check
/** @import { CabinOptions } from '@huanwu/blog-theme-cabin/types' */

/** @satisfies {CabinOptions} */
const config = {
  url: 'https://nas.zhaopan.site:10443',
  language: 'zh-CN',
  socialLocale: 'zh_CN',
  name: '幻无的小屋',
  author: '幻无',
  description: '记录工作、学习、生活过程中的一些思考',
  github: 'https://github.com/zhaopan-pan',
  email: 'zhaopanhw@foxmail.com',
  editBase: 'https://github.com/zhaopan-pan/blog/edit/master/packages/blog/docs/',
  footerLink: { label: '豫ICP备2021005196号-1', href: 'https://beian.miit.gov.cn/' },
  seo: {
    keywords: ['幻无', '幻无的blog', 'zhaopan', 'zhaopanpan', 'zp', '幻无前端'],
    image: '/image/logo.png',
    verification: {
      'baidu-site-verification': 'codeva-l4TELVWXNF',
      'google-site-verification': 'kYOo5UIMO-xn2SWFh9oPC2C4WqBJ73B2T0Qe_vxpi5k',
    },
  },
  themeStorageKey: 'huanwu-theme',
  home: {
    title: 'Huanwu’s Cabin',
    titleLanguage: 'en',
    tagline: '记录工作、学习、生活过程中的一些思考。',
    intro: [
      [
        {
          text: '你好，我是幻无，是一名全栈开发者。目前主要专注于客户端开发、前端工程化、Agent 开发提效等方面，也负责团队的开发规范和日常管理工作。',
        },
      ],
      [
        { text: '我给 VuePress 做过一套' },
        { text: '开源主题', href: 'https://github.com/zhaopan-pan/vuepress-theme-zp' },
        { text: '，也给开源项目提过 PR。不写代码的时候，我喜欢' },
        { text: '打球和做饭', href: '/about.html' },
        { text: '。' },
      ],
    ],
    recentCount: 3,
    cabinArchiveBefore: '2023',
  },
  icons: {
    favicon: '/house.svg',
    appleTouch: '/image/icons/apple-touch-icon.png',
    manifest: '/manifest.webmanifest',
  },
  manifestIcon: {
    src: '/image/icons/android-chrome-144x144.png',
    sizes: '144x144',
    type: 'image/png',
  },
}

export default config
