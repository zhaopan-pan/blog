# AGENTS.md

## 改哪里

- `packages/blog/` 只维护 Cabin 配置、`docs/` 内容和 `public/` 资源；不要另建 `astro.config.mjs` 或 `src/pages`。
- `packages/theme/` 维护 Astro 集成、路由、Markdown 兼容、UI 和 Pagefind。共享 TypeScript 选项在 `tsconfig.base.json`。正文和首页小屋由 Astro 静态渲染；小屋交互使用原生 DOM 脚本。
- 保留旧文章正文、图片、`.html` URL 和标题锚点。`docs/about.md` 可更新正文，但仍保留旧 URL 和锚点。

## 怎么验

- Node 和 pnpm 版本见 `.node-version`、根 `package.json`；从仓库根目录运行命令。
- `pnpm check` 检查 lint 和格式，不格式化 `packages/blog/docs/`。Astro 模板改动用 `pnpm build` 验证。
- 内容、路由或 Markdown 渲染改动：构建后运行 `pnpm verify:migration`，对照原稿及图片哈希、旧 URL、锚点和站内引用。
- UI 改动在浏览器验收；搜索要用 `pnpm build` 后的 `pnpm preview`，`pnpm dev` 不生成 Pagefind 索引。
