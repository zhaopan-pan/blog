import {defineUserConfig} from 'vuepress'
import {themeConfig} from './config/index.js'
import ZpTheme from 'vuepress-theme-zp'
import {sitemapPlugin} from 'vuepress-plugin-sitemap2'
import {head} from './config/head/index.js'

export default defineUserConfig({
	lang: 'zh-CN',
	title: '幻无',
	base: '/',
	description: "huanwu's blog",
	head,
	theme: ZpTheme(themeConfig()),
	markdown: {
		headers: {
			// 侧边栏<h1+>深度
			level: [2, 3, 4],
		},
	},
	plugins: [sitemapPlugin({hostname: 'https://zhaopanpan.com/'})],
})
