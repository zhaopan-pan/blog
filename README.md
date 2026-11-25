# 幻无的小屋

用 Astro 和 Vite 生成静态站点，样式由 Tailwind CSS 4 编译。布局、导航、目录和正文使用 Astro 组件；只有首页小屋交互使用 React 岛屿。

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

`pnpm check` 运行 Oxlint 和 Oxfmt。Oxlint 检查 `.astro` 的 frontmatter 和脚本，模板由 Astro 构建验证。`pnpm format` 可应用格式化；`packages/blog/docs/` 不参与格式化。

TypeScript 公共选项放在根目录的 [`tsconfig.base.json`](tsconfig.base.json)，`packages/blog` 和 `packages/theme` 各自继承并声明检查范围。

`pnpm build` 用 Pagefind 为文章和独立内容页构建中文搜索索引，写入 `packages/blog/dist/pagefind/`。在 `pnpm preview` 中用导航搜索按钮或 `Ctrl/⌘ K` 验证；`pnpm dev` 不生成索引。查询在浏览器内执行，不依赖第三方服务。

## 站点配置

- [`packages/blog/cabin.config.mjs`](packages/blog/cabin.config.mjs)：站点名称、作者、域名、语言、首页介绍和页脚，以及 SEO、Waline 与文章编辑链接。首页介绍的每段由 `{ text, href? }` 片段组成，添加 `href` 即可插入内联链接。`robots.txt` 和站点清单随构建从这份配置生成。
- [`packages/theme/src/theme-copy.js`](packages/theme/src/theme-copy.js)：导航、目录、返回顶部、搜索、评论、小屋和 404 等默认界面文案。
- 「关于」和「交流」的正文仍维护在 `packages/blog/docs/about.md` 和 `packages/blog/docs/talks.md`。

## 内容与目录

- `packages/blog/docs/`：原始 Markdown 和本地图片。文章继续放在包内的 `docs/posts/`，沿用原有 frontmatter。
- 博客只维护 Cabin 配置、内容和静态资源，不需要 `astro.config.mjs` 或 `src/pages`。`cabin` CLI 使用主题包自带的 Astro 配置；路由、旧站 Markdown 兼容和 Pagefind 构建也由主题维护。
- `pnpm verify:migration` 对照旧站基线验证原稿和图片哈希、旧 URL、标题锚点以及站内导航和图片引用。持续更新的 `docs/about.md` 不做哈希校验，仍检查其旧 URL 和标题锚点。文章正文不依赖客户端渲染。

## 迁移性能对照

同机从静态产物实测；JS 只统计 Chromium 移动视口内禁用缓存后、未交互时收到的同源外部 `.js` 响应（本地 HTTP 未压缩），不计内联脚本和第三方请求。

| 指标                  |  VuePress |     Astro |
| --------------------- | --------: | --------: |
| 本地生产构建          |   7.02 秒 |   2.95 秒 |
| 首页外部 JS           | 1,633 KiB |   224 KiB |
| React 面试文章外部 JS | 1,726 KiB |   3.6 KiB |
| 静态产物总大小        |  8.41 MiB | 11.82 MiB |

新版静态目录包含按需加载的 Mermaid 模块，整体变大，但普通文章不加载它。以上不代表线上 LCP 或压缩后的传输量。

## 主题打包

在根目录执行 `pnpm --filter @huanwu/blog-theme-cabin pack` 生成主题 tarball。主题接入方式见 [主题 README](packages/theme/README.md)。打包不会包含博客内容，也不会发布到 npm。

## 发布与回滚

### NAS Docker 部署

推送到 `master` 后，[发布工作流](.github/workflows/blog-image.yml) 构建站点、执行迁移校验并对容器做 HTTP 验收。通过后向 GHCR 发布 `ghcr.io/zhaopan-pan/blog:production` 和不可变的 `ghcr.io/zhaopan-pan/blog:sha-<完整提交 SHA>`，同时支持 `linux/amd64` 和 `linux/arm64`。工作流不连接 NAS，也不直接替换线上容器。

在 NAS 的 Docker 项目中使用 [`deploy/compose.yaml`](deploy/compose.yaml)，默认拉取 `production` 标签；需要固定版本或回滚时，在同目录 `.env` 设置 `BLOG_TAG=sha-<完整提交 SHA>`。如 GHCR 镜像是私有的，先用拥有读取该包权限的账号和带 `read:packages` 的 classic PAT 登录 `ghcr.io`，不要把令牌写入 `.env`。

在绿联 Docker 项目的「管理」中开启**镜像更新检测**；如果当前 UGOS 版本提供自动更新开关，可开启它。`pull_policy: always` 只会在 Compose 执行时强制拉取，不会自己定时轮询。没有自动更新开关时，在 NAS 的任务计划中定期执行 [`deploy/update.sh`](deploy/update.sh)：

```sh
cd /共享文件夹/docker/blog
./update.sh
```

在 Compose 文件所在目录手动更新时也执行 `./update.sh`。升级前保留上一个 SHA 标签；回滚时在 `.env` 写入上一版 `sha-...`，再执行相同脚本。首次切换用手机流量验收 HTTPS、旧中文 `.html` 路径、分类目录、HTTP 404、中文搜索和 gzip 响应。

正式地址为 `https://zhaopan.me`。Cloudflare Tunnel 将该域名发布到博客 HTTP 后端；博客容器继续只监听 NAS 本机端口，Lucky 的 `nas.zhaopan.site:10443` 可保留作为备用入口。NAS 管理口 `9443` 不动，也不要把 Docker API 暴露到公网。

### 压缩

Astro/Vite 已在构建时压缩 JS、CSS 等静态资源；HTML、JSON、SVG 等由容器内 Nginx 按请求启用 gzip。运行时压缩优于在构建阶段额外生成 `.gz` 文件：浏览器协商后才传压缩内容，不增加镜像文件数量，也兼容不支持 gzip 的客户端。若通过 Cloudflare Tunnel 访问，Cloudflare 还会对到访客的响应做边缘传输优化；不需要在仓库里预压缩。

### 直接发布静态文件

1. 构建并验证后，把 **`packages/blog/dist/` 的内容**发布到域名根目录。静态服务器须支持原有 `.html` URL 和 `/目录/` 下的 `index.html`，未匹配路径返回 `404.html` 和 HTTP 404；不要加 SPA fallback。
2. 发布前保留上一版静态产物和服务器配置。切换后抽查首页、中文 `.html` 深链、分类目录、站点地图和旧浏览器缓存。保留根路径 `/service-worker.js`，用于注销旧 VuePress worker，避免旧缓存继续生效。
3. `dist/pagefind/` 随同一批静态文件一起发布，不需单独重建线上索引。新站不需要 Node.js 服务进程。
4. 回滚时切回先前的完整静态产物和配置，清理 CDN 缓存。VuePress 构建配置、旧部署脚本和 Algolia 爬虫已移除；历史版本可从 Git 找回。
