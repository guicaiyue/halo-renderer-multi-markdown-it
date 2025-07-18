import MarkdownIt from 'markdown-it';
import Token from 'markdown-it/lib/token.mjs';
import Renderer from 'markdown-it/lib/renderer.mjs';

import Prism from 'prismjs';
// import loadLanguages from 'prismjs/components/index.js';
// Import markup-templating first as it's required by PHP and other templating languages
import 'prismjs/components/prism-markup-templating.js';
import 'prismjs/components/prism-bash.js';
import 'prismjs/components/prism-c.js';
import 'prismjs/components/prism-cpp.js';
import 'prismjs/components/prism-csharp.js';
import 'prismjs/components/prism-css.js';
import 'prismjs/components/prism-docker.js';
import 'prismjs/components/prism-git.js';
import 'prismjs/components/prism-go.js';
import 'prismjs/components/prism-graphql.js';
import 'prismjs/components/prism-java.js';
import 'prismjs/components/prism-javascript.js';
import 'prismjs/components/prism-json.js';
import 'prismjs/components/prism-jsx.js';
import 'prismjs/components/prism-kotlin.js';
import 'prismjs/components/prism-latex.js';
import 'prismjs/components/prism-less.js';
import 'prismjs/components/prism-makefile.js';
import 'prismjs/components/prism-markdown.js';
import 'prismjs/components/prism-nginx.js';
import 'prismjs/components/prism-objectivec.js';
import 'prismjs/components/prism-perl.js';
import 'prismjs/components/prism-php.js';
import 'prismjs/components/prism-powershell.js';
import 'prismjs/components/prism-python.js';
import 'prismjs/components/prism-ruby.js';
import 'prismjs/components/prism-rust.js';
import 'prismjs/components/prism-sass.js';
import 'prismjs/components/prism-scala.js';
import 'prismjs/components/prism-scss.js';
import 'prismjs/components/prism-sql.js';
import 'prismjs/components/prism-swift.js';
import 'prismjs/components/prism-typescript.js';
import 'prismjs/components/prism-tsx.js';
import 'prismjs/components/prism-wasm.js';
import 'prismjs/components/prism-yaml.js';
import pangu from 'pangu';
import LanguagesTip from './lang.js';

interface PrismPluginOptions {
  plugins?: string[];
  init?: (prism: any) => void;
  defaultLanguageForUnknown?: string;
  defaultLanguageForUnspecified?: string;
  defaultLanguage?: string;
  line_number?: boolean;
  [key: string]: any;
}

interface ParsedOptions {
  firstLine: number;
  caption: string;
  mark: number[] | false;
  command: { [key: number]: string } | false;
}

const escapeHTML = (str: string): string => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const unescapeHTML = (str: string): string => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
};

