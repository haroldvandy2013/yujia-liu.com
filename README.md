# yujia-liu.com — Astro 对照版

这是学术主页的独立 Astro 实验版本，便于和[原静态 HTML 版](https://github.com/haroldvandy2013/yujia-liu.com)比较代码结构。原仓库、正式域名和 Azure 不变；本仓库使用私有源码，没有设置新的线上托管或自定义域名。

保留首页 `/`、研究页 `/research/`、CV 页 `/cv/` 的内容、配色、布局、图片、字体与 CV PDF。项目只使用 Astro、Markdown、原生 HTML/CSS/JavaScript；没有其他 UI 框架、CMS、旧主题兼容层或第三方菜单脚本。

## 先看这几个文件

```text
src/
  content/
    home.md                首页介绍、肖像路径和 srcset
    research.md            全部研究题名、作者、摘要和论文链接
    cv.md                  CV 标题、PDF 路径、按钮文字、图片与图注
    contact.md             联系方式
  config.ts                站点名称、副标题、导航、标志图片
  components/
    SiteHeader.astro       三页共享的页头和移动导航
  layouts/
    SiteLayout.astro       共享 head、SEO、样式和页面外框
  pages/
    index.astro            首页布局
    research.astro         研究页布局
    cv.astro               CV 页布局
  lib/urls.ts              统一处理根路径和项目子路径
  styles/site.css          全部站点布局、配色、响应式与菜单样式
public/
  images/                  标志、肖像及响应式尺寸、家乡照片
  fonts/
    fonts.css              本地字体定义，包含全部语言子集
    eb-garamond/           标题及研究正文的字体文件
    work-sans/             正文字体文件
  documents/               CV PDF，页面使用这里的地址
  wp-content/uploads/2025/07/
    CV_Yujia-Liu_short.pdf  仅保留旧下载链接的兼容副本
licenses/                  字体许可证及历史外观来源归属
docs/original-assets.json  原静态快照的来源与校验记录，不是当前构建清单
astro.config.mjs           静态构建、正式域名和部署 base 配置
package.json               开发、检查、构建和预览命令
package-lock.json          可复现的依赖版本
```

## 与原版有什么不同

| 修改需求 | 原静态版 | Astro 版 |
| --- | --- | --- |
| 修改简介 | 在长篇 `index.html` 中找正文 | 编辑 `src/content/home.md` |
| 增加研究条目 | 编辑 `research/index.html` 中的 HTML | 编辑 `src/content/research.md` |
| 修改联系方式 | 编辑首页 HTML | 编辑 `src/content/contact.md` |
| 改姓名、副标题、导航 | 同步修改三个 HTML 页头 | 修改 `src/config.ts`，三页自动共用 |
| 更改公共页头结构 | 三页分别改 | 只改 `SiteHeader.astro` |
| 更新 PDF / 图片 | 替换资源并修改 HTML 链接 | 替换 `public/` 资源，修改 Markdown 顶部字段 |
| 调整外观 | 修改各页重复样式 | 修改独立的 `src/styles/site.css` |
| 发布文件 | 仓库 HTML 本身就是网站 | 构建输出到 `dist/`，源码与产物分开 |

Markdown 文件顶部 `---` 之间是页面字段（frontmatter）；下面是普通 Markdown 内容。例如研究条目保留题名、作者和完整摘要：

```md
#### [论文题名](https://example.org/paper)

*作者姓名*\
这里填写摘要。
```

作者行末的反斜杠 `\` 是 Markdown 换行，作者与摘要仍在同一段。研究摘要使用普通 Markdown 段落，并在 `site.css` 设置字体。原 “Revolving School Doors” 题名包含两个不同论文链接，新版保留了两者，不合并或丢失。

修改 CV 时，覆盖 `public/documents/CV_Yujia-Liu_short.pdf`；同时更新 `public/wp-content/uploads/2025/07/CV_Yujia-Liu_short.pdf` 的兼容副本，以免旧书签下载到过期版本。如果更改主文件位置，在 `src/content/cv.md` 更新 `pdf` 字段。这个旧路径只是 PDF 地址，不包含框架代码，也不被页面模板引用。

图片位于 `public/images/`，路径写在相应 Markdown 的 `photo` 字段中；首页更换肖像时同步更新 `photoSizes` 的文件和宽度。标志和导航在 `src/config.ts` 修改。路径从 `public/` 内开始写，不包含 `public/` 本身，模板会自动补上部署 base。

页头和三页布局使用语义化 HTML 与项目自己的类名。移动菜单在 `SiteHeader.astro` 中使用原生 `<dialog>` 和少量 JavaScript，支持打开、关闭、Esc、模态焦点管理及关闭后焦点恢复。禁用 JavaScript 时仍显示导航链接。

## 本地使用

使用 Node.js **>=22.23.4**（建议受支持的 LTS 版本）和 npm **>=9.6.5**。Astro 7.4.4、检查器 0.9.12 和与其兼容的 TypeScript 6.0.3 已固定，避免直接升级造成依赖不兼容。使用官方 `@astrojs/markdown-remark` 处理 Markdown，并保留原研究论文链接的“新标签页打开”行为。

```sh
npm ci
npm run dev -- --host 127.0.0.1
```

打开 `http://127.0.0.1:4321/`，修改 Markdown 后开发预览自动刷新。

检查并生成最终静态文件：

```sh
npm run check
npm run build
npm run preview -- --host 127.0.0.1
```

预览默认地址也是 `http://127.0.0.1:4321/`。`dist/` 是构建结果，不应直接编辑或提交；之后选择静态托管平台时，只需发布该目录。

测试项目子路径：

```sh
BASE_PATH=/yujia-liu.com-astro/ npm run build
BASE_PATH=/yujia-liu.com-astro/ npm run preview -- --host 127.0.0.1
```

打开 `http://127.0.0.1:4321/yujia-liu.com-astro/`。首页、内页导航、图片、字体、CSS 内部 URL 和 PDF 都兼容这个前缀。恢复根路径时重新运行不带 `BASE_PATH` 的构建和预览命令。

`SITE_URL` 仅控制 canonical 和 SEO 的正式域名，默认 `https://yujia-liu.com`；`BASE_PATH` 控制部署路径，默认 `/`，二者独立。不需要为了本地测试修改 DNS 或添加 `CNAME`。

## 隐私与托管

本仓库为 **private**，当前只有所有者 `haroldvandy2013`（管理员）有源码访问和修改权限，没有其他协作者。`package.json` 的 `"private": true` 还会防止误把本项目发布到 npm，但 GitHub 私有访问控制由仓库设置负责。

当前账户 GitHub Free 不支持私有仓库 GitHub Pages，因此**本版没有可承诺的 github.io 线上预览**，也没有开通付费服务。正式网站 `https://yujia-liu.com/` 仍由原 Azure 网站提供；后续托管可独立选择。本地开发服务器不需要公开暴露到网络。

公开网站交付给浏览器的 HTML、CSS、JavaScript 和图片仍可被访客查看；源码仓库私有化不等于隐藏这些公开网页内容。

## 资源与归属

20 个本地字体文件、7 张图片（含响应式尺寸）和 CV 保留原内容。旧主题样式、菜单脚本、未使用的 SVG 图标及空样式文件已删除；页面不再使用 `wp-*` 类名、CSS 变量或主题 API。原文中的论文和学者主页仍链接到对应第三方网站，不镜像其内容。

EB Garamond / Work Sans 字体使用 OFL-1.1，许可证保留在 `licenses/`。外观最初参考 WordPress / Automattic Blockbase、Marl（GPL-2.0-or-later），相应版权说明和 GPL 文本仍保留，不能为了清除关键词抹去归属；它们不作为运行时样式加载。`docs/original-assets.json` 仅记录原静态快照 `e7be650` 的来源与校验值，其中旧路径不代表当前资源结构。网站文字、照片与 CV 的权利不因第三方代码许可证改变。
