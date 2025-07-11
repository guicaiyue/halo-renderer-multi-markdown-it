import MarkdownIt from 'markdown-it';
import furigana from './lib/furigana';

interface FuriganaPluginOptions {
  fallbackParens?: string;
  extraSeparators?: string;
  extraCombinators?: string;
  [key: string]: any;
}

module.exports = function(md: MarkdownIt, options?: FuriganaPluginOptions): void {
  md.inline.ruler.before('emphasis', 'furigana', furigana(options));
};