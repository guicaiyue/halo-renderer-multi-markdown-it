import MarkdownIt from 'markdown-it';
import Token from 'markdown-it/lib/token.mjs';
import Renderer from 'markdown-it/lib/renderer.mjs';

interface MermaidConfig {
  startOnLoad: boolean;
  theme: string;
  flowchart: {
    htmlLabels: boolean;
    useMaxWidth: boolean;
  };
  [key: string]: any;
}

interface MermaidPluginOptions {
  [key: string]: any;
}

const mermaidChart = (code: string, config: MermaidConfig, style: string): string => {
  const deasyncPromise = require('deasync-promise');

  return deasyncPromise((async () => {
    try {
      const path = require('path');
      const puppeteer = require('puppeteer');
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-setuid-sandbox',
          '--no-first-run',
          '--no-sandbox',
          '--no-zygote',
          '--single-process'
        ]
      });
      const page = await browser.newPage();
      page.setViewport({ width: 800, height: 600 });
      await page.goto(`file://${path.join(__dirname, 'index.html')}`);

      await page.$eval('#container', (container: any, code: string, config: MermaidConfig) => {
        container.innerHTML = code;
        (global as any).mermaid.initialize(config);
        (global as any).mermaid.init(undefined, container);
      }, code, config);
      
      const svg = await page.$eval('#container', (container: any) => {
        container.lastChild.removeChild(container.getElementsByTagName('style')[0]);
        return container.innerHTML;
      });
      
      browser.close();

      return `<pre class="mermaid${style}">${svg}</pre>`;
    } catch (e: any) {
      return `<pre>${e}</pre>`;
    }
  })());
};

module.exports = (md: MarkdownIt, options: MermaidPluginOptions = {}): void => {
  const config: MermaidConfig = {
    startOnLoad: false,
    theme: "default",
    flowchart: {
      htmlLabels: false,
      useMaxWidth: true,
    },
    ...options
  };

  const defaultRenderer = md.renderer.rules.fence?.bind(md.renderer.rules);

  md.renderer.rules.fence = (tokens: Token[], idx: number, options: any, env: any, self: Renderer): string => {
    const token = tokens[idx];
    const code = token.content.trim();

    if (token.info === 'mermaid') {
      let firstLine = code.split(/\n/)[0].trim();
      if (firstLine.match(/^graph (?:TB|BT|RL|LR|TD);?$/)) {
        firstLine = ' graph';
      } else {
        firstLine = '';
      }
      return mermaidChart(code, config, firstLine);
    }
    return defaultRenderer ? defaultRenderer(tokens, idx, options, env, self) : '';
  };
};