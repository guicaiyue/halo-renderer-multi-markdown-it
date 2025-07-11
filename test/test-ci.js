/**
 * CI/CD 自动化测试脚本
 * 用于在构建和发布前进行完整的自动化测试
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始 CI/CD 自动化测试');
console.log('=' .repeat(50));

const testResults = {
    build: false,
    moduleLoading: false,
    basicFunctionality: false,
    allFeatures: false,
    packageIntegrity: false
};

const errors = [];

// 1. 构建测试
console.log('\n📦 1. 构建测试');
try {
    console.log('执行构建命令...');
    execSync('npm run build', { 
        cwd: path.join(__dirname, '..'),
        stdio: 'pipe'
    });
    
    // 检查构建输出
    const distPath = path.join(__dirname, '..', 'dist');
    const requiredFiles = [
        'index.js',
        'index.d.ts',
        'lib/renderer/index.js',
        'lib/renderer/markdown-it-container/index.js',
        'lib/renderer/markdown-it-katex/index.js',
        'lib/renderer/markdown-it-mermaid/index.js',
        'lib/renderer/markdown-it-graphviz/index.js'
    ];
    
    let missingFiles = [];
    for (const file of requiredFiles) {
        const filePath = path.join(distPath, file);
        if (!fs.existsSync(filePath)) {
            missingFiles.push(file);
        }
    }
    
    if (missingFiles.length > 0) {
        throw new Error(`构建缺少文件: ${missingFiles.join(', ')}`);
    }
    
    console.log('✅ 构建测试通过');
    testResults.build = true;
} catch (error) {
    console.error('❌ 构建测试失败:', error.message);
    errors.push(`构建失败: ${error.message}`);
}

// 2. 模块加载测试
console.log('\n🔌 2. 模块加载测试');
try {
    console.log('运行模块加载测试...');
    execSync('node test/test-module-loading.js', { 
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit'
    });
    console.log('✅ 模块加载测试通过');
    testResults.moduleLoading = true;
} catch (error) {
    console.error('❌ 模块加载测试失败');
    errors.push('模块加载测试失败');
}

// 3. 基础功能测试
console.log('\n⚡ 3. 基础功能测试');
try {
    console.log('运行基础功能测试...');
    execSync('node test/test-simple.js', { 
        cwd: path.join(__dirname, '..'),
        stdio: 'pipe'
    });
    console.log('✅ 基础功能测试通过');
    testResults.basicFunctionality = true;
} catch (error) {
    console.error('❌ 基础功能测试失败');
    errors.push('基础功能测试失败');
}

// 4. 完整功能测试
console.log('\n🎯 4. 完整功能测试');
try {
    console.log('运行完整功能测试...');
    execSync('node test/test-all-features.js', { 
        cwd: path.join(__dirname, '..'),
        stdio: 'pipe'
    });
    console.log('✅ 完整功能测试通过');
    testResults.allFeatures = true;
} catch (error) {
    console.error('❌ 完整功能测试失败');
    errors.push('完整功能测试失败');
}

// 5. 包完整性测试
console.log('\n📋 5. 包完整性测试');
try {
    console.log('检查包配置...');
    
    // 检查 package.json
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
    
    const requiredFields = ['name', 'version', 'description', 'main', 'types', 'files'];
    const missingFields = requiredFields.filter(field => !packageJson[field]);
    
    if (missingFields.length > 0) {
        throw new Error(`package.json 缺少字段: ${missingFields.join(', ')}`);
    }
    
    // 检查主入口文件
    const mainFile = path.join(__dirname, '..', packageJson.main);
    if (!fs.existsSync(mainFile)) {
        throw new Error(`主入口文件不存在: ${packageJson.main}`);
    }
    
    // 检查类型定义文件
    const typesFile = path.join(__dirname, '..', packageJson.types);
    if (!fs.existsSync(typesFile)) {
        throw new Error(`类型定义文件不存在: ${packageJson.types}`);
    }
    
    // 模拟 npm pack 检查
    console.log('模拟包打包...');
    const packOutput = execSync('npm pack --dry-run', { 
        cwd: path.join(__dirname, '..'),
        encoding: 'utf8'
    });
    
    // 检查包大小
    const sizeMatch = packOutput.match(/package size:\s*([\d.]+\s*[KMGT]?B)/i);
    if (sizeMatch) {
        console.log(`包大小: ${sizeMatch[1]}`);
        
        // 警告如果包太大
        const sizeStr = sizeMatch[1].toLowerCase();
        if (sizeStr.includes('mb') && parseFloat(sizeStr) > 5) {
            console.log('⚠️  包大小超过 5MB，建议优化');
        }
    }
    
    console.log('✅ 包完整性测试通过');
    testResults.packageIntegrity = true;
} catch (error) {
    console.error('❌ 包完整性测试失败:', error.message);
    errors.push(`包完整性测试失败: ${error.message}`);
}

// 测试总结
console.log('\n' + '=' .repeat(50));
console.log('📊 测试总结');
console.log('=' .repeat(50));

const testNames = {
    build: '构建测试',
    moduleLoading: '模块加载测试',
    basicFunctionality: '基础功能测试',
    allFeatures: '完整功能测试',
    packageIntegrity: '包完整性测试'
};

let passedTests = 0;
const totalTests = Object.keys(testResults).length;

for (const [key, passed] of Object.entries(testResults)) {
    const status = passed ? '✅ 通过' : '❌ 失败';
    console.log(`${testNames[key]}: ${status}`);
    if (passed) passedTests++;
}

console.log(`\n总体结果: ${passedTests}/${totalTests} 测试通过`);

if (errors.length > 0) {
    console.log('\n❌ 发现的问题:');
    errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
    });
}

// 生成测试报告
const report = {
    timestamp: new Date().toISOString(),
    results: testResults,
    errors: errors,
    summary: {
        passed: passedTests,
        total: totalTests,
        success: passedTests === totalTests
    }
};

fs.writeFileSync(
    path.join(__dirname, 'test-report.json'),
    JSON.stringify(report, null, 2)
);

console.log('\n📄 测试报告已保存到 test/test-report.json');

if (passedTests === totalTests) {
    console.log('\n🎉 所有测试通过！项目可以安全发布。');
    process.exit(0);
} else {
    console.log('\n💥 存在测试失败，请修复后再发布。');
    process.exit(1);
}