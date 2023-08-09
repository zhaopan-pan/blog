import {ExtendPage, SeoContent, seoPlugin} from 'vuepress-plugin-seo2'
import {sitemapPlugin} from 'vuepress-plugin-sitemap2'

export default ({hostname, title, email}) => [
	// 生成sitemap.xml文件
	sitemapPlugin({hostname}),
	// 给html增强seo相关配置
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
		ogp: (ogp: SeoContent, page) => {
			// bing-webmasters：将页面源代码的 <meta description> 标记中的描述长度更改为介于 25 到 160 个字符之间。
			// 暂取120
			const description = (
				page.frontmatter.description || ogp['og:description']
			)?.substring(0, 120)
			// 统一 description
			page.frontmatter.description = ogp[
				'og:description'
			] = `${description}...`
			return ogp
		},
	}),
]
