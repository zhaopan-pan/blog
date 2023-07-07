import type {NavbarConfig} from 'vuepress-theme-zp'

export const navbarZh: NavbarConfig = [
	{
		text: '首页',
		link: '/',
		icon: {name: 'ion:home-outline'},
	},
	{
		text: '分类',
		link: '/category/',
		icon: {name: 'iconamoon:category-light'},
		children: [
			{
				text: 'backend',
				link: '/category/backend/',
				icon: {name: 'solar:server-outline'},
			},
			{
				text: 'frontend',
				link: '/category/frontend/',
				icon: {name: 'ph:browser'},
			},
			{
				text: '源码',
				link: '/category/源码/',
				icon: {name: 'tabler:source-code'},
			},
			{
				text: '算法',
				link: '/category/算法/',
				icon: {name: 'tabler:binary-tree'},
			},
		],
	},
	{
		text: '标签',
		link: '/tag/',
		icon: {name: 'akar-icons:tag'},
	},
	{
		text: '交流',
		link: '/talks.html',
		icon: {name: 'icon-park-outline:ppt'},
	},
	{
		text: '关于',
		link: '/about.html',
		icon: {name: 'mdi:about-circle-outline'},
	},
	{
		text: '主题源码',
		link: 'https://github.com/zhaopan-pan/vuepress-theme-zp',
	},
]
