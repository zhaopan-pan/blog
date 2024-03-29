export const blogPlugin = {
	hotReload: true,
	metaScope: 'blogInfo',
	// only files under posts are articles
	filter: ({filePathRelative}) =>
		(filePathRelative || '').startsWith('posts/'),
	// 可以使用此函数来跳过你不需要生成摘要的页面
	excerptFilter: ({frontmatter}) => frontmatter.excerpt,
	getInfo: ({frontmatter, title, data}) => ({
		title,
		author: frontmatter.author || '',
		date: frontmatter.date || null,
		category: frontmatter.category || [],
		cover: frontmatter.cover || '',
		mobileCover: frontmatter.mobileCover || '',
		tag: frontmatter.tag || [],
		readme: frontmatter.readme,
		excerpt: data.excerpt,
	}),
	category: [
		{
			key: 'category',
			// @ts-ignore
			getter: ({frontmatter}) => frontmatter?.category || [],
			path: '/category/',
			layout: 'Category',
			frontmatter: () => ({title: `category's`, sidebar: false}),
			itemLayout: 'Category',
			// itemPath: '/category/:name/',
			itemFrontmatter: (name) => ({title: `${name}`, sidebar: false}),
		},
		{
			key: 'tag',
			// @ts-ignore
			getter: ({frontmatter}) => frontmatter?.tag || [],
			path: '/tag/',
			layout: 'Tag',
			frontmatter: () => ({title: 'Tags', sidebar: false}),
			itemLayout: 'Tag',
			itemPath: '/tag/:name/',
			itemFrontmatter: (name) => ({title: `${name}`, sidebar: false}),
		},
	],
	type: [
		{
			key: 'home',
			// remove archive articles
			filter: (page) => !page.frontmatter.archive,
			path: '/home/',
			frontmatter: () => ({title: 'Home', sidebar: false}),
			// sort pages with time and sticky
			sorter: (pageA, pageB) => {
				if (!pageB.frontmatter.date) return 1
				if (!pageA.frontmatter.date) return -1

				return (
					new Date(pageB.frontmatter.date).getTime() -
					new Date(pageA.frontmatter.date).getTime()
				)
			},
		},
	],
} as {}
