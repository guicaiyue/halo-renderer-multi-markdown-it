// Type definitions for markdown-renderer-xirizhi

/**
 * Markdown 渲染器的基础配置选项
 */
export interface RenderOptions {
  /** 是否启用 HTML 标签解析 (默认: true) */
  html?: boolean;
  /** 是否输出 XHTML 格式 (默认: false) */
  xhtmlOut?: boolean;
  /** 是否将换行符转换为 <br> 标签 (默认: false) */
  breaks?: boolean;
  /** 是否自动识别并转换链接 (默认: false) */
  linkify?: boolean;
  /** 是否启用排版优化 (如智能引号、省略号等) (默认: false) */
  typographer?: boolean;
  /** 自定义引号样式，格式: "左双引号右双引号左单引号右单引号" (默认: "\u201c\u201d\u2018\u2019") */
  quotes?: string;
  /** Tab 字符的替换字符串 (默认: "\t") */
  tab?: string;
}

/**
 * 插件的配置选项，支持任意键值对
 */
export interface PluginOptions {
  [key: string]: any;
}

/**
 * 单个插件的配置
 */
export interface PluginConfig {
  /** 插件名称或插件本身 */
  name: string | MarkdownItPlugin;
  /** 是否启用该插件 (默认: true) */
  enable?: boolean;
  /** 插件的具体配置选项 */
  options?: PluginOptions;
}

/**
 * 渲染器的完整配置
 */
export interface RendererConfig {
  /** 基础渲染选项 */
  render?: RenderOptions;
  /** 插件配置列表 */
  plugins?: PluginConfig[];
}

/**
 * 处理后的插件配置 (内部使用)
 */
export interface ProcessedPlugin {
  /** 插件名称或插件本身 */
  name: string | MarkdownItPlugin;
  /** 是否启用 */
  enable: boolean;
  /** 插件选项 */
  options: PluginOptions;
}

/**
 * Markdown 渲染器主接口
 */
export interface MarkdownRenderer {
  /**
   * 渲染 Markdown 文本为 HTML
   * @param markdown - 要渲染的 Markdown 文本
   * @param options - 渲染配置选项
   * @returns 渲染后的 HTML 字符串
   */
  render(markdown: string, options?: RendererConfig): string;
  
  /**
   * 创建一个配置好的渲染器实例
   * @param options - 渲染器配置
   * @returns 渲染器函数
   */
  createRenderer(options?: RendererConfig): (markdown: string, instanceOptions?: RendererConfig) => string;
  
  /** 默认启用的插件列表 */
  default_plugins: string[];
  
  /** 默认配置 */
  default_config: {
    render: RenderOptions;
    plugins: PluginConfig[];
  };
}

/**
 * markdown-it 插件类型定义
 */
export type MarkdownItPlugin = (md: any, options?: any) => void;

/**
 * 快速渲染函数
 * @param markdown - 要渲染的 Markdown 文本
 * @param options - 渲染配置选项
 * @returns 渲染后的 HTML 字符串
 */
export declare const render: (markdown: string, options?: RendererConfig) => string;

/**
 * 创建渲染器函数
 * @param options - 渲染器配置
 * @returns 渲染器函数
 */
export declare const createRenderer: (options?: RendererConfig) => (markdown: string, instanceOptions?: RendererConfig) => string;

/** 默认启用的插件列表 */
export declare const default_plugins: string[];

/** 默认配置对象 */
export declare const default_config: {
  render: RenderOptions;
  plugins: PluginConfig[];
};

/** 默认导出的渲染器实例 */
declare const markdownRenderer: MarkdownRenderer;
export default markdownRenderer;