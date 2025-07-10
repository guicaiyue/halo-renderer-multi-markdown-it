/**
 * Example usage of markdown-renderer-multi
 */

const MarkdownRenderer = require('../dist/index');

// Example markdown content
const markdownText = `
# Hello World

This is a **bold** text and this is *italic*.

## Features Demo

### Subscript and Superscript
- Water formula: H~2~O
- Math: x^2^ + y^2^ = z^2^

### Task Lists
- [x] Completed task
- [ ] Pending task

### Emoji
Hello :smile: World :heart:

### Code with Syntax Highlighting
\`\`\`javascript
function hello() {
    console.log('Hello World!');
}
\`\`\`

### Math (KaTeX)
$$E = mc^2$$

### Furigana (Japanese)
{可愛い犬^か+わい・い・いぬ}

### Spoiler
!!This is a spoiler!!

### Tables
| Name | Age | City |
|------|-----|------|
| John | 25  | NYC  |
| Jane | 30  | LA   |

### Footnotes
This is a text with footnote[^1].

[^1]: This is the footnote content.
`;

// Basic usage
console.log('=== Basic Usage ===');
const basicHtml = MarkdownRenderer.render(markdownText);
console.log(basicHtml.substring(0, 200) + '...');

// Usage with custom configuration
console.log('\n=== Custom Configuration ===');
const customHtml = MarkdownRenderer.render(markdownText, {
    render: {
        html: true,
        breaks: false,
        linkify: false
    },
    plugins: [
        {
            name: 'markdown-it-emoji',
            enable: true,
            options: {}
        },
        {
            name: './lib/renderer/markdown-it-furigana',
            enable: true,
            options: {
                fallbackParens: '()'
            }
        },
        {
            name: './lib/renderer/markdown-it-spoiler',
            enable: true,
            options: {
                title: 'You know too much'
            }
        }
    ]
});
console.log(customHtml.substring(0, 200) + '...');

// Create a configured renderer instance
console.log('\n=== Configured Renderer Instance ===');
const myRenderer = MarkdownRenderer.createRenderer({
    render: {
        breaks: true,
        linkify: true
    },
    plugins: [
        {
            name: 'markdown-it-emoji',
            enable: true
        },
        {
            name: 'markdown-it-task-checkbox',
            enable: true
        }
    ]
});

const instanceHtml = myRenderer(markdownText);
console.log(instanceHtml.substring(0, 200) + '...');

// Disable specific plugins
console.log('\n=== Disabled Plugins ===');
const minimalHtml = MarkdownRenderer.render(markdownText, {
    plugins: [
        {
            name: 'markdown-it-emoji',
            enable: false
        },
        {
            name: './lib/renderer/markdown-it-furigana',
            enable: false
        }
    ]
});
console.log(minimalHtml.substring(0, 200) + '...');

// Error handling example
console.log('\n=== Error Handling ===');
try {
    MarkdownRenderer.render(null);
} catch (error) {
    console.log('Caught error:', error.message);
}

try {
    MarkdownRenderer.render(123);
} catch (error) {
    console.log('Caught error:', error.message);
}

console.log('\n=== Available Default Plugins ===');
console.log(MarkdownRenderer.default_plugins);

console.log('\n=== Default Configuration ===');
console.log(JSON.stringify(MarkdownRenderer.default_config, null, 2));