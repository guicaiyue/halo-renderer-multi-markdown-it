/**
 * 测试所有功能的脚本
 * 使用 test-all-features.md 文件测试渲染器的完整功能
 */

const fs = require('fs');
const path = require('path');
const MarkdownRenderer = require('../dist/index');

// 读取测试文档
const testMarkdownPath = path.join(__dirname, 'test-all-features.md');
const testMarkdown = fs.readFileSync(testMarkdownPath, 'utf8');

console.log('=== 开始测试所有功能 ===');
console.log(`测试文档大小: ${testMarkdown.length} 字符`);
console.log('渲染中...');

try {
    // 使用默认配置渲染
    const startTime = Date.now();
    const html = MarkdownRenderer.render(testMarkdown);
    const endTime = Date.now();
    
    console.log(`渲染完成! 耗时: ${endTime - startTime}ms`);
    console.log(`输出HTML大小: ${html.length} 字符`);
    
    // 保存渲染结果到文件
    const outputPath = path.join(__dirname, 'test-all-features-output.html');
    const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Markdown Renderer Multi - 功能测试</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism.min.css">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
        }
        .spoiler {
            background-color: #000;
            color: #000;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .spoiler:hover {
            background-color: transparent;
        }
        .warning {
            border-left: 4px solid #ff9800;
            background-color: #fff3cd;
            padding: 10px;
            margin: 10px 0;
        }
        .info {
            border-left: 4px solid #2196f3;
            background-color: #d1ecf1;
            padding: 10px;
            margin: 10px 0;
        }
        .tip {
            border-left: 4px solid #4caf50;
            background-color: #d4edda;
            padding: 10px;
            margin: 10px 0;
        }
        .danger {
            border-left: 4px solid #f44336;
            background-color: #f8d7da;
            padding: 10px;
            margin: 10px 0;
        }
        .highlight {
            background-color: #ffeb3b;
            padding: 2px 4px;
            border-radius: 3px;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 10px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        code {
            background-color: #f4f4f4;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: 'Courier New', Courier, monospace;
        }
        pre {
            background-color: #f4f4f4;
            padding: 10px;
            border-radius: 5px;
            overflow-x: auto;
        }
        blockquote {
            border-left: 4px solid #ccc;
            margin: 0;
            padding-left: 20px;
            color: #666;
        }
        .task-list-item {
            list-style-type: none;
        }
        .task-list-item input {
            margin-right: 8px;
        }
    </style>
</head>
<body>
${html}
</body>
</html>`;
    
    fs.writeFileSync(outputPath, fullHtml, 'utf8');
    console.log(`完整HTML已保存到: ${outputPath}`);
    
    // 显示渲染结果的前500个字符
    console.log('\n=== 渲染结果预览 ===');
    console.log(html.substring(0, 500) + '...');
    
    // 统计一些信息
    const headingCount = (html.match(/<h[1-6]>/g) || []).length;
    const paragraphCount = (html.match(/<p>/g) || []).length;
    const codeBlockCount = (html.match(/<pre>/g) || []).length;
    const tableCount = (html.match(/<table>/g) || []).length;
    const listCount = (html.match(/<ul>|<ol>/g) || []).length;
    
    console.log('\n=== 渲染统计 ===');
    console.log(`标题数量: ${headingCount}`);
    console.log(`段落数量: ${paragraphCount}`);
    console.log(`代码块数量: ${codeBlockCount}`);
    console.log(`表格数量: ${tableCount}`);
    console.log(`列表数量: ${listCount}`);
    
    console.log('\n=== 测试完成 ===');
    console.log('所有功能测试成功! 🎉');
    
} catch (error) {
    console.error('渲染过程中出现错误:');
    console.error(error.message);
    console.error(error.stack);
    process.exit(1);
}