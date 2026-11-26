# Cabin for Astro

Cabin 是 Astro 的静态博客主题。启用集成后，主题负责读取 Markdown、渲染页面、生成路由、构建搜索索引；站点只维护配置、内容和自有静态资源。

## 安装和配置

需要 Node.js 26.13.1 或更新版本。只安装 Cabin；Astro 由主题管理。Cabin 尚未发布到 npm；在本仓库执行 `pnpm --filter @huanwu/blog-theme-cabin pack`，把生成的 `.tgz` 放到站点项目中安装：

```sh
pnpm add ./huanwu-blog-theme-cabin-0.1.0.tgz
```

在站点根目录创建 `cabin.config.mjs`。默认导出站点选项，不需要导入主题或手写 Astro 集成配置：

```js
export default {
  url: 'https://example.com',
  name: '我的博客',
  description: '记录开发和生活',
  author: '我的名字',
}
```

`url` 是站点域名。Cabin 接管 Astro 的源码目录（`srcDir`）和静态路由，适合独立博客，不与站点自建的 `src/pages` 合并。Tailwind 编译和 Pagefind 索引由 Cabin 配置，不用重复安装或配置。站点配置类型为 `CabinOptions`，从 `@huanwu/blog-theme-cabin/types` 导入。

可在 `cabin.config.mjs` 中通过 `footer.name` 自定义页脚站点名（默认使用 `name`），通过 `footer.copyright` 添加版权文字。`footer.language` 可为页脚文字指定语言。

浮动导航与返回顶部按钮共用毛玻璃样式。支持 SVG 背景滤镜时，正文经过导航圆角和边缘会产生像素位移，上下缘的位移更强，并向中央逐渐减弱；其他浏览器保留普通毛玻璃。目录展开时只做模糊，不生成位移图。不支持背景模糊、降低透明度或提高对比度时，使用实色底。

鼠标移入浮动导航时，边缘高光随指针移动；触屏或启用减少动态效果、降低透明度、高对比度时不显示该效果。

目录随正文滚动高亮当前章节，并在对应条目前显示发光圆点。跳转到靠近页尾、无法滚到顶部的章节时，目录仍会标出目标章节。

## 写文章

在 `docs/posts/` 下新增 Markdown，例如 `docs/posts/hello.md`，即可生成 `/posts/hello.html`。可用子目录组织文章。

```markdown
---
title: 第一篇文章
date: 2026-01-20
category: 开发
tag: [Astro]
---

## 开始写作

这是第一篇文章。
```

- 文章需要发表日期 `date`；`title`、`author`、`description`、`category`、`tag` 可选。分类和标签接受单个值或列表。
- 归档、分类和标签由文章自动生成。`docs/about.md` 和 `docs/talks.md` 存在时会生成相应页面并加入默认导航；`docs/home/index.md` 对应旧链接 `/home/`。
- 文章的相对图片可与 Markdown 放在 `docs/posts/` 下；全站共用资源放 `public/`。只构建可信的 Markdown，正文允许原始 HTML。
- Mermaid 流程图跟随站点主题，使用 SVG 文字标签，长标签在布局时自动换行。主题保留作者指定的节点底色；实色节点的文字对比度低于 4.5:1 时，按底色改用黑字或白字。
- `cabin.config.mjs` 可配置首页文案 `home`、导航 `navigation`、SEO `seo`、图标 `icons`、Waline `comments` 和源码编辑链接 `editBase`。默认开启 Pagefind；`search: false` 同时关闭搜索入口和索引构建。

使用 `pnpm exec cabin dev` 本地写作，`pnpm exec cabin build` 构建静态产物，`pnpm exec cabin preview` 预览并验证搜索。CLI 自动读取 `cabin.config.mjs` 并将框架配置交给 Astro。发布 `dist/` 的内容到域名根目录；静态主机必须支持 `.html` 和目录下的 `index.html`。
