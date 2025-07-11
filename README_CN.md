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
const MarkdownRenderer = require('markdown-renderer-xirizhi');

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
        quotes: '""''',     // 双引号 + 单引号替换对
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
- **markdown-it-mermaid**：Mermaid 图表
- **markdown-it-graphviz**：Graphviz 图形
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

## 示例

### 基本 Markdown 功能

```javascript
const markdown = `
# 标题 1
## 标题 2

**粗体文本** 和 *斜体文本*

- 列表项 1
- 列表项 2

[链接](https://example.com)
`;

const html = MarkdownRenderer.render(markdown);
```

### 高级功能

```javascript
const advancedMarkdown = `
# 高级功能演示

## 数学
$$\\sum_{i=1}^{n} x_i = x_1 + x_2 + \\cdots + x_n$$

## 代码高亮
\`\`\`javascript
function fibonacci(n) {
    return n <= 1 ? n : fibonacci(n-1) + fibonacci(n-2);
}
\`\`\`

## 任务列表
- [x] 已完成任务
- [ ] 待完成任务

## 脚注
这段文字有一个脚注[^1]。

[^1]: 这是脚注。

## 表情符号
你好 :wave: 世界 :earth_americas:

## 日语假名
{東京^とうきょう}は{日本^にほん}の{首都^しゅと}です。

## 剧透
!!这是隐藏内容!!
`;

const html = MarkdownRenderer.render(advancedMarkdown);
```

### 自定义插件配置

```javascript
const html = MarkdownRenderer.render(markdown, {
    plugins: [
        {
            name: 'markdown-it-emoji',
            enable: true,
            options: {
                defs: {
                    ':custom:': '🎉'
                }
            }
        },
        {
            name: './lib/renderer/markdown-it-spoiler',
            enable: true,
            options: {
                title: '点击显示'
            }
        },
        {
            name: 'markdown-it-katex',
            enable: false  // 禁用数学渲染
        }
    ]
});
```

## 测试

该包包含全面的测试来验证功能：

```bash
# 运行简单功能测试
node test/test-simple.js

# 运行综合功能测试
node test/test-all-features.js

# 运行使用示例
node test/examples.js
```

## 错误处理

```javascript
try {
    const html = MarkdownRenderer.render(markdownText);
    console.log(html);
} catch (error) {
    console.error('渲染失败：', error.message);
}
```

## 性能

基于综合测试：
- **输入**：约 15KB 包含所有功能的 markdown 文档
- **渲染时间**：约 600ms
- **输出**：约 40KB HTML
- **内存**：高效的插件加载和缓存

## 系统要求

- Node.js 12.0.0 或更高版本
- 依赖项通过 npm 自动安装

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

## 贡献

欢迎贡献！请随时提交 Pull Request。

1. Fork 仓库
2. 创建您的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

### 开发者指南

如果您有意为代码库做贡献，请查看我们的 [IMPROVEMENT_SUGGESTIONS.md](./IMPROVEMENT_SUGGESTIONS.md) 了解详细的技术改进计划和开发指南。

## 许可证

MIT 许可证 - 详见 LICENSE 文件。

## 致谢

该项目由 [hexo-renderer-multi-markdown-it](https://github.com/amehime/hexo-renderer-multi-markdown-it) 转换而来，作为独立包使用。

特别感谢：
- [markdown-it](https://github.com/markdown-it/markdown-it) - 核心渲染引擎
- 所有创建了出色扩展的插件作者
- 原始 hexo-renderer-multi-markdown-it 贡献者

## 路线图

### 计划功能
- **TypeScript 支持**：完整的 TypeScript 定义，提供更好的开发体验
- **增强错误处理**：更详细的错误消息和恢复策略
- **性能优化**：插件懒加载和渲染缓存
- **安全增强**：输入验证和清理
- **模块化架构**：重构插件系统以提高可维护性

查看 [IMPROVEMENT_SUGGESTIONS.md](./IMPROVEMENT_SUGGESTIONS.md) 了解详细的技术改进计划。

## 更新日志

### v1.0.0
- 作为独立包的初始发布
- 移除 Hexo 依赖
- 添加综合测试套件
- 改进错误处理
- 增强文档