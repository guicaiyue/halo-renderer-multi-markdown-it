import MdIt = require('markdown-it');
import { PluginConfig, MarkdownItPlugin } from '../../types';

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
    './markdown-it-container',
    './markdown-it-furigana',
    './markdown-it-katex',
    './markdown-it-mermaid',
    './markdown-it-graphviz',
    './markdown-it-prism',
    './markdown-it-chart',
    './markdown-it-spoiler',
    './markdown-it-excerpt'
];

interface LegacyPluginConfig {
    plugin: {
        name: string;
        enable?: boolean;
        options?: any;
    };
}

interface ProcessedLegacyPlugin {
    name: string;
    enable: boolean;
    options?: any;
}

/**
 * General default plugin config (Legacy format support)
 * @param plugins - plugin List in legacy format
 * @returns processed plugin List
 */
function checkPlugins(plugins?: LegacyPluginConfig[]): ProcessedLegacyPlugin[] {
    const default_plugins_list: Record<string, ProcessedLegacyPlugin> = {};
    
    for (let i = 0; i < default_plugins.length; i++) {
        default_plugins_list[default_plugins[i]] = { 
            name: default_plugins[i], 
            enable: true 
        };
    }

    const _t: ProcessedLegacyPlugin[] = [];

    if (plugins) {
        for (let i = 0; i < plugins.length; i++) {
            if (!(plugins[i] instanceof Object) || !(plugins[i].plugin instanceof Object)) {
                continue;
            }
            const plugin_name = plugins[i].plugin.name;
            if (!plugin_name) {
                continue;
            }
            if (plugins[i].plugin.enable == null || plugins[i].plugin.enable == undefined || plugins[i].plugin.enable !== true) {
                plugins[i].plugin.enable = false;
            }
            if (default_plugins_list[plugin_name]) {
                default_plugins_list[plugin_name] = plugins[i].plugin as ProcessedLegacyPlugin;
            } else {
                _t.push(plugins[i].plugin as ProcessedLegacyPlugin);
            }
        }
    }

    for (let i = default_plugins.length - 1; i >= 0; i--) {
        _t.unshift(default_plugins_list[default_plugins[i]]);
    }

    return _t;
}

interface RenderData {
    text: string;
}

interface LegacyOptions {
    markdown?: {
        render?: any;
        plugins?: LegacyPluginConfig[];
    };
}

interface LegacyContext {
    config: LegacyOptions;
}

/**
 * Legacy renderer function for backward compatibility
 * @param this - Legacy context object
 * @param data - Data containing markdown text
 * @param options - Legacy options (unused)
 * @returns Rendered HTML string
 */
function legacyRenderer(this: LegacyContext, data: RenderData, options?: any): string {
    const cfg = this.config.markdown;
    const opt = cfg ? cfg : 'default';
    let parser: any;
    
    if (typeof opt === 'string' && (opt === 'default' || opt === 'commonmark' || opt === 'zero')) {
        parser = new (MdIt as any)(opt);
    } else {
        parser = new (MdIt as any)((opt as any).render);
    }

    const plugins = checkPlugins(typeof opt === 'object' ? opt.plugins : undefined);

    parser = plugins.reduce((parser: MdIt, pluginConfig: ProcessedLegacyPlugin) => {
        if (pluginConfig.enable) {
            try {
                let plugin: MarkdownItPlugin | { default: MarkdownItPlugin } = require(pluginConfig.name);

                if (typeof plugin !== 'function' && typeof (plugin as any).default === 'function') {
                    plugin = (plugin as any).default;
                }

                if (typeof plugin !== 'function') {
                    console.warn(`Plugin ${pluginConfig.name} is not a function`);
                    return parser;
                }

                if (pluginConfig.options) {
                    return parser.use(plugin as MarkdownItPlugin, pluginConfig.options);
                } else {
                    return parser.use(plugin as MarkdownItPlugin);
                }
            } catch (error: any) {
                console.warn(`Failed to load plugin ${pluginConfig.name}:`, error.message);
                return parser;
            }
        } else {
            return parser;
        }
    }, parser);

    return parser.render(data.text);
}

export = legacyRenderer;