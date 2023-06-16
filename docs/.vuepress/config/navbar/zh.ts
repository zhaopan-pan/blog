import type {NavbarConfig} from 'vuepress-theme-zp'

export const navbarZh: NavbarConfig = [
	{
		text: '首页',
		link: '/',
	},
	{
		text: '分类',
		link: '/category/',
		children: [
			{text: 'backend', link: '/category/backend/'},
			{text: 'frontend', link: '/category/frontend/'},
			{text: '源码', link: '/category/源码/'},
			{text: '算法', link: '/category/算法/'},
		],
	},
	{
		text: '标签',
		link: '/tag/',
	},
	{
		text: '交流',
		link: '/talks',
	},
	{
		text: '关于',
		link: '/about',
	},
	{
		text: '主题源码',
		link: 'https://github.com/zhaopan-pan/vuepress-theme-zp',
	},
]
