import {defineUserConfig} from 'vuepress'
import {themeConfig} from './config/index.js'
import ZpTheme from 'vuepress-theme-zp'

export default defineUserConfig({
	lang: 'zh-CN',
	title: '幻无',
	description: 'my blog',
	head: [
		[
			'link',
			{
				rel: 'icon',
				href: 'https://p2.music.126.net/s-RX4DnzNQdcOM0pRNrVxQ==/109951166556851964.jpg?param=177y177',
			},
		],
	],
	theme: ZpTheme(themeConfig()),
	markdown: {
		headers: {
			// 侧边栏<h1+>深度
			level: [2, 3],
		},
	},
})
