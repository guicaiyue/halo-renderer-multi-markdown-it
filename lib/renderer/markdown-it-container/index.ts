import MarkdownIt from 'markdown-it';
import Token from 'markdown-it/lib/token.mjs';
import Renderer from 'markdown-it/lib/renderer.mjs';

interface ContainerOptions {
  marker?: string;
  validate?: (params: string) => RegExpMatchArray | null;
  render?: (tokens: Token[], idx: number, options: any, env: any, renderer: Renderer) => string;
}

interface PluginOptions {
  // 可以在这里定义插件特定的选项
}

module.exports = function (md: MarkdownIt, options?: PluginOptions): void {
    const plugin = require('markdown-it-container');
    
    // Note container
    md.use(plugin, 'note', {
        validate: function (params: string): RegExpMatchArray | null {
            return params.trim().match(/^(default|primary|success|info|warning|danger)(.*)$/);
        },
        render: function (tokens: Token[], idx: number): string {
            const m = tokens[idx].info.trim().match(/^(.*)$/);

            if (tokens[idx].nesting === 1) {
                // opening tag
                return '<div class="note ' + (m ? m[1].trim() : '') + '">\n';
            } else {
                // closing tag
                return '</div>\n';
            }
        }
    } as ContainerOptions);

    // Tab container
    md.use(plugin, 'tab', {
        marker: ';',
        validate: function(params: string): RegExpMatchArray | null {
            return params.trim().match(/^(\w+)+(.*)$/);
        },
        render: function (tokens: Token[], idx: number): string {
            const m = tokens[idx].info.trim().match(/^(\w+)+(.*)$/);

            if (tokens[idx].nesting === 1) {
                // opening tag
                return '<div class="tab" data-id="' + (m ? m[1].trim() : '') + '" data-title="' + (m ? m[2].trim() : '') + '">\n';
            } else {
                // closing tag
                return '</div>\n';
            }
        }
    } as ContainerOptions);

    // Collapse container
    md.use(plugin, 'collapse', {
        marker: '+',
        validate: function(params: string): RegExpMatchArray | null {
            return params.match(/^(primary|success|info|warning|danger|\s)(.*)$/);
        },
        render: function (tokens: Token[], idx: number): string {
            const m = tokens[idx].info.match(/^(primary|success|info|warning|danger|\s)(.*)$/);

            if (tokens[idx].nesting === 1) {
                // opening tag
                const style = m ? m[1].trim() : '';
                return '<details' + (style ? ' class="' + style + '"' : '') + '><summary>' + (m ? m[2].trim() : '') + '</summary><div>\n';
            } else {
                // closing tag
                return '</div></details>\n';
            }
        }
    } as ContainerOptions);
};