/**
 * Independent Markdown Renderer with Multiple Plugins
 * Converted from hexo-renderer-multi-markdown-it
 */

import MdIt from 'markdown-it';
import { RenderOptions, PluginConfig, RendererConfig, ProcessedPlugin, MarkdownItPlugin } from './types/index.js';

// Statically import all plugins
import markdownItAbbr from 'markdown-it-abbr';
import markdownItBracketedSpans from 'markdown-it-bracketed-spans';
import markdownItAttrs from 'markdown-it-attrs';
import markdownItDeflist from 'markdown-it-deflist';
import * as markdownItEmoji from 'markdown-it-emoji';
import markdownItFootnote from 'markdown-it-footnote';
import markdownItIns from 'markdown-it-ins';
import markdownItMark from 'markdown-it-mark';
import markdownItMultimdTable from 'markdown-it-multimd-table';
import markdownItSub from 'markdown-it-sub';
import markdownItSup from 'markdown-it-sup';
import markdownItTaskCheckbox from 'markdown-it-task-checkbox';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItTocDoneRight from 'markdown-it-toc-done-right';
import markdownItPangu from 'markdown-it-pangu';
import markdownItContainer from './lib/renderer/markdown-it-container/index.js';
import markdownItFurigana from './lib/renderer/markdown-it-furigana/index.js';
import markdownItKatex from './lib/renderer/markdown-it-katex/index.js';
import markdownItPrism from './lib/renderer/markdown-it-prism/index.js';
import markdownItChart from './lib/renderer/markdown-it-chart/index.js';
import markdownItSpoiler from './lib/renderer/markdown-it-spoiler/index.js';
import markdownItExcerpt from './lib/renderer/markdown-it-excerpt/index.js';

const availablePlugins: Record<string, any> = {
    'markdown-it-abbr': markdownItAbbr,
    'markdown-it-bracketed-spans': markdownItBracketedSpans,
    'markdown-it-attrs': markdownItAttrs,
    'markdown-it-deflist': markdownItDeflist,
    'markdown-it-emoji': (markdownItEmoji as any).full || markdownItEmoji,
    'markdown-it-footnote': markdownItFootnote,
    'markdown-it-ins': markdownItIns,
    'markdown-it-mark': markdownItMark,
    'markdown-it-multimd-table': markdownItMultimdTable,
    'markdown-it-sub': markdownItSub,
    'markdown-it-sup': markdownItSup,
    'markdown-it-task-checkbox': markdownItTaskCheckbox,
    'markdown-it-anchor': markdownItAnchor,
    'markdown-it-toc-done-right': markdownItTocDoneRight,
    'markdown-it-pangu': markdownItPangu,
    './lib/renderer/markdown-it-container/index.js': markdownItContainer,
    './lib/renderer/markdown-it-furigana/index.js': markdownItFurigana,
    './lib/renderer/markdown-it-katex/index.js': markdownItKatex,
    './lib/renderer/markdown-it-prism/index.js': markdownItPrism,
    './lib/renderer/markdown-it-chart/index.js': markdownItChart,
    './lib/renderer/markdown-it-spoiler/index.js': markdownItSpoiler,
    './lib/renderer/markdown-it-excerpt/index.js': markdownItExcerpt
};

const default_plugins: string[] = Object.keys(availablePlugins);

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

        // If the plugin is provided as a string, check if it's a default plugin
        if (typeof plugin_name === 'string' && default_plugins_map[plugin_name]) {
            default_plugins_map[plugin_name] = {
                name: plugin_name,
                enable,
                options
            };
        } else {
            // Otherwise, treat it as a custom plugin (either string or function)
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
async function applyPlugins(parser: MdIt, plugins: ProcessedPlugin[]): Promise<MdIt> {
    for (const plugin_config of plugins) {
        if (!plugin_config.enable) {
            continue;
        }

        let plugin = availablePlugins[plugin_config.name as string];
        if (!plugin) {
            console.warn(`Plugin ${plugin_config.name} not found.`);
            continue;
        }

        // Handle ES modules with default exports
        if (typeof plugin !== 'function' && plugin.default) {
            plugin = plugin.default;
        }

        // Special handling for markdown-it-emoji
        if (plugin_config.name === 'markdown-it-emoji' && typeof plugin === 'object') {
            plugin = (plugin as any).full || (plugin as any).bare;
        }

        if (typeof plugin === 'function') {
            parser.use(plugin, plugin_config.options);
        } else {
            console.warn(`Plugin ${plugin_config.name} is not a valid markdown-it plugin.`);
        }
    }
    return parser;
}

/**
 * Main render function
 * @param markdown - Markdown text to render
 * @param options - Configuration options
 * @returns Rendered HTML
 */
async function render(markdown: string, options: RendererConfig = {}): Promise<string> {
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
    const configured_parser = await applyPlugins(parser, processed_plugins);

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
function createRenderer(options: RendererConfig = {}): (markdown: string, instanceOptions?: RendererConfig) => Promise<string> {
    return async function(markdown: string, instanceOptions: RendererConfig = {}): Promise<string> {
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