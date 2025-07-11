# 开发指南

## 自动化测试系统

本项目配备了完善的自动化测试系统，确保代码质量和功能稳定性。

### 测试脚本

#### 1. 基础测试
```bash
npm test
```
运行基础功能测试，验证核心渲染功能。

#### 2. 完整功能测试
```bash
npm run test-all
```
测试所有 Markdown 功能，包括高级插件。

#### 3. 模块加载测试
```bash
npm run test-modules
```
验证所有插件是否能正确加载，检测依赖问题。

#### 4. CI/CD 完整测试
```bash
npm run test-ci
```
运行完整的 CI/CD 测试流程，包括：
- 构建测试
- 模块加载测试
- 基础功能测试
- 完整功能测试
- 包完整性测试

### 测试报告

测试完成后会生成 `test/test-report.json` 报告文件，包含：
- 测试时间戳
- 各项测试结果
- 错误信息
- 测试总结

### 开发工作流

#### 日常开发
1. 修改代码
2. 运行 `npm run test-modules` 快速验证
3. 运行 `npm test` 验证基础功能
4. 提交代码

#### 发布前检查
1. 运行 `npm run test-ci` 完整测试
2. 检查测试报告
3. 确认所有测试通过
4. 更新版本号
5. 发布

### 插件开发

#### 添加新插件
1. 在 `lib/renderer/` 下创建插件目录
2. 实现插件功能
3. 在 `index.ts` 中添加插件引用
4. 运行测试验证

#### 插件加载规则
- npm 包插件：直接使用包名
- 自定义插件：使用 `require.resolve()` 绝对路径
- 特殊插件处理：
  - `markdown-it-emoji`：使用 `full` 版本
  - `markdown-it-toc-and-anchor`：已知依赖问题，暂时跳过

### 故障排除

#### 插件加载失败
1. 检查插件是否正确安装
2. 验证插件导出格式（CommonJS vs ES6）
3. 检查依赖版本兼容性
4. 查看测试报告中的错误信息

#### 构建失败
1. 清理 `dist` 目录
2. 重新安装依赖：`npm ci`
3. 运行 `npm run build`
4. 检查 TypeScript 编译错误

#### 测试失败
1. 查看 `test/test-report.json`
2. 运行单独的测试脚本定位问题
3. 检查插件配置和依赖

### 性能优化

#### 包大小优化
- 当前包大小：1.1MB（压缩），4.1MB（解压）
- 主要大文件：`full.render.js`（1.9MB，Graphviz 渲染引擎）
- 优化建议：
  - 按需加载插件
  - 使用 CDN 分发大文件
  - 考虑插件分包

#### 渲染性能
- 目标：平均渲染时间 < 100ms
- 监控：通过 `test-module-loading.js` 性能测试
- 优化：缓存、懒加载、代码分割

### 持续集成

项目配置了 GitHub Actions 工作流（`.github/workflows/ci.yml`）：
- 多 Node.js 版本测试（16.x, 18.x, 20.x）
- 自动运行完整测试套件
- 生成测试报告
- 包大小检查
- 自动发布（需配置 NPM_TOKEN）

### 最佳实践

1. **提交前测试**：始终运行 `npm run test-ci`
2. **渐进式开发**：先通过模块测试，再进行功能测试
3. **错误处理**：优雅处理插件加载失败
4. **文档更新**：及时更新 README 和类型定义
5. **版本管理**：遵循语义化版本规范

### 调试技巧

#### 插件调试
```bash
# 单独测试插件加载
node -e "console.log(require('plugin-name'))"

# 查看插件详细信息
node -e "const p = require('plugin-name'); console.log(typeof p, Object.keys(p))"
```

#### 渲染调试
```bash
# 启用详细日志
DEBUG=markdown-renderer npm test

# 生成调试输出
node test/test-simple.js > debug.html
```

通过这套完善的测试系统，可以有效避免"使用者才发现问题"的情况，确保每次发布都是稳定可靠的。