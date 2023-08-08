import {HeadConfig} from 'vuepress'

export const getHead = (title: string): HeadConfig[] => [
	[
		'link',
		{
			rel: 'icon',
			size: '32x32',
			href: '/image/icons/favicon-32x32.png',
		},
	],
	[
		'link',
		{
			rel: 'icon',
			size: '16x16',
			href: '/image/icons/favicon-16x16.png',
		},
	],
	[
		'link',
		{
			rel: 'apple-touch-icon',
			sizes: '180x180',
			href: '/image/icons/apple-touch-icon.png',
		},
	],
	[
		'link',
		{
			rel: 'mask-icon',
			color: '#5bbad5',
			href: '/image/icons/safari-pinned-tab.svg',
		},
	],
	[
		'link',
		{
			rel: 'manifest',
			href: `/manifest.webmanifest`,
		},
	],
	['meta', {name: 'msapplication-TileColor', content: '#00aba9'}],
	['meta', {name: 'theme-color', content: '#3eaf7c'}],
	[
		'meta',
		{
			name: 'keywords',
			content: '幻无,幻无的blog,zhaopan,zhaopanpan,zp,幻无前端',
		},
	],
	[
		'meta',
		{name: 'og:image', content: 'https://zhaopanpan.com/image/logo.png'},
	],
]
