/**
 * Independent Markdown Renderer with Multiple Plugins
 * Converted from hexo-renderer-multi-markdown-it
 */

'use strict';

const MdIt = require('markdown-it');

// Default plugins list
const default_plugins = [
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
    './lib/renderer/markdown-it-container',
    './lib/renderer/markdown-it-furigana',
    './lib/renderer/markdown-it-katex',
    './lib/renderer/markdown-it-mermaid',
    './lib/renderer/markdown-it-graphviz',
    './lib/renderer/markdown-it-prism',
    './lib/renderer/markdown-it-chart',
    './lib/renderer/markdown-it-spoiler',
    './lib/renderer/markdown-it-excerpt'
];

// Default configuration
const default_config = {
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
 * @param {Array} plugins - User provided plugins configuration
 * @return {Array} - Processed plugins list
 */
function processPlugins(plugins = []) {
    const default_plugins_map = {};
    
    // Initialize default plugins
    for (const plugin_name of default_plugins) {
        default_plugins_map[plugin_name] = {
            name: plugin_name,
            enable: true,
            options: {}
        };
    }

    const custom_plugins = [];

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
    const result = [];
    for (const plugin_name of default_plugins) {
        result.push(default_plugins_map[plugin_name]);
    }
    result.push(...custom_plugins);

    return result;
}

/**
 * Load and apply plugins to markdown-it parser
 * @param {Object} parser - markdown-it instance
 * @param {Array} plugins - Plugins configuration
 * @return {Object} - Configured parser
 */
function applyPlugins(parser, plugins) {
    return plugins.reduce((parser, plugin_config) => {
        if (!plugin_config.enable) {
            return parser;
        }

        try {
            let plugin = require(plugin_config.name);

            // Handle ES6 modules
            if (typeof plugin !== 'function' && typeof plugin.default === 'function') {
                plugin = plugin.default;
            }

            if (typeof plugin !== 'function') {
                console.warn(`Plugin ${plugin_config.name} is not a function`);
                return parser;
            }

            // Apply plugin with or without options
            if (plugin_config.options && Object.keys(plugin_config.options).length > 0) {
                return parser.use(plugin, plugin_config.options);
            } else {
                return parser.use(plugin);
            }
        } catch (error) {
            console.warn(`Failed to load plugin ${plugin_config.name}:`, error.message);
            return parser;
        }
    }, parser);
}

/**
 * Main render function
 * @param {string} markdown - Markdown text to render
 * @param {Object} options - Configuration options
 * @return {string} - Rendered HTML
 */
function render(markdown, options = {}) {
    if (typeof markdown !== 'string') {
        throw new Error('Markdown input must be a string');
    }

    // Merge configuration
    const config = {
        render: { ...default_config.render, ...(options.render || {}) },
        plugins: options.plugins || default_config.plugins
    };

    // Create markdown-it instance
    const parser_config = config.render;
    const parser = new MdIt(parser_config);

    // Process and apply plugins
    const processed_plugins = processPlugins(config.plugins);
    const configured_parser = applyPlugins(parser, processed_plugins);

    // Render markdown to HTML
    try {
        return configured_parser.render(markdown);
    } catch (error) {
        throw new Error(`Markdown rendering failed: ${error.message}`);
    }
}

/**
 * Create a configured renderer instance
 * @param {Object} options - Default configuration for this instance
 * @return {Function} - Render function with preset configuration
 */
function createRenderer(options = {}) {
    return function(markdown, instanceOptions = {}) {
        const merged_options = {
            render: { ...options.render, ...instanceOptions.render },
            plugins: instanceOptions.plugins || options.plugins || []
        };
        return render(markdown, merged_options);
    };
}

// Export main functions
module.exports = {
    render,
    createRenderer,
    default_plugins,
    default_config
};

// For CommonJS compatibility
module.exports.default = module.exports;