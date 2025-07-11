# 测试文件目录

这个目录包含了 `markdown-renderer-xirizhi` 的所有测试文件和相关资源。

## 文件说明

### 测试脚本

- **`test-all-features.js`** - 完整功能测试脚本
  - 测试所有 23+ 插件功能
  - 生成性能统计报告
  - 输出完整的HTML文件

- **`test-simple.js`** - 简单功能测试脚本
  - 测试基础 Markdown 功能
  - 快速验证核心功能

- **`examples.js`** - 使用示例演示脚本
  - 展示各种使用方法和配置选项
  - 包含错误处理示例
  - 适合学习和参考

### 测试文档

- **`test-all-features.md`** - 完整功能测试文档
  - 包含所有支持的 Markdown 格式
  - 涵盖基础语法到高级功能
  - 用于全面测试渲染器功能

### 输出文件

- **`test-all-features-output.html`** - 渲染结果HTML文件
  - 由 `test-all-features.js` 自动生成
  - 包含完整的CSS样式
  - 可在浏览器中直接查看效果

## 使用方法

### 运行完整功能测试
```bash
# 从项目根目录运行
node test/test-all-features.js
```

### 运行简单功能测试
```bash
# 从项目根目录运行
node test/test-simple.js
```

### 运行使用示例
```bash
# 从项目根目录运行
node test/examples.js
```

### 查看渲染结果
```bash
# 在浏览器中打开HTML文件
open test/test-all-features-output.html
# 或者在Windows中
start test/test-all-features-output.html
```

## 测试覆盖的功能

### 基础功能
- ✅ 标题（1-6级）
- ✅ 文本格式化（粗体、斜体、删除线等）
- ✅ 链接和图片
- ✅ 列表（有序、无序、任务列表）
- ✅ 表格
- ✅ 引用块
- ✅ 代码块和语法高亮

### 高级功能
- ✅ 数学公式（KaTeX）
- ✅ 表情符号
- ✅ 脚注
- ✅ 上标和下标
- ✅ 插入和高亮文本
- ✅ 容器（警告、信息、提示、危险）
- ✅ 日语注音
- ✅ 剧透标签
- ✅ 图表支持
- ✅ 中文排版优化

## 性能基准

基于完整功能测试的性能数据：
- 输入文档大小：~15KB
- 渲染时间：~600ms
- 输出HTML大小：~40KB
- 支持插件数量：23+

## 添加新测试

如果需要添加新的测试用例：

1. 在 `test-all-features.md` 中添加新的 Markdown 语法示例
2. 运行 `node test/test-all-features.js` 验证渲染效果
3. 检查生成的 HTML 文件确认功能正常

## 故障排除

如果测试失败，请检查：

1. 依赖是否正确安装：`npm install`
2. 路径引用是否正确（相对于项目根目录）
3. 插件是否正常加载
4. 查看错误日志获取详细信息