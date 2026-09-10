# WJC · 笔记与随想

一个面向长期写作的静态个人博客，内容包括技术文章、学习笔记、随笔与生活记录。站点以 Markdown / MDX 为内容源，由 Astro 构建，并通过 GitHub Actions 自动部署到 GitHub Pages。

当前访问地址：<https://chenwuluqi.github.io/wjc.github.io/>

## 技术架构

- Astro 7 + TypeScript
- Astro Content Collections
- Markdown / MDX
- Shiki 代码高亮
- remark-math + rehype-katex + KaTeX 数学公式
- `@astrojs/rss` 与 `@astrojs/sitemap`
- GitHub Actions + GitHub Pages

站点在生产环境中输出纯静态 HTML、CSS 和少量必要的 JavaScript。客户端脚本仅用于浅色/深色/系统主题切换和代码复制。

## 目录结构

```text
.
├─ .github/workflows/deploy.yml   # GitHub Pages 自动部署
├─ backup/                        # 原 Gmeek 文章备份（保留）
├─ docs/                          # 原 Gmeek 生成站点（保留作历史存档）
├─ public/                        # robots.txt、OG 图等静态资源
├─ scripts/migrate-gmeek.mjs      # Gmeek 文章迁移脚本
├─ src/
│  ├─ components/                 # 页头、页尾、文章列表、目录
│  ├─ content/posts/              # Markdown / MDX 文章
│  ├─ layouts/                    # 全局页面布局
│  ├─ lib/                        # 文章与 URL 工具函数
│  ├─ pages/                      # 首页、文章、归档、标签等路由
│  ├─ styles/global.css           # 全站样式
│  ├─ config.ts                   # 站点名称、简介、导航等配置
│  └─ content.config.ts           # Content Collections Schema
├─ astro.config.mjs               # Astro、Pages base、Markdown 配置
├─ package.json
└─ package-lock.json
```

## 安装与运行

需要 Node.js 22.12 或更高版本；自动部署使用 Node.js 24。

```bash
npm install
npm run dev
```

常用命令：

```bash
npm run dev       # 本地开发
npm run build     # 类型检查并生成生产文件到 dist/
npm run preview   # 预览生产构建
```

## 新建文章

在 `src/content/posts/` 新建 `.md` 或 `.mdx` 文件。文件名就是不含日期的文章 slug，例如：

```text
src/content/posts/why-i-start-writing.md
```

对应地址为：

```text
/posts/why-i-start-writing/
```

推荐从下面的 Frontmatter 开始：

```yaml
---
title: "文章标题"
description: "用于文章列表和 SEO 的简短摘要"
publishDate: "2026-09-10"
updatedDate: "2026-09-10"
category: "essay"
tags: ["写作", "思考"]
draft: true
featured: false
cover: "/images/example.jpg"
---
```

字段说明：

| 字段 | 含义 |
| --- | --- |
| `title` | 文章标题，必填 |
| `description` | 摘要与 SEO 描述，必填 |
| `publishDate` | 发布日期，必填 |
| `updatedDate` | 最后更新日期，可选 |
| `category` | `essay`、`tech`、`life` 或 `notes` |
| `tags` | 标签数组；标签页会自动聚合 |
| `draft` | 草稿开关；生产构建会排除草稿 |
| `featured` | 是否进入首页精选阅读 |
| `cover` | 可选封面路径，已预留字段 |

开发环境会显示草稿并标注“草稿”，生产环境不会为草稿生成首页列表、文章页、归档、标签、RSS 或 Sitemap 记录。

## 图片

推荐把文章图片放在 `src/assets/images/`，并从文章文件使用相对路径引用，例如：

```markdown
![图片说明](../../assets/images/example.png)
```

无需构建处理的静态文件可以放在 `public/`。本仓库是 Project Pages，直接写根路径时要注意 `/wjc.github.io/` 前缀；文章内优先使用上面的相对路径，迁移到独立域名时更省事。

## LaTeX 与代码块

行内公式：

```markdown
能量为 $E = mc^2$。
```

块级公式：

```latex
$$
\operatorname{Attention}(Q,K,V)
= \operatorname{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V
$$
```

代码高亮使用标准 fenced code block，并在反引号后写语言名，例如 `python`、`cpp`、`cuda`、`shell`、`javascript`、`typescript`、`json`、`yaml` 或 `markdown`。

## 发布文章

1. 完成文章并在本地运行 `npm run build`。
2. 把 `draft` 改为 `false`。
3. 提交并推送到 `main` 分支。
4. GitHub Actions 会安装依赖、构建 `dist/`、上传 Pages artifact 并部署。

工作流位于 `.github/workflows/deploy.yml`，使用当前主版本的 `actions/checkout@v7`、`actions/configure-pages@v6`、`actions/setup-node@v7`、`actions/upload-pages-artifact@v5` 与 `actions/deploy-pages@v5`。

首次启用时，在仓库 **Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**。之后每次推送到 `main` 都会自动发布。

## 修改站点信息

- 站点名称、简介、作者、仓库地址：修改 `src/config.ts`
- 首页主标题与引言：修改 `src/pages/index.astro`
- 导航：修改 `src/config.ts` 中的 `NAVIGATION`
- 关于页：修改 `src/pages/about.astro`
- 色彩和排版：修改 `src/styles/global.css`

## GitHub Pages 路径

当前仓库名是 `wjc.github.io`，但 GitHub 用户名是 `chenWULUQI`，因此它属于 Project Pages，不是用户主页仓库。默认配置为：

```js
site: 'https://chenwuluqi.github.io'
base: '/wjc.github.io'
```

预计访问地址为：<https://chenwuluqi.github.io/wjc.github.io/>

CSS、JavaScript、站内链接、RSS、Sitemap 与 OpenGraph 图片均按该 base 生成。

## 绑定独立域名

1. 在 DNS 服务商处配置 GitHub Pages 要求的记录。
2. 新建 `public/CNAME`，内容只写域名，例如 `blog.example.com`。
3. 把 `astro.config.mjs` 的 `site` 改为完整域名，把 `base` 改为 `/`。
4. 同步修改 `src/config.ts` 的 `origin` 和 `public/robots.txt` 中的 Sitemap 地址。
5. 在 GitHub Pages 设置中填写域名，并开启 HTTPS。

仓库原先没有 CNAME，因此本次迁移没有覆盖任何已有域名配置。

## 迁移说明

原仓库使用 Gmeek，并把文章备份在 `backup/`、生成站点放在 `docs/`。这些历史文件都保留了。`scripts/migrate-gmeek.mjs` 已把 13 篇旧文迁移到 Content Collections；如需重新迁移，可运行：

```bash
npm run migrate:gmeek
```

`src/content/posts/attention-and-kv-cache.md` 是用于验证 KaTeX、代码块、表格与脚注的示例技术文章，可以在正式内容准备好后删除或改写。


---
