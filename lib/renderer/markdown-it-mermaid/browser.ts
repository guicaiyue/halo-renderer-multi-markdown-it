import MarkdownIt from 'markdown-it';
import Token from 'markdown-it/lib/token.mjs';
import Renderer from 'markdown-it/lib/renderer.mjs';

// This is the browser-specific implementation for the mermaid plugin.
// It renders the mermaid diagram on the client-side.

const mermaidChart = (code: string): string => {
  return `<pre class="mermaid">${code}</pre>`;
};

module.exports = (md: MarkdownIt): void => {
  const defaultRenderer = md.renderer.rules.fence?.bind(md.renderer.rules);

  md.renderer.rules.fence = (tokens: Token[], idx: number, options: any, env: any, self: Renderer): string => {
    const token = tokens[idx];
    const code = token.content.trim();

    if (token.info === 'mermaid') {
      return mermaidChart(code);
    }

    if (defaultRenderer) {
      return defaultRenderer(tokens, idx, options, env, self);
    }

    // Fallback for when default renderer is not available
    return `<pre>${md.utils.escapeHtml(code)}</pre>`;
  };
};