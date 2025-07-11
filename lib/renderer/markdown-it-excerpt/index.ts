import MarkdownIt from 'markdown-it';
import Token from 'markdown-it/lib/token.mjs';
import Renderer from 'markdown-it/lib/renderer.mjs';

interface ExcerptPluginOptions {
  // 可以在这里定义插件特定的选项
}

module.exports = function (md: MarkdownIt, options?: ExcerptPluginOptions): void {
    const defaultRenderer = md.renderer.rules.text?.bind(md.renderer.rules);

    const rExcerpt = /<!--+\s*more\s*--+>/i;

    md.renderer.rules.text = (tokens: Token[], index: number, options: any, env: any, self: Renderer): string => {
        const content = tokens[index].content;
        if (rExcerpt.test(content)) {
            return content;
        } else {
            return defaultRenderer ? defaultRenderer(tokens, index, options, env, self) : '';
        }
    };
};