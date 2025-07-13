/**
 * Browser-specific entry point for markdown-renderer-xirizhi.
 * This file bundles all necessary plugins for browser usage.
 */

import * as MarkdownRenderer from './index.js';
import { browserPlugins } from './lib/renderer/browser-plugins.js';

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