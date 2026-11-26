# 幻无的小屋

用 Astro 和 Vite 生成静态站点，样式由 Tailwind CSS 4 编译。布局、导航、目录、正文和首页小屋使用 Astro 组件；小屋的昼夜切换与随机旧文使用原生 DOM 脚本，不需要 React。

仓库使用 pnpm workspace，两个包同在 `packages/` 下：

| 包                                 | 职责                                                                                      |
| ---------------------------------- | ----------------------------------------------------------------------------------------- |
| [`packages/theme`](packages/theme) | `@huanwu/blog-theme-cabin`：可独立安装的 Astro 集成，负责内容加载、路由、页面和搜索构建。 |
| [`packages/blog`](packages/blog)   | `@huanwu/blog`：私有站点，维护内容、配置和静态资源，通过 `workspace:*` 使用主题。         |

## 本地开发

在仓库根目录运行以下命令。使用 `.node-version` 指定的 Node.js 和根 `package.json` 指定的 pnpm 版本。

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm check
pnpm build
pnpm verify:migration
pnpm preview
```

维护约定见 [AGENTS.md](AGENTS.md)。站内搜索由 Pagefind 在构建时生成索引，查询在浏览器内执行，不依赖第三方服务。

## 站点配置

- [`packages/blog/cabin.config.mjs`](packages/blog/cabin.config.mjs)：站点名称、作者、域名、语言、首页介绍和页脚，以及 SEO、Waline 与文章编辑链接。首页介绍的每段由 `{ text, href? }` 片段组成，添加 `href` 即可插入内联链接。`robots.txt` 和站点清单随构建从这份配置生成。
- [`packages/theme/src/theme-copy.js`](packages/theme/src/theme-copy.js)：导航、目录、返回顶部、搜索、评论、小屋和 404 等默认界面文案。
- 「关于」和「交流」的正文仍维护在 `packages/blog/docs/about.md` 和 `packages/blog/docs/talks.md`。

## 内容与目录

- `packages/blog/docs/`：Markdown 和文章图片；文章放在 `docs/posts/`，沿用原有 frontmatter。

## 迁移性能对照

同机从静态产物实测；JS 只统计 Chromium 移动视口内禁用缓存后、未交互时收到的同源外部 `.js` 响应（本地 HTTP 未压缩），不计内联脚本和第三方请求。

| 指标                  |  VuePress |     Astro |
| --------------------- | --------: | --------: |
| 本地生产构建          |   7.02 秒 |   2.95 秒 |
| 首页外部 JS           | 1,633 KiB |   224 KiB |
| React 面试文章外部 JS | 1,726 KiB |   3.6 KiB |
| 静态产物总大小        |  8.41 MiB | 11.82 MiB |

新版静态目录包含按需加载的 Mermaid 模块，整体变大，但普通文章不加载它。以上不代表线上 LCP 或压缩后的传输量。

移除首页 React 岛屿后，Chromium 移动视口在无交互时不再请求同源外部 JS（改动前约 221 KiB）。小屋交互脚本内联到构建后的首页 HTML。

## 主题打包

在根目录执行 `pnpm --filter @huanwu/blog-theme-cabin pack` 生成主题 tarball。主题接入方式见 [主题 README](packages/theme/README.md)。打包不会包含博客内容，也不会发布到 npm。

## 发布与回滚

见 [部署文档](deploy/README.md)：镜像发布、NAS 定时更新、正式域名与备用入口、验收和回滚。
