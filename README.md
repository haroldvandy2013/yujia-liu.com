# yujia-liu.com — Astro 对照版

这是学术主页的独立 Astro 实验版本，便于和[原静态 HTML 版](https://github.com/haroldvandy2013/yujia-liu.com)比较代码结构。原仓库、正式域名和 Azure 不变；本仓库使用私有源码，没有设置新的线上托管或自定义域名。

保留首页 `/`、研究页 `/research/`、CV 页 `/cv/` 的内容、原主题外观、图片、字体与 CV PDF。来源是已验证的原静态版快照 `e7be650`，原 37 项资源及来源校验记录保留在 `public/` 和 `migration-manifest.json`。

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
  styles/site.css          站点自己的布局和样式调整
public/
  wp-content/              原图片、PDF、字体和主题资源
  wp-includes/             原导航样式和移动菜单脚本
  styles/
    fonts.css              原字体定义，包含全部语言子集
    original-theme.css     去重后的原站主题样式，只引入一次
licenses/                  上游版权、许可证和导航源码
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
| 调整外观 | 修改各页重复样式 | 主要改 `src/styles/site.css` |
| 发布文件 | 仓库 HTML 本身就是网站 | 构建输出到 `dist/`，源码与产物分开 |

Markdown 文件顶部 `---` 之间是页面字段（frontmatter）；下面是普通 Markdown 内容。例如研究条目保留题名、作者和完整摘要：

```md
#### [论文题名](https://example.org/paper)

*作者姓名*\
这里填写摘要。
```

作者行末的反斜杠 `\` 是 Markdown 换行，作者与摘要仍在同一段。原研究页的摘要使用 h5 字体样式，新版用普通 Markdown 段落，并在 `site.css` 保留其视觉效果。原 “Revolving School Doors” 题名包含两个不同论文链接，新版保留了两者，不合并或丢失。

修改 CV 时，可以覆盖 `public/wp-content/uploads/2025/07/CV_Yujia-Liu_short.pdf` 而无需改链接；如果更改位置，在 `src/content/cv.md` 更新 `pdf` 字段。图片路径也写在相应 Markdown 的 `photo` 字段中；首页更换肖像时同步更新 `photoSizes` 的文件和宽度。路径从 `public/` 内开始写，不包含 `public/` 本身，模板会自动补上部署 base。

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

## 保留的第三方资源

为了先比较代码组织而不重新设计网站，本版沿用原 Blockbase / Marl 的渲染样式和 WordPress 移动导航脚本。这些只是静态资源，运行时不需要 WordPress、PHP、数据库、账户管理或 Azure。原文中的论文和学者主页仍链接到对应第三方网站，不镜像其内容。

WordPress / Automattic 主题为 GPL-2.0-or-later，EB Garamond / Work Sans 字体为 OFL-1.1，移动菜单包含 MIT 许可的 MicroModal。许可证、版权说明及未压缩导航源码保留在 `licenses/`。原资源目录和 `original-theme.css` 用作兼容层，日常修改优先放在 `src/`；网站文字、照片与 CV 不因第三方代码许可证改变权利归属。
Astro comparison version of the yujia-liu.com academic website
