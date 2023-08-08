import {defineUserConfig} from 'vuepress'
import {themeConfig} from './config/index.js'
import ZpTheme from 'vuepress-theme-zp'
import {getHead} from './config/head/index.js'
import getPlugins from './config/plugin/index.js'
import siteInfo from './config/siteInfo/index.js'

const {title, hostname, email, description} = siteInfo

export default defineUserConfig({
	// 目前文档无国际化，所以暂时置空,覆盖默认
	lang: '-',
	title: title,
	base: '/',
	description,
	head: getHead(),
	theme: ZpTheme(themeConfig()),
	markdown: {
		headers: {
			// 侧边栏<h1+>深度
			level: [2, 3, 4],
		},
	},
	plugins: getPlugins({hostname, title, email}),
})
