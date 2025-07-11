# markdown-renderer-xirizhi

A powerful independent Markdown renderer with 23+ plugins support, converted from hexo-renderer-multi-markdown-it.

This renderer uses [Markdown-it](https://github.com/markdown-it/markdown-it) as the rendering engine and includes many useful plugins for enhanced Markdown functionality.

## Features

- 🚀 **Independent**: No framework dependency, works with any Node.js project
- 🔌 **23+ Plugins**: Rich set of markdown-it plugins included
- ⚙️ **Configurable**: Flexible plugin and rendering options
- 🎯 **Easy to Use**: Simple API with sensible defaults
- 📝 **TypeScript Ready**: Can be easily extended with TypeScript definitions
- 🌐 **Multi-language**: Support for various languages including Japanese furigana
- 🎨 **Rich Content**: Math formulas, diagrams, charts, and interactive elements

## Installation

```bash
npm install markdown-renderer-xirizhi
```

## Quick Start

```javascript
const MarkdownRenderer = require('markdown-renderer-xirizhi');

// Basic usage
const html = MarkdownRenderer.render('# Hello World\n\nThis is **bold** text.');
console.log(html);
// Output: <h1>Hello World</h1>\n<p>This is <strong>bold</strong> text.</p>
```

## API Reference

### `render(markdown, options)`

Render markdown text to HTML.

**Parameters:**
- `markdown` (string): The markdown text to render
- `options` (object, optional): Configuration options

**Returns:** HTML string

**Example:**
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

Create a configured renderer instance with preset options.

**Parameters:**
- `defaultOptions` (object): Default configuration for this instance

**Returns:** Render function

**Example:**
```javascript
const myRenderer = MarkdownRenderer.createRenderer({
    render: { breaks: true },
    plugins: [{ name: 'markdown-it-emoji', enable: true }]
});

const html = myRenderer('Hello :smile:');
```

## Configuration Options

### Render Options

```javascript
{
    render: {
        html: true,         // Enable HTML tags in source
        xhtmlOut: false,    // Use '/' to close single tags (<br />)
        breaks: true,       // Convert '\n' in paragraphs into <br>
        linkify: true,      // Autoconvert URL-like text to links
        typographer: true,  // Enable some language-neutral replacement + quotes beautification
        quotes: '""''',     // Double + single quotes replacement pairs
        tab: ''             // Tab replacement
    }
}
```

### Plugin Configuration

```javascript
{
    plugins: [
        {
            name: 'plugin-name',     // Plugin name or path
            enable: true,            // Enable/disable plugin
            options: {}              // Plugin-specific options
        }
    ]
}
```

## Supported Plugins

### Text Formatting
- **markdown-it-sub**: `H~2~O` → H<sub>2</sub>O
- **markdown-it-sup**: `29^th^` → 29<sup>th</sup>
- **markdown-it-ins**: `++inserted++` → <ins>inserted</ins>
- **markdown-it-mark**: `==marked==` → <mark>marked</mark>
- **markdown-it-abbr**: Abbreviations support
- **markdown-it-attrs**: Add attributes to elements

### Lists and Structure
- **markdown-it-deflist**: Definition lists
- **markdown-it-task-checkbox**: Task lists with checkboxes
- **markdown-it-toc-and-anchor**: Table of contents and anchors
- **markdown-it-container**: Custom containers (info, warning, etc.)
- **markdown-it-multimd-table**: Enhanced tables with multiline support

### Interactive Content
- **markdown-it-emoji**: `:smile:` → 😄
- **markdown-it-footnote**: Footnotes support
- **markdown-it-spoiler**: `!!spoiler content!!` → hidden text

### Math and Science
- **markdown-it-katex**: LaTeX math rendering
  ```markdown
  $$E = mc^2$$
  ```

### Code and Syntax
- **markdown-it-prism**: Code syntax highlighting with Prism.js
  - Support for line marking: ` mark:1,3-4`
  - Command highlighting: ` command:{["$ ":1-2]["#":5-6]}`
  ```markdown
  ```javascript
  console.log('Hello World');
  ```
  ```

### Diagrams and Charts
- **markdown-it-mermaid**: Mermaid diagrams
- **markdown-it-graphviz**: Graphviz diagrams  
- **markdown-it-chart**: Frappe Charts

### Language-Specific
- **markdown-it-furigana**: Japanese furigana notation
  ```markdown
  {可愛い犬^か+わい・い・いぬ}
  ```
- **markdown-it-pangu**: Chinese typography optimization

### Utility
- **markdown-it-bracketed-spans**: Bracketed spans support
- **markdown-it-excerpt**: Content excerpts

## Examples

### Basic Markdown Features

```javascript
const markdown = `
# Heading 1
## Heading 2

**Bold text** and *italic text*

- List item 1
- List item 2

[Link](https://example.com)
`;

const html = MarkdownRenderer.render(markdown);
```

### Advanced Features

```javascript
const advancedMarkdown = `
# Advanced Features Demo

## Math
$$\\sum_{i=1}^{n} x_i = x_1 + x_2 + \\cdots + x_n$$

## Code with Highlighting
\`\`\`javascript
function fibonacci(n) {
    return n <= 1 ? n : fibonacci(n-1) + fibonacci(n-2);
}
\`\`\`

## Task List
- [x] Completed task
- [ ] Pending task

## Footnotes
This text has a footnote[^1].

[^1]: This is the footnote.

## Emoji
Hello :wave: World :earth_americas:

## Japanese Furigana
{東京^とうきょう}は{日本^にほん}の{首都^しゅと}です。

## Spoiler
!!This is hidden content!!
`;

const html = MarkdownRenderer.render(advancedMarkdown);
```

### Custom Plugin Configuration

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
                title: 'Click to reveal'
            }
        },
        {
            name: 'markdown-it-katex',
            enable: false  // Disable math rendering
        }
    ]
});
```

## Testing

The package includes comprehensive tests to verify functionality:

```bash
# Run simple functionality test
node test/test-simple.js

# Run comprehensive feature test
node test/test-all-features.js

# Run usage examples
node test/examples.js
```

## Error Handling

```javascript
try {
    const html = MarkdownRenderer.render(markdownText);
    console.log(html);
} catch (error) {
    console.error('Rendering failed:', error.message);
}
```

## Performance

Based on comprehensive testing:
- **Input**: ~15KB markdown document with all features
- **Render time**: ~600ms
- **Output**: ~40KB HTML
- **Memory**: Efficient plugin loading and caching

## Requirements

- Node.js 12.0.0 or higher
- Dependencies are automatically installed via npm

## External Dependencies for Full Functionality

Some plugins require external resources to be included in your HTML:

### Math Rendering (KaTeX)
```html
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/katex@0/dist/katex.min.css">
```

### Diagrams (Mermaid)
```html
<script src="//cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
```

### Charts (Frappe Charts)
```html
<script src="//cdn.jsdelivr.net/npm/frappe-charts/dist/frappe-charts.min.iife.js"></script>
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### For Developers

If you're interested in contributing to the codebase, please check out our [IMPROVEMENT_SUGGESTIONS.md](./IMPROVEMENT_SUGGESTIONS.md) for detailed technical improvement plans and development guidelines.

## License

MIT License - see LICENSE file for details.

## Credits

This project is converted from [hexo-renderer-multi-markdown-it](https://github.com/amehime/hexo-renderer-multi-markdown-it) to work as an independent package.

Special thanks to:
- [markdown-it](https://github.com/markdown-it/markdown-it) - The core rendering engine
- All the plugin authors who created the amazing extensions
- The original hexo-renderer-multi-markdown-it contributors

## Roadmap

### Planned Features
- **TypeScript Support**: Full TypeScript definitions for better development experience
- **Enhanced Error Handling**: More detailed error messages and recovery strategies
- **Performance Optimization**: Plugin lazy loading and render caching
- **Security Enhancements**: Input validation and sanitization
- **Modular Architecture**: Refactored plugin system for better maintainability

See [IMPROVEMENT_SUGGESTIONS.md](./IMPROVEMENT_SUGGESTIONS.md) for detailed technical improvement plans.

## Changelog

### v1.0.0
- Initial release as independent package
- Removed Hexo dependencies
- Added comprehensive test suite
- Improved error handling
- Enhanced documentation