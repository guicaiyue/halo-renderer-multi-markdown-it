/**
 * Browser-specific entry point for markdown-renderer-xirizhi.
 * This file bundles all necessary plugins for browser usage.
 */

import * as MarkdownRenderer from './index';
import { PluginConfig } from './types';

// Import all default plugins so they can be bundled by Webpack
import * as markdownItAbbr from 'markdown-it-abbr';
import * as markdownItBracketedSpans from 'markdown-it-bracketed-spans';
import * as markdownItAttrs from 'markdown-it-attrs';
import * as markdownItDeflist from 'markdown-it-deflist';
import * as markdownItEmoji from 'markdown-it-emoji';
import * as markdownItFootnote from 'markdown-it-footnote';
import * as markdownItIns from 'markdown-it-ins';
import * as markdownItMark from 'markdown-it-mark';
import * as markdownItMultimdTable from 'markdown-it-multimd-table';
import * as markdownItSub from 'markdown-it-sub';
import * as markdownItSup from 'markdown-it-sup';
import * as markdownItTaskCheckbox from 'markdown-it-task-checkbox';
import * as markdownItAnchor from 'markdown-it-anchor';
import * as markdownItTocDoneRight from 'markdown-it-toc-done-right';
import * as markdownItPangu from 'markdown-it-pangu';
import * as markdownItContainer from './lib/renderer/markdown-it-container';
import * as markdownItFurigana from './lib/renderer/markdown-it-furigana';
import * as markdownItKatex from './lib/renderer/markdown-it-katex';
import * as markdownItMermaid from './lib/renderer/markdown-it-mermaid';
import * as markdownItGraphviz from './lib/renderer/markdown-it-graphviz';
import * as markdownItPrism from './lib/renderer/markdown-it-prism';
import * as markdownItChart from './lib/renderer/markdown-it-chart';
import * as markdownItSpoiler from './lib/renderer/markdown-it-spoiler';
import * as markdownItExcerpt from './lib/renderer/markdown-it-excerpt';

// Create a browser-compatible version of the renderer
const browserPlugins: PluginConfig[] = [
    { name: markdownItAbbr },
    { name: markdownItBracketedSpans },
    { name: markdownItAttrs },
    { name: markdownItDeflist },
    { name: markdownItEmoji },
    { name: markdownItFootnote },
    { name: markdownItIns },
    { name: markdownItMark },
    { name: markdownItMultimdTable },
    { name: markdownItSub },
    { name: markdownItSup },
    { name: markdownItTaskCheckbox },
    { name: markdownItAnchor },
    { name: markdownItTocDoneRight },
    { name: markdownItPangu },
    { name: markdownItContainer },
    { name: markdownItFurigana },
    { name: markdownItKatex },
    { name: markdownItMermaid },
    { name: markdownItGraphviz },
    { name: markdownItPrism },
    { name: markdownItChart },
    { name: markdownItSpoiler },
    { name: markdownItExcerpt },
];

const render = (markdown: string, options: any = {}) => {
    const config = {
        ...options,
        plugins: browserPlugins.concat(options.plugins || []),
    };
    return MarkdownRenderer.render(markdown, config);
};

const createRenderer = (options: any = {}) => {
    const config = {
        ...options,
        plugins: browserPlugins.concat(options.plugins || []),
    };
    return MarkdownRenderer.createRenderer(config);
};

// Expose the renderer for browser environments
export {
    render,
    createRenderer,
    MarkdownRenderer as core
};