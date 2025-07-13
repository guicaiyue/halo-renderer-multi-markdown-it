/**
 * CI/CD 自动化测试脚本
 * 用于在构建和发布前进行完整的自动化测试
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Cleaning dist directory...');
fs.rmSync(path.join(__dirname, '..', 'dist'), { recursive: true, force: true });
console.log('Building project...');
execSync('npm run build', { stdio: 'inherit' });
console.log('Build complete.');

console.log('🚀 开始 CI/CD 自动化测试');
console.log('=' .repeat(50));

console.log('\n🎯 开始统一功能测试');

try {
    console.log('运行完整功能测试 (test-all-features.js)...');
    execSync('node test/test-all-features.js', { 
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit' // 使用 inherit 以便实时看到测试输出
    });
    
    console.log('\n运行图表插件测试 (test-chart-plugin.js)...');
    execSync('node test/single/test-chart-plugin.js', {
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit'
    });
    
    console.log('\n' + '=' .repeat(50));
    console.log('✅ 统一功能测试通过');
    console.log('🎉 所有测试通过！项目可以安全发布。');
    process.exit(0);
} catch (error) {
    console.error('\n❌ 统一功能测试失败');
    // The error from the child process is already piped to stderr by `stdio: 'inherit'`
    console.log('\n' + '=' .repeat(50));
    console.log('💥 存在测试失败，请修复后再发布。');
    process.exit(1);
}