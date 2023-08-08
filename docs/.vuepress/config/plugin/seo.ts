import {seoPlugin} from 'vuepress-plugin-seo2'
import {sitemapPlugin} from 'vuepress-plugin-sitemap2'

export default ({hostname, title, email}) => [
	sitemapPlugin({hostname}),
	seoPlugin({
		hostname,
		author: {
			/**
			 * 作者姓名
			 */
			name: title,
			/**
			 * 作者网站
			 */
			url: hostname,
			/**
			 * 作者 Email
			 */
			email,
		},
	}),
]
