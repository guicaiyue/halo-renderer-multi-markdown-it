const MarkdownIt = require('markdown-it');
const markdownItContainer = require('markdown-it-container');

// 创建简单的渲染器测试容器插件
const md = new MarkdownIt();

// 手动配置容器插件
md.use(markdownItContainer, 'warning', {
    validate: function(params) {
        return params.trim().match(/^warning(\s+.*)?$/);
    },
    
    render: function (tokens, idx) {
        const m = tokens[idx].info.trim().match(/^warning(\s+(.*))?$/);
        
        if (tokens[idx].nesting === 1) {
            // opening tag
            const title = m && m[2] ? m[2].trim() : 'warning';
            return `<div class="container warning"><div class="container-title">${title}</div><div class="container-content">\n`;
        } else {
            // closing tag
            return '</div></div>\n';
        }
    }
});

// 测试容器
const markdown = `
::: warning 警告
这是一个警告容器的内容。
:::

::: warning
这是一个没有标题的警告容器。
:::
`;

console.log('=== 测试 markdown-it-container 插件 ===');
console.log('输入:');
console.log(markdown);
console.log('\n输出:');
const html = md.render(markdown);
console.log(html);