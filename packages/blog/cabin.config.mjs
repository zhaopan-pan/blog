// @ts-check
/** @import { CabinOptions } from '@huanwu/blog-theme-cabin/types' */

/** @satisfies {CabinOptions} */
const config = {
  url: 'https://zhaopan.me',
  language: 'zh-CN',
  socialLocale: 'zh_CN',
  name: '幻无的小屋',
  author: '幻无',
  description: '记录工作、学习、生活过程中的一些思考',
  github: 'https://github.com/zhaopan-pan',
  email: 'zhaopanhw@foxmail.com',
  editBase: 'https://github.com/zhaopan-pan/blog/edit/master/packages/blog/docs/',
  footer: { name: 'Huanwu’s Cabin', language: 'en', copyright: '2019-PRESENT ©huanwu' },
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
    intro: [
      [
        {
          text: '你好，我是幻无，一名全栈开发者。目前主要专注于客户端开发、前端工程化、Agent 开发提效等方面，也负责团队的开发规范制定和日常管理工作。',
        },
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
