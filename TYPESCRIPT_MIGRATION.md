# TypeScript Migration Guide

本项目已成功从JavaScript迁移到TypeScript，提供更好的类型安全和开发体验。

## 🎯 迁移完成的内容

### ✅ 已完成
- [x] 主入口文件 `index.js` → `index.ts`
- [x] 核心渲染器 `lib/renderer/index.js` → `lib/renderer/index.ts`
- [x] TypeScript配置文件 `tsconfig.json`
- [x] 类型定义文件 `types/index.d.ts`
- [x] 构建脚本和依赖更新
- [x] 向后兼容性保持

### 🔄 待完成（可选）
- [ ] 各个插件模块的TypeScript转换
- [ ] 测试文件的TypeScript转换
- [ ] 更详细的类型定义

## 📦 新的构建流程

### 安装依赖
```bash
npm install
```

### 构建项目
```bash
# 编译TypeScript到JavaScript
npm run build

# 开发模式（监听文件变化）
npm run dev
```

### 运行测试
```bash
# 运行简单测试
npm test

# 运行完整功能测试
npm run test-all
```

## 🔧 使用方式

### JavaScript项目中使用
```javascript
const { render } = require('markdown-renderer-multi');

const html = render('# Hello World');
console.log(html);
```

### TypeScript项目中使用
```typescript
import { render, RendererConfig } from 'markdown-renderer-multi';

const options: RendererConfig = {
  render: {
    html: true,
    breaks: true
  },
  plugins: [
    {
      name: 'markdown-it-emoji',
      enable: true
    }
  ]
};

const html = render('# Hello World :smile:', options);
console.log(html);
```

## 📋 类型定义

主要的类型接口：

- `RenderOptions` - 渲染选项配置
- `PluginConfig` - 插件配置
- `RendererConfig` - 完整的渲染器配置
- `MarkdownRenderer` - 主要的渲染器接口

详细类型定义请查看 `types/index.d.ts` 文件。

## 🔄 向后兼容性

- 保持所有原有的JavaScript API不变
- 支持CommonJS和ES模块导入方式
- 现有的JavaScript项目无需修改即可使用

## 🚀 优势

1. **类型安全**：编译时类型检查，减少运行时错误
2. **更好的IDE支持**：自动补全、重构、导航等
3. **更好的文档**：类型即文档，API更清晰
4. **渐进式迁移**：可以逐步将插件模块转换为TypeScript
5. **现代化开发**：符合现代JavaScript/TypeScript最佳实践

## 📝 注意事项

1. 发布前需要运行 `npm run build` 编译TypeScript
2. `dist/` 目录包含编译后的JavaScript文件
3. 类型定义文件会自动生成到 `dist/` 目录
4. 原有的JavaScript文件保留，确保兼容性

## 🛠️ 开发建议

1. 使用支持TypeScript的IDE（如VS Code）
2. 启用严格模式类型检查
3. 为新功能添加适当的类型定义
4. 运行 `npm run dev` 进行开发时的实时编译