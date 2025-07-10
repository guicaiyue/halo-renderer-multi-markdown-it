// 直接使用源文件进行测试
const MarkdownIt = require('markdown-it');
const markdownItAttrs = require('markdown-it-attrs');

// 创建简单的渲染器只测试attrs插件
const md = new MarkdownIt();
md.use(markdownItAttrs);

// 测试属性扩展
const markdown1 = `# 标题{.my-class}

这是一个段落{.custom-class #my-id data-value="test"}。

[链接](https://example.com){.external target="_blank"}

*强调文本*{.highlight}`;

const markdown2 = `段落测试{.test-class}`;

const markdown3 = `段落测试 {.test-class}`;

const markdown4 = `
段落测试{.test-class}
`;

const markdown5 = `段落测试{.test-class}
另一行文本`;

console.log('=== 测试 markdown-it-attrs 插件 ===');

console.log('\n测试1 - 完整文档:');
console.log('输入:', markdown1);
console.log('输出:', md.render(markdown1));

console.log('\n测试2 - 简单段落(无换行):');
console.log('输入:', markdown2);
console.log('输出:', md.render(markdown2));

console.log('\n测试3 - 段落有空格:');
console.log('输入:', markdown3);
console.log('输出:', md.render(markdown3));

console.log('\n测试4 - 段落有前后换行:');
console.log('输入:', markdown4);
console.log('输出:', md.render(markdown4));

console.log('\n测试5 - 段落后有其他内容:');
console.log('输入:', markdown5);
console.log('输出:', md.render(markdown5));