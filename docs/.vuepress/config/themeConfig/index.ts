import {ZpThemeOptions} from 'vuepress-theme-zp'
import {sidebarZh} from '../sidebar/index.js'
import {navbarZh} from '../navbar/index.js'
import {blogPlugin, commentPlugin, docsearchPlugin} from './plugin/index.js'
import cssStr from '../../styles/cssVar.js'
import path from 'path'
import siteInfo from '../siteInfo/index.js'

const {title, description} = siteInfo

export const themeConfig = (options?: ZpThemeOptions) => ({
	...options,
	blog: {
		name: title,
		description,
		avatar: 'https://zhaopanpan.com/image/logo.png',
		// homeTopBg:
		// 'https://images.pexels.com/photos/1764702/pexels-photo-1764702.jpeg?auto=compress&cs=tinysrgb&w=1600',
		// 'https://images.pexels.com/photos/3695297/pexels-photo-3695297.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
		externalLinkList: [
			{
				icon: 'https://ts4.cn.mm.bing.net/th?id=ODLS.fe916855-7a5a-4f44-b52e-1c5c31f0329d&w=24&h=24&o=6&pid=1.2',
				text: 'github',
				url: 'https://github.com/zhaopan-pan/vuepress-theme-zp',
			},
			{
				icon: 'https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/6c61ae65d1c41ae8221a670fa32d05aa.svg',
				text: '掘金',
				url: 'https://juejin.cn/user/4292955583560968',
			},
		],
	},
	locales: {
		'/': {
			// navbar
			navbar: navbarZh,
			// sidebar
			sidebar: sidebarZh,
			// page meta
			editLinkText: '编辑此页面',
			lastUpdatedText: '最近更新时间',
			// 不展示提交者信息
			contributors: false,
			// 展示可编辑跳转
			editLink: true,
			// 仓库信息
			docsRepo: 'https://github.com/zhaopan-pan/blog',
			docsBranch: 'master',
			docsDir: 'docs',
			// custom containers
			tip: '提示',
			warning: '注意',
			danger: '警告',
			// 404 page
			notFound: [
				'这里啥都没有',
				'我们怎么到这来了？',
				'这是一个 404 页面',
				'看起来我们进入了错误的链接',
			],
			backToHome: '去首页看看',
		},
	},
	themePlugins: {
		blog: blogPlugin,
		comment: commentPlugin,
		search: docsearchPlugin,
		pwaOption: {
			pwa: {
				skipWaiting: false,
			},
			pwaPopup: {
				locales: {
					'/': {
						message: '发现新内容',
						buttonText: '更新',
					},
				},
			},
		},
	},
	cssVariableStr: cssStr,
	templateBuild: path.resolve(__dirname, '../../templates/build.html'),
	footer: {
		nameLink: '/about.html',
		startYear: 2019,
		beian: {
			text: '豫ICP备2021005196号-1',
			link: 'https://beian.miit.gov.cn',
		},
	},
})