const escapeSwigTag = (str: string): string => str.replace(/{/g, '&#123;').replace(/}/g, '&#125;');
const unescapeSwigTag = (str: string): string => str.replace(/&#123;/g, '{').replace(/&#125;/g, '}');

/**
 * Loads the provided Prism plugin.
 * @param name Name of the plugin to load
 * @throws {Error} If there is no plugin with the provided name
 */
// Statically import all required Prism plugins

// Adds support for the `diff` language format, which is a prerequisite for the diff-highlight plugin.
import 'prismjs/components/prism-diff.js';

// Automatically turns URLs and email addresses into clickable links in code blocks.
import 'prismjs/plugins/autolinker/prism-autolinker.js';

// Shows invisible characters like tabs and newlines, which can be useful for debugging whitespace issues.
import 'prismjs/plugins/show-invisibles/prism-show-invisibles.js';

// Normalizes whitespace (e.g., converts tabs to spaces, trims leading/trailing whitespace) for consistent code formatting.
import 'prismjs/plugins/normalize-whitespace/prism-normalize-whitespace.js';

// Highlights added or removed lines in `diff` formatted code blocks.
import 'prismjs/plugins/diff-highlight/prism-diff-highlight.js';

// The loadPrismPlugin function is now effectively a no-op since plugins are imported statically.
// We'll keep it for now to avoid breaking the call sites, but it doesn't need to do anything.
async function loadPrismPlugin(name: string): Promise<void> {
  // Static imports are handled above. This function can be left empty or
  // could perform a check to see if the plugin was loaded if Prism exposes such a mechanism.
  // For now, we'll just log a warning if a plugin that wasn't statically imported is requested.
  const staticallyImported = ['autolinker', 'show-invisibles', 'normalize-whitespace', 'diff-highlight'];
  if (!staticallyImported.includes(name)) {
    console.warn(`Prism plugin "${name}" is not statically imported and may not be available.`);
  }
  return Promise.resolve();
}

/**
 * Checks whether an option represents a valid Prism language
 * @param options The options that have been used to initialise the plugin
 * @param optionName The key of the option inside options that shall be checked
 * @throws {Error} If the option is not set to a valid Prism language
 */
function checkLanguageOption(options: PrismPluginOptions, optionName: string): void {
  const language = options[optionName];
  if (language !== undefined && loadPrismLang(language) === undefined) {
    throw new Error(`Bad option ${optionName}: There is no Prism language '${language}'.`);
  }
}

/**
 * Select the language to use for highlighting, based on the provided options and the specified language.
 * @param options The options that were used to initialise the plugin
 * @param lang Code of the language to highlight the text in
 * @return An array where the first element is the name of the language to use, and the second element is the PRISM language object for that language
 */
function selectLanguage(options: PrismPluginOptions, lang: string): [string, string, any] {
  let langToUse = lang;
  if (langToUse === '' && options.defaultLanguageForUnspecified !== undefined) {
    langToUse = options.defaultLanguageForUnspecified;
  }
  let langShow = LanguagesTip[langToUse] || langToUse;
  let prismLang = loadPrismLang(langToUse);
  if (prismLang === undefined && options.defaultLanguageForUnknown !== undefined) {
    langToUse = options.defaultLanguageForUnknown;
    prismLang = loadPrismLang(langToUse);
  }
  return [langToUse, langShow, prismLang];
}

/**
 * Loads the provided lang into prism.
 * @param lang Code of the language to load
 * @return The Prism language object for the provided lang code. undefined if the language is not known to Prism
 */
function loadPrismLang(lang: string): any {
  if (!lang) return undefined;
  const langObject = Prism.languages[lang];
  return langObject;
}

function getOptions(info: string): ParsedOptions {
  const rFirstLine = /\s*first_line:(\d+)/i;
  const rMark = /\s*mark:([0-9,-]+)/i;
  const rCommand = /\s*command:\((\S[\S\s]*)\)/i;
  const rSubCommand = /"+([\S[\S\s]*)"+:([0-9,-]+)?/i;
  const rCaptionUrlTitle = /([\S[\S\s]]*)\s+(https?:\/\/)([\S]+)\s+(.+)/i;
  const rCaptionUrl = /([\S[\S\s]]*)\s+(https?:\/\/)([\S]+)/i;
  const rCaption = /([\S[\S\s]]*)/;

  let first_line = 1;
  if (rFirstLine.test(info)) {
    info = info.replace(rFirstLine, (match, _first_line) => {
      first_line = parseInt(_first_line);
      return '';
    });
  }

  let mark: number[] | false = false;
  if (rMark.test(info)) {
    mark = [];
    info = info.replace(rMark, (match, _mark) => {
      mark = _mark.split(',').reduce(
        (prev: number[], cur: string) => lineRange(prev, cur, false), mark as number[]);
      return '';
    });
  }

  let command: { [key: number]: string } | false = false;
  if (rCommand.test(info)) {
    command = {};
    info = info.replace(rCommand, (match, _command) => {
      _command.split('||').forEach((cmd: string) => {
        if (rSubCommand.test(cmd)) {
          const match = cmd.match(rSubCommand);
          if (match && match[1]) {
            command = match[2].split(',').reduce(
              (prev: { [key: number]: string }, cur: string) => lineRange(prev, cur, match[1]), command as { [key: number]: string });
          } else if (match) {
            (command as { [key: number]: string })[1] = match[1];
          }
        }
      });
      return '';
    });
  }

  let caption = '';
  if (rCaptionUrlTitle.test(info)) {
    const match = info.match(rCaptionUrlTitle);
    if (match) {
      caption = `<span>${match[1]}</span><a href="${match[2]}${match[3]}">${match[4]}</a>`;
    }
  } else if (rCaptionUrl.test(info)) {
    const match = info.match(rCaptionUrl);
    if (match) {
      caption = `<span>${match[1]}</span><a href="${match[2]}${match[3]}">link</a>`;
    }
  } else if (rCaption.test(info)) {
    const match = info.match(rCaption);
    if (match) {
      caption = `<span>${match[1]}</span>`;
    }
  }

  return {
    firstLine: first_line,
    caption,
    mark,
    command
  };
}

function lineRange(prev: any, cur: string, value: any): any {
  const prevd = function (key: number) {
    if (value) {
      prev[key] = value;
    } else {
      prev.push(key);
    }
  };
  
  if (/-/.test(cur)) {
    let a = Number(cur.substr(0, cur.indexOf('-')));
    let b = Number(cur.substr(cur.indexOf('-') + 1));
    if (b < a) { // switch a & b
      const temp = a;
      a = b;
      b = temp;
    }

    for (; a <= b; a++) {
      prevd(a);
    }

    return prev;
  }
  prevd(Number(cur));
  return prev;
}

function replaceTabs(str: string, tab: string): string {
  return str.replace(/^\t+/gm, match => {
    let result = '';

    for (let i = 0, len = match.length; i < len; i++) {
      result += tab;
    }

    return result;
  });
}

/**
 * Initialisation function of the plugin. This function is not called directly by clients, but is rather provided
 * to MarkdownIt's use function.
 * @param md The markdown it instance the plugin is being registered to
 * @param options The options this plugin is being initialised with
 */
export default (md: MarkdownIt, options: PrismPluginOptions = {}): void => {
  const config: PrismPluginOptions = {
    plugins: ['autolinker', 'show-invisibles', 'normalize-whitespace', 'diff-highlight'],
    init: () => {},
    defaultLanguageForUnknown: undefined,
    defaultLanguageForUnspecified: undefined,
    defaultLanguage: undefined,
    line_number: true,
    ...options
  };

  checkLanguageOption(config, 'defaultLanguage');
  checkLanguageOption(config, 'defaultLanguageForUnknown');
  checkLanguageOption(config, 'defaultLanguageForUnspecified');
  config.defaultLanguageForUnknown = config.defaultLanguageForUnknown || config.defaultLanguage;
  config.defaultLanguageForUnspecified = config.defaultLanguageForUnspecified || config.defaultLanguage;

  config.plugins?.forEach(loadPrismPlugin);

  Prism.hooks.add('wrap', function (env: any) {
    if (env.type == 'comment') {
      env.content = pangu.spacing(env.content);
    }
  });

  config.init?.(Prism);

  const defaultRenderer = md.renderer.rules.fence?.bind(md.renderer.rules);

  md.renderer.rules.fence = (tokens: Token[], idx: number, options: any, env: any, self: Renderer): string => {
    const token = tokens[idx];
    const info = token.info;
    const text = token.content.trim();
    const lang = info.trim().split(" ")[0];
    let code: string | null = null;

    const [langToUse, langShow, prismLang] = selectLanguage(config, lang);

    const {
      firstLine = 1,
      caption = '',
      mark = false,
      command = false
    } = getOptions(info.slice(lang.length));

    if (prismLang) {
      try {
        code = Prism.highlight(unescapeSwigTag(text), prismLang, langToUse);
      } catch (err: any) {
        console.warn(`[markdown-it-prism] failed to highlight code block with lang "${lang}". Error: ${err.message}`);
        code = escapeHTML(unescapeSwigTag(text));
      }
    } else if (lang == 'raw') {
      code = escapeHTML(pangu.spacing(unescapeSwigTag(text)));
    }

    if (code) {
      code = escapeSwigTag(code);
      const lines = code.split('\n');

      let content = '';

      for (let i = 0, len = lines.length; i < len; i++) {
        const line = lines[i];
        const lineno = Number(firstLine) + i;

        if (mark && (mark as number[]).includes(lineno)) {
          content += `<tr class="marked">`;
        } else {
          content += `<tr>`;
        }

        content += `<td data-num="${lineno}"></td>`;

        if (command) {
          content += `<td data-command="${(command as { [key: number]: string })[lineno] || ""}"></td>`;
        }

        content += `<td><pre>${line}</pre></td></tr>`;
      }

      let result = `<figure class="highlight${langToUse ? ` ${langToUse}` : ''}">`;
      result += `<figcaption data-lang="${langShow ? langShow : ''}">${caption}</figcaption>`;
      result += `<table>${content}</table></figure>`;

      return result;
    }

    if (lang == 'info') {
      return `<pre class="info"><code>${escapeHTML(pangu.spacing(unescapeSwigTag(text)))}</code></pre>`;
    } else {
      return defaultRenderer ? defaultRenderer(tokens, idx, options, env, self) : '';
    }
  };
};