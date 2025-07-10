// Type definitions for markdown-renderer-multi

export interface RenderOptions {
  html?: boolean;
  xhtmlOut?: boolean;
  breaks?: boolean;
  linkify?: boolean;
  typographer?: boolean;
  quotes?: string;
  tab?: string;
}

export interface PluginOptions {
  [key: string]: any;
}

export interface PluginConfig {
  name: string;
  enable?: boolean;
  options?: PluginOptions;
}

export interface RendererConfig {
  render?: RenderOptions;
  plugins?: PluginConfig[];
}

export interface ProcessedPlugin {
  name: string;
  enable: boolean;
  options: PluginOptions;
}

export interface MarkdownRenderer {
  render(markdown: string, options?: RendererConfig): string;
  createRenderer(options?: RendererConfig): (markdown: string, instanceOptions?: RendererConfig) => string;
  default_plugins: string[];
  default_config: {
    render: RenderOptions;
    plugins: PluginConfig[];
  };
}

export type MarkdownItPlugin = (md: any, options?: any) => void;

export declare const render: (markdown: string, options?: RendererConfig) => string;
export declare const createRenderer: (options?: RendererConfig) => (markdown: string, instanceOptions?: RendererConfig) => string;
export declare const default_plugins: string[];
export declare const default_config: {
  render: RenderOptions;
  plugins: PluginConfig[];
};

declare const markdownRenderer: MarkdownRenderer;
export default markdownRenderer;