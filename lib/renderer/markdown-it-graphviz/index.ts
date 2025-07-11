import MarkdownIt from 'markdown-it';
import Token from 'markdown-it/lib/token.mjs';
import Renderer from 'markdown-it/lib/renderer.mjs';

const Viz = require('./common/viz.es.js');
const { render, Module } = require('./common/full.render.js');

interface GraphvizPluginOptions {
  // 可以在这里定义插件特定的选项
  [key: string]: any;
}

module.exports = function markdownItGraphViz(md: MarkdownIt, options: GraphvizPluginOptions = {}): void {
  const temp = md.renderer.rules.fence?.bind(md.renderer.rules);
  
  md.renderer.rules.fence = (tokens: Token[], idx: number, options: any, env: any, slf: Renderer): string => {
    try {
      const { content, info } = tokens[idx];
      if (info === 'graphviz') {
        const viz = new Viz({ render, Module });

        const svg = viz.wrapper.render(content, { 
          format: 'svg', 
          engine: 'dot', 
          files: [], 
          images: [], 
          yInvert: false, 
          nop: 0 
        });

        const code = svg.replace(/[\r\n]/g, "").split('<svg', 2);

        return `<pre class="graphviz"><svg${code[1]}</pre>`;
      }
    } catch (error: any) {
      return `<pre>${md.utils.escapeHtml(error.toString())}</pre>`;
    }
    return temp ? temp(tokens, idx, options, env, slf) : '';
  };
};