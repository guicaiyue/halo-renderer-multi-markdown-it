"use strict";

interface ParseResult {
  body: string;
  toptext: string;
  nextPos: number;
}

interface MatchContent {
  body: string;
  toptext: string;
}

/**
 * Parses the {body^toptext} syntax and returns
 * the body and toptext parts. These are then processed
 * in furigana.js and turned into \<ruby\> tags by
 * the {@link addTag} function.
 *
 * @param state Markdown-it's inline state.
 * @returns Object containing body, toptext, and nextPos, or null if no match.
 */
export function parse(state: any): ParseResult | null {
  if (state.src.charCodeAt(state.pos) !== 0x7b /* { */) {
    return null;
  }

  let devPos: number | undefined;
  let closePos: number | undefined;
  const start = state.pos;

  state.pos = start + 1;

  while (state.pos < state.posMax) {
    if (devPos) {
      if (
        state.src.charCodeAt(state.pos) === 0x7D /* } */ &&
        state.src.charCodeAt(state.pos - 1) !== 0x5C /* \ */
      ) {
        closePos = state.pos;
        break;
      }
    } else if (
      state.src.charCodeAt(state.pos) === 0x5E /* ^ */ &&
      state.src.charCodeAt(state.pos - 1) !== 0x5C /* \ */
    ) {
      devPos = state.pos;
    }

    state.pos++;
  }

  if (!devPos || !closePos) {
    state.pos = start;
    return null;
  }

  const body = state.src.slice(start + 1, devPos)
    .replace(/\\\^/g, "^");
  
  const toptext = state.src.slice(devPos + 1, closePos)
    .replace(/\\\}/g, "}")
    .replace(/\\\^/g, "^");

  return {
    body,
    toptext,
    nextPos: closePos + 1
  };
}

/**
 * Adds ruby tags to the markdown-it token stream.
 *
 * @param state Markdown-it inline state.
 * @param content Object containing body and toptext.
 * @param fallbackParens Fallback parentheses style.
 */
export function addTag(state: any, content: MatchContent, fallbackParens: string = ""): void {
  const token_o = state.push('ruby_open', 'ruby', 1);
  const token_rb = state.push('ruby_base_open', 'rb', 1);
  
  const token_text = state.push('text', '', 0);
  token_text.content = content.body;
  
  state.push('ruby_base_close', 'rb', -1);
  
  const token_rt = state.push('ruby_text_open', 'rt', 1);
  
  const token_rt_text = state.push('text', '', 0);
  token_rt_text.content = content.toptext;
  
  state.push('ruby_text_close', 'rt', -1);
  state.push('ruby_close', 'ruby', -1);
  
  // Add fallback parentheses if specified
  if (fallbackParens) {
    const fallback_open = state.push('text', '', 0);
    fallback_open.content = fallbackParens.charAt(0) || '(';
    
    const fallback_text = state.push('text', '', 0);
    fallback_text.content = content.toptext;
    
    const fallback_close = state.push('text', '', 0);
    fallback_close.content = fallbackParens.charAt(1) || ')';
  }
}