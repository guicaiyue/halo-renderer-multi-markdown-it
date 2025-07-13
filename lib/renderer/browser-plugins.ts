import { PluginConfig } from '../../types/index.js';

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
import * as markdownItContainer from './markdown-it-container/index.js';
import * as markdownItFurigana from './markdown-it-furigana/index.js';
import * as markdownItKatex from './markdown-it-katex/index.js';
import * as markdownItPrism from './markdown-it-prism/index.js';
import * as markdownItChart from './markdown-it-chart/index.js';
import * as markdownItSpoiler from './markdown-it-spoiler/index.js';
import * as markdownItExcerpt from './markdown-it-excerpt/index.js';

// Create a browser-compatible version of the renderer
export const browserPlugins: PluginConfig[] = [
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
    { name: markdownItPrism },
    { name: markdownItChart },
    { name: markdownItSpoiler },
    { name: markdownItExcerpt },
];