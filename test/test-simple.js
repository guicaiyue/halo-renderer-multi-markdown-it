/**
 * Simple test for markdown-renderer-multi
 */

const MarkdownRenderer = require('../dist/index');

// Simple markdown test
const simpleMarkdown = `
# Hello World

This is a **bold** text and this is *italic*.

## Lists
- Item 1
- Item 2
- Item 3

## Code
\`\`\`javascript
console.log('Hello World');
\`\`\`

## Math
H~2~O and E = mc^2^

## Task List
- [x] Completed
- [ ] Todo

## Emoji
Hello :smile: World!
`;

console.log('=== Simple Markdown Test ===');
const html = MarkdownRenderer.render(simpleMarkdown);
console.log(html);

console.log('\n=== Test with Minimal Plugins ===');
const minimalHtml = MarkdownRenderer.render(simpleMarkdown, {
    plugins: [
        { name: 'markdown-it-emoji', enable: true },
        { name: 'markdown-it-sub', enable: true },
        { name: 'markdown-it-sup', enable: true },
        { name: 'markdown-it-task-checkbox', enable: true }
    ]
});
console.log(minimalHtml);