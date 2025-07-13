/**
 * 统一功能测试脚本
 * 包含了模块加载、插件功能及完整渲染测试
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import MarkdownIt from 'markdown-it';
import attrs from 'markdown-it-attrs';
import container from 'markdown-it-container';
import * as MarkdownRenderer from '../dist/index.js';

console.log('=== 开始统一功能测试 ===');

// 1. 模块加载测试
console.log('\n--- 模块加载测试 ---');
try {
    console.log('✅ 主模块加载成功');
    if (typeof MarkdownRenderer.render !== 'function' || typeof MarkdownRenderer.createRenderer !== 'function') {
        throw new Error('导出的函数不完整');
    }
    console.log('✅ 导出函数检查通过');
} catch (error) {
    console.error('❌ 主模块加载失败:', error.message);
    process.exit(1);
}

// 2. 插件加载与功能测试
console.log('\n--- 插件加载与功能测试 ---');

function testAttrsPlugin() {
    console.log('  -> 测试 markdown-it-attrs 插件...');
    const md = new MarkdownIt().use(attrs);
    const input = `段落{.red}`;
    const output = md.render(input);
    if (output.includes('class="red"')) {
        console.log('✅ markdown-it-attrs 功能正常');
    } else {
        console.error('❌ markdown-it-attrs 功能异常');
        process.exit(1);
    }
}

function testContainerPlugin() {
    console.log('  -> 测试 markdown-it-container 插件...');
    const md = new MarkdownIt().use(container, 'warning');
    const input = `::: warning\n内容\n:::`;
    const output = md.render(input);
    if (output.includes('<div class="warning">')) {
        console.log('✅ markdown-it-container 功能正常');
    } else {
        console.error('❌ markdown-it-container 功能异常');
        process.exit(1);
    }
}

testAttrsPlugin();
testContainerPlugin();

// 3. 完整渲染测试
console.log('\n--- 完整渲染测试 ---');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取测试文档
const testMarkdownPath = path.join(__dirname, 'test-all-features.md');
const testMarkdown = fs.readFileSync(testMarkdownPath, 'utf8');

console.log(`测试文档大小: ${testMarkdown.length} 字符`);
console.log('渲染中...');

(async () => {
  try {
    // 使用默认配置渲染
    const startTime = Date.now();
    const html = await MarkdownRenderer.render(testMarkdown);
    const endTime = Date.now();
    
    console.log(`渲染完成! 耗时: ${endTime - startTime}ms`);
    console.log(`输出HTML大小: ${html.length} 字符`);
    
    // 保存渲染结果到文件
    const outputPath = path.join(__dirname, 'test-all-features-output.html');
    const fullHtml = `<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Markdown Renderer Multi - 功能测试</title>\n    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css">\n    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism.min.css">\n    <style>\n        body {\n            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;\n            line-height: 1.6;\n            max-width: 1200px;\n            margin: 0 auto;\n            padding: 20px;\n            background-color: #ffffff;\n        }\n        .spoiler {\n            background-color: #000;\n            color: #000;\n            cursor: pointer;\n            transition: all 0.3s ease;\n        }\n        .spoiler:hover {\n            background-color: transparent;\n        }\n        .warning {\n            border-left: 4px solid #ff9800;\n            background-color: #fff3cd;\n            padding: 10px;\n            margin: 10px 0;\n        }\n        .info {\n            border-left: 4px solid #2196f3;\n            background-color: #d1ecf1;\n            padding: 10px;\n            margin: 10px 0;\n        }\n        .tip {\n            border-left: 4px solid #4caf50;\n            background-color: #d4edda;\n            padding: 10px;\n            margin: 10px 0;\n        }\n        .danger {\n            border-left: 4px solid #f44336;\n            background-color: #f8d7da;\n            padding: 10px;\n            margin: 10px 0;\n        }\n        .highlight {\n            background-color: #ffeb3b;\n            padding: 2px 4px;\n            border-radius: 3px;\n        }\n        table {\n            border-collapse: collapse;\n            width: 100%;\n            margin: 10px 0;\n        }\n        th, td {\n            border: 1px solid #ddd;\n            padding: 8px;\n            text-align: left;\n        }\n        th {\n            background-color: #f2f2f2;\n        }\n        code {\n            background-color: #f4f4f4;\n            padding: 2px 4px;\n            border-radius: 3px;\n            font-family: 'Courier New', Courier, monospace;\n        }\n        pre {\n            background-color: #f4f4f4;\n            padding: 10px;\n            border-radius: 5px;\n            overflow-x: auto;\n        }\n        blockquote {\n            border-left: 4px solid #ccc;\n            margin: 0;\n            padding-left: 20px;\n            color: #666;\n        }\n        .task-list-item {\n            list-style-type: none;\n        }\n        .task-list-item input {\n            margin-right: 8px;\n        }\n    </style>\n</head>\n<body>\n${html}\n</body>\n</html>`;
    
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
} catch (error) {
    console.error('❌ 渲染测试失败:', error);
    process.exit(1);
}
})();