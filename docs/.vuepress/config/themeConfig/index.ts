import {ZpThemeOptions} from 'vuepress-theme-zp'
import {sidebarZh} from '../sidebar/index.js'
import {navbarZh} from '../navbar/index.js'
import {blogPlugin, commentPlugin, docsearchPlugin} from '../plugin/index.js'
import cssStr from '../../styles/cssVar.js'

export const themeConfig = (options?: ZpThemeOptions) => ({
	...options,
	blog: {
		name: '幻无',
		description: '',
		avatar: 'https://p2.music.126.net/s-RX4DnzNQdcOM0pRNrVxQ==/109951166556851964.jpg?param=177y177',
		homeTopBg: '',
		// 'https://images.pexels.com/photos/1764702/pexels-photo-1764702.jpeg?auto=compress&cs=tinysrgb&w=1600',
		// 'https://images.pexels.com/photos/3695297/pexels-photo-3695297.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
	},
	locales: {
		'/': {
			// navbar
			navbar: navbarZh,
			// sidebar
			sidebar: sidebarZh,
			// page meta
			editLinkText: 'Edit this page on GitHub',
		},
	},
	themePlugins: {
		blog: blogPlugin,
		comment: commentPlugin,
		search: docsearchPlugin,
	},
	cssVariableStr: cssStr,
})
