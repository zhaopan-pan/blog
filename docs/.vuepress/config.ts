import {defineUserConfig} from 'vuepress'
import {themeConfig} from './config/index.js'
import ZpTheme from 'vuepress-theme-zp'
import {sitemapPlugin} from 'vuepress-plugin-sitemap2'

export default defineUserConfig({
	lang: 'zh-CN',
	title: '幻无',
	base: '/',
	description: "huanwu's blog",
	head: [
		[
			'link',
			{
				rel: 'icon',
				size: '32x32',
				href: '/icons/favicon-32x32.png?v=1.0',
			},
		],
		[
			'link',
			{
				rel: 'icon',
				size: '16x16',
				href: '/icons/favicon-16x16.png?v=1.0',
			},
		],
		[
			'link',
			{
				rel: 'apple-touch-icon',
				sizes: '180x180',
				href: '/icons/apple-touch-icon.png?v=1.0',
			},
		],
		[
			'link',
			{
				rel: 'mask-icon',
				color: '#5bbad5',
				href: '/icons/safari-pinned-tab.svg?v=1.0',
			},
		],
		['link', {rel: 'manifest', href: '/manifest.webmanifest?v=1.0'}],
		['meta', {name: 'msapplication-TileColor', content: '#00aba9'}],
		['meta', {name: 'theme-color', content: '#3eaf7c'}],
	],
	theme: ZpTheme(themeConfig()),
	markdown: {
		headers: {
			// 侧边栏<h1+>深度
			level: [2, 3, 4],
		},
	},
	plugins: [sitemapPlugin({hostname: 'https://zhaopanpan.com/'})],
})
