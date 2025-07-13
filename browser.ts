/**
 * Browser-specific entry point for markdown-renderer-xirizhi.
 * This file bundles all necessary plugins for browser usage.
 */

import * as MarkdownRenderer from './index.js';
const { render, createRenderer } = MarkdownRenderer;

// Expose the renderer for browser environments
export {
    render,
    createRenderer,
    MarkdownRenderer as core
};