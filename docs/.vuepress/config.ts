import {defineUserConfig} from 'vuepress'
import {themeConfig} from './config/index.js'
import ZpTheme from 'vuepress-theme-zp'
import {sitemapPlugin} from 'vuepress-plugin-sitemap2'
import {head} from './config/head/index.js'

export default defineUserConfig({
	// 如果设置语言 会导致私有化部署的algolia搜索为空，所以暂时置空，
	// 通过官方申请的algolia账号不受影响
	lang: ' ',
	title: '幻无',
	base: '/',
	description: '幻无的blog',
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
