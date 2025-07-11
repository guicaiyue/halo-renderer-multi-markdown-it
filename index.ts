/**
 * Independent Markdown Renderer with Multiple Plugins
 * Converted from hexo-renderer-multi-markdown-it
 */

'use strict';

import MdIt = require('markdown-it');
import { RenderOptions, PluginConfig, RendererConfig, ProcessedPlugin, MarkdownItPlugin } from './types';

// Default plugins list
const default_plugins: string[] = [
    'markdown-it-abbr',
    'markdown-it-bracketed-spans',
    'markdown-it-attrs',
    'markdown-it-deflist',
    'markdown-it-emoji',
    'markdown-it-footnote',
    'markdown-it-ins',
    'markdown-it-mark',
    'markdown-it-multimd-table',
    'markdown-it-sub',
    'markdown-it-sup',
    'markdown-it-task-checkbox',
    'markdown-it-toc-and-anchor',
    'markdown-it-pangu',
    require.resolve('./lib/renderer/markdown-it-container'),
    require.resolve('./lib/renderer/markdown-it-furigana'),
    require.resolve('./lib/renderer/markdown-it-katex'),
    require.resolve('./lib/renderer/markdown-it-mermaid'),
    require.resolve('./lib/renderer/markdown-it-graphviz'),
    require.resolve('./lib/renderer/markdown-it-prism'),
    require.resolve('./lib/renderer/markdown-it-chart'),
    require.resolve('./lib/renderer/markdown-it-spoiler'),
    require.resolve('./lib/renderer/markdown-it-excerpt')
];

// Default configuration
const default_config: {
    render: RenderOptions;
    plugins: PluginConfig[];
} = {
    render: {
        html: true,
        xhtmlOut: false,
        breaks: true,
        linkify: true,
        typographer: true,
        quotes: '""\u2018\u2019',
        tab: ''
    },
    plugins: []
};

/**
 * Process and merge plugin configurations
 * @param plugins - User provided plugins configuration
 * @returns Processed plugins list
 */
function processPlugins(plugins: PluginConfig[] = []): ProcessedPlugin[] {
    const default_plugins_map: Record<string, ProcessedPlugin> = {};
    
    // Initialize default plugins
    for (const plugin_name of default_plugins) {
        default_plugins_map[plugin_name] = {
            name: plugin_name,
            enable: true,
            options: {}
        };
    }

    const custom_plugins: ProcessedPlugin[] = [];

    // Process user provided plugins
    for (const plugin_config of plugins) {
        if (!plugin_config || typeof plugin_config !== 'object') {
            continue;
        }
        
        const plugin_name = plugin_config.name;
        if (!plugin_name) {
            continue;
        }

        const enable = plugin_config.enable !== false; // Default to true
        const options = plugin_config.options || {};

        if (default_plugins_map[plugin_name]) {
            // Update default plugin configuration
            default_plugins_map[plugin_name] = {
                name: plugin_name,
                enable,
                options
            };
        } else {
            // Add custom plugin
            custom_plugins.push({
                name: plugin_name,
                enable,
                options
            });
        }
    }

    // Combine default plugins (in order) with custom plugins
    const result: ProcessedPlugin[] = [];
    for (const plugin_name of default_plugins) {
        result.push(default_plugins_map[plugin_name]);
    }
    result.push(...custom_plugins);

    return result;
}

/**
 * Load and apply plugins to markdown-it parser
 * @param parser - markdown-it instance
 * @param plugins - Plugins configuration
 * @returns Configured parser
 */
function applyPlugins(parser: MdIt, plugins: ProcessedPlugin[]): MdIt {
    return plugins.reduce((parser: MdIt, plugin_config: ProcessedPlugin) => {
        if (!plugin_config.enable) {
            return parser;
        }

        try {
            let plugin: MarkdownItPlugin | { default: MarkdownItPlugin } = require(plugin_config.name);

            // Handle ES6 modules
            if (typeof plugin !== 'function' && typeof (plugin as any).default === 'function') {
                plugin = (plugin as any).default;
            }

            if (typeof plugin !== 'function') {
                console.warn(`Plugin ${plugin_config.name} is not a function`);
                return parser;
            }

            // Apply plugin with or without options
            if (plugin_config.options && Object.keys(plugin_config.options).length > 0) {
                return parser.use(plugin as MarkdownItPlugin, plugin_config.options);
            } else {
                return parser.use(plugin as MarkdownItPlugin);
            }
        } catch (error: any) {
            console.warn(`Failed to load plugin ${plugin_config.name}:`, error.message);
            return parser;
        }
    }, parser);
}

/**
 * Main render function
 * @param markdown - Markdown text to render
 * @param options - Configuration options
 * @returns Rendered HTML
 */
function render(markdown: string, options: RendererConfig = {}): string {
    if (typeof markdown !== 'string') {
        throw new Error('Markdown input must be a string');
    }

    // Merge configuration
    const config: RendererConfig = {
        render: { ...default_config.render, ...(options.render || {}) },
        plugins: options.plugins || default_config.plugins
    };

    // Create markdown-it instance
    const parser_config = config.render!;
    const parser = new (MdIt as any)(parser_config);

    // Process and apply plugins
    const processed_plugins = processPlugins(config.plugins);
    const configured_parser = applyPlugins(parser, processed_plugins);

    // Render markdown to HTML
    try {
        return configured_parser.render(markdown);
    } catch (error: any) {
        throw new Error(`Markdown rendering failed: ${error.message}`);
    }
}

/**
 * Create a configured renderer instance
 * @param options - Default configuration for this instance
 * @returns Render function with preset configuration
 */
function createRenderer(options: RendererConfig = {}): (markdown: string, instanceOptions?: RendererConfig) => string {
    return function(markdown: string, instanceOptions: RendererConfig = {}): string {
        const merged_options: RendererConfig = {
            render: { ...options.render, ...instanceOptions.render },
            plugins: instanceOptions.plugins || options.plugins || []
        };
        return render(markdown, merged_options);
    };
}

// Export main functions
export {
    render,
    createRenderer,
    default_plugins,
    default_config
};

// Default export for CommonJS compatibility
const markdownRenderer = {
    render,
    createRenderer,
    default_plugins,
    default_config
};

export default markdownRenderer;

// For CommonJS compatibility
module.exports = markdownRenderer;
module.exports.default = markdownRenderer;