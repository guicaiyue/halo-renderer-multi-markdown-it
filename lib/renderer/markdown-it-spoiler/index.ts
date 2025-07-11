import MarkdownIt from 'markdown-it';
import Token from 'markdown-it/lib/token.mjs';
import Renderer from 'markdown-it/lib/renderer.mjs';

interface SpoilerPluginOptions {
  // 可以在这里定义剧透插件特定的选项
}

module.exports = function (md: MarkdownIt, options?: SpoilerPluginOptions): void {
    const plugin = require('markdown-it-container');
    
    md.use(plugin, 'spoiler', {
        validate: function (params: string): RegExpMatchArray | null {
            return params.trim().match(/^spoiler\s+(.*)$/);
        },
        render: function (tokens: Token[], idx: number): string {
            const m = tokens[idx].info.trim().match(/^spoiler\s+(.*)$/);

            if (tokens[idx].nesting === 1) {
                // opening tag
                return '<details class="spoiler"><summary>' + (m ? md.utils.escapeHtml(m[1]) : '') + '</summary>\n';
            } else {
                // closing tag
                return '</details>\n';
            }
        }
    });
};