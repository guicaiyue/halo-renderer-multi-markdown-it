# markdown-renderer-xirizhi

一个功能强大的独立 Markdown 渲染器，支持 23+ 插件，由 hexo-renderer-multi-markdown-it 转换而来。

该渲染器使用 [Markdown-it](https://github.com/markdown-it/markdown-it) 作为渲染引擎，并包含许多有用的插件来增强 Markdown 功能。

## 特性

- 🚀 **独立性**：无框架依赖，适用于任何 Node.js 项目
- 🔌 **23+ 插件**：包含丰富的 markdown-it 插件集
- ⚙️ **可配置**：灵活的插件和渲染选项
- 🎯 **易于使用**：简单的 API 和合理的默认设置
- 📝 **TypeScript 就绪**：可轻松扩展 TypeScript 定义
- 🌐 **多语言**：支持多种语言，包括日语假名
- 🎨 **丰富内容**：数学公式、图表、图形和交互元素

## 安装

```bash
npm install markdown-renderer-xirizhi
```

## 快速开始

```javascript
import * as MarkdownRenderer from 'markdown-renderer-xirizhi';

// 基本用法
const html = MarkdownRenderer.render('# 你好世界\n\n这是 **粗体** 文本。');
console.log(html);
// 输出: <h1>你好世界</h1>\n<p>这是 <strong>粗体</strong> 文本。</p>
```

## API 参考

### `render(markdown, options)`

将 markdown 文本渲染为 HTML。

**参数：**
- `markdown` (string)：要渲染的 markdown 文本
- `options` (object, 可选)：配置选项

**返回值：** HTML 字符串

**示例：**
```javascript
const html = MarkdownRenderer.render(markdownText, {
    render: {
        html: true,
        breaks: true,
        linkify: true
    },
    plugins: [
        {
            name: 'markdown-it-emoji',
            enable: true,
            options: {}
        }
    ]
});
```

### `createRenderer(defaultOptions)`

创建一个带有预设选项的配置渲染器实例。

**参数：**
- `defaultOptions` (object)：此实例的默认配置

**返回值：** 渲染函数

**示例：**
```javascript
const myRenderer = MarkdownRenderer.createRenderer({
    render: { breaks: true },
    plugins: [{ name: 'markdown-it-emoji', enable: true }]
});

const html = myRenderer('你好 :smile:');
```

## 配置选项

### 渲染选项

```javascript
{
    render: {
        html: true,         // 启用源码中的 HTML 标签
        xhtmlOut: false,    // 使用 '/' 关闭单标签 (<br />)
        breaks: true,       // 将段落中的 '\n' 转换为 <br>
        linkify: true,      // 自动转换类似 URL 的文本为链接
        typographer: true,  // 启用一些语言中性的替换 + 引号美化
        quotes: '""\'\'',     // 双引号 + 单引号替换对
        tab: ''             // Tab 替换
    }
}
```

### 插件配置

```javascript
{
    plugins: [
        {
            name: 'plugin-name',     // 插件名称或路径
            enable: true,            // 启用/禁用插件
            options: {}              // 插件特定选项
        }
    ]
}
```

## 支持的插件

### 文本格式化
- **markdown-it-sub**：`H~2~O` → H<sub>2</sub>O
- **markdown-it-sup**：`29^th^` → 29<sup>th</sup>
- **markdown-it-ins**：`++插入++` → <ins>插入</ins>
- **markdown-it-mark**：`==标记==` → <mark>标记</mark>
- **markdown-it-abbr**：缩写支持
- **markdown-it-attrs**：为元素添加属性

### 列表和结构
- **markdown-it-deflist**：定义列表
- **markdown-it-task-checkbox**：带复选框的任务列表
- **markdown-it-toc-and-anchor**：目录和锚点
- **markdown-it-container**：自定义容器（信息、警告等）
- **markdown-it-multimd-table**：支持多行的增强表格

### 交互内容
- **markdown-it-emoji**：`:smile:` → 😄
- **markdown-it-footnote**：脚注支持
- **markdown-it-spoiler**：`!!剧透内容!!` → 隐藏文本

### 数学和科学
- **markdown-it-katex**：LaTeX 数学渲染
  ```markdown
  $$E = mc^2$$
  ```

### 代码和语法
- **markdown-it-prism**：使用 Prism.js 的代码语法高亮
  - 支持行标记：` mark:1,3-4`
  - 命令高亮：` command:{["$ ":1-2]["#":5-6]}`
  ```markdown
  ```javascript
  console.log('你好世界');
  ```
  ```

### 图表和图形

- **markdown-it-chart**：Frappe 图表

### 语言特定
- **markdown-it-furigana**：日语假名标注
  ```markdown
  {可愛い犬^か+わい・い・いぬ}
  ```
- **markdown-it-pangu**：中文排版优化

### 实用工具
- **markdown-it-bracketed-spans**：括号跨度支持
- **markdown-it-excerpt**：内容摘录

## 完整功能的外部依赖

某些插件需要在您的 HTML 中包含外部资源：

### 数学渲染 (KaTeX)
```html
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/katex@0/dist/katex.min.css">
```

### 图表 (Mermaid)
```html
<script src="//cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
```

### 图形 (Frappe Charts)
```html
<script src="//cdn.jsdelivr.net/npm/frappe-charts/dist/frappe-charts.min.iife.js"></script>
```

## 开发与贡献

### TypeScript 迁移
本项目已从 JavaScript 迁移到 TypeScript，以提供更好的类型安全和开发体验。编译后的包对 JavaScript 项目完全兼容，无需额外配置。

- **JS 项目使用**: `import { render } from 'markdown-renderer-xirizhi';`
- **TS 项目使用**: `import { render } from 'markdown-renderer-xirizhi';` (自动获得类型支持)

### 开发流程
1.  **安装依赖**: `npm install`
2.  **编译**: `npm run build`
3.  **测试**: `npm test` (基础测试), `npm run test-all` (完整测试)

### 自动化发布
项目采用基于版本号的自动发布流程。开发者只需在本地通过 `npm version <patch|minor|major>` 更新版本号并推送到 `main` 分支，GitHub Actions 将会自动完成测试、发布 NPM 包和创建 GitHub Release 的全部流程。

**发布步骤:**
1.  更新版本: `npm version patch`
2.  提交推送: `git push origin main --tags`

### 贡献
欢迎任何形式的贡献！请 Fork 仓库并提交 Pull Request。

## 许可证

MIT 许可证 - 详见 LICENSE 文件。

## 致谢

该项目由 [hexo-renderer-multi-markdown-it](https://github.com/amehime/hexo-renderer-multi-markdown-it) 转换而来，作为独立包使用。

特别感谢：
- [markdown-it](https://github.com/markdown-it/markdown-it) - 核心渲染引擎
- 所有创建了出色扩展的插件作者
- 原始 hexo-renderer-multi-markdown-it 贡献者