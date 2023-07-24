import {defineUserConfig} from 'vuepress'
import {themeConfig} from './config/index.js'
import ZpTheme from 'vuepress-theme-zp'
import {sitemapPlugin} from 'vuepress-plugin-sitemap2'
import {getHead} from './config/head/index.js'

const title = '幻无'
export default defineUserConfig({
	// 目前文档无国际化，所以暂时置空,覆盖默认
	lang: '-',
	title: title,
	base: '/',
	description: '幻无的blog',
	head: getHead(title),
	theme: ZpTheme(themeConfig(title)),
	markdown: {
		headers: {
			// 侧边栏<h1+>深度
			level: [2, 3, 4],
		},
	},
	plugins: [sitemapPlugin({hostname: 'https://zhaopanpan.com/'})],
})
