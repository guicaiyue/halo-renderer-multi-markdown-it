import MarkdownIt from 'markdown-it';
import Token from 'markdown-it/lib/token.mjs';
import Renderer from 'markdown-it/lib/renderer.mjs';

// This is the browser-specific implementation for the graphviz plugin.
// It will render the graph on the client-side using a library like viz.js.
// For now, we will just output the code in a <pre> tag, and the user
// will need to include a client-side rendering library themselves.

const graphvizChart = (code: string): string => {
  return `<pre class="graphviz">${code}</pre>`;
};

module.exports = (md: MarkdownIt): void => {
  const defaultRenderer = md.renderer.rules.fence?.bind(md.renderer.rules);

  md.renderer.rules.fence = (tokens: Token[], idx: number, options: any, env: any, self: Renderer): string => {
    const token = tokens[idx];
    const code = token.content.trim();

    if (token.info === 'graphviz') {
      return graphvizChart(code);
    }

    if (defaultRenderer) {
      return defaultRenderer(tokens, idx, options, env, self);
    }

    return `<pre>${md.utils.escapeHtml(code)}</pre>`;
  };
};