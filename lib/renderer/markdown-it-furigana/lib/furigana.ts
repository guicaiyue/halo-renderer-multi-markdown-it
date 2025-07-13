"use strict";

import { parse, addTag } from "./ruby.js";

const kanaRegex = /[\u3040-\u3096\u30a1-\u30fa\uff66-\uff9f\u30fc]/;
const kanjiRegex = /[\u3400-\u9faf]/;

interface FuriganaOptions {
  fallbackParens?: string;
  extraSeparators?: string;
  extraCombinators?: string;
}

interface MatchResult {
  body: string;
  toptext: string;
  nextPos: number;
}

/**
 * Furigana is marked using the [body]{furigana} syntax.
 * First step, performed by bodyToRegex, is to convert
 * the body to a regex, which can then be used to pattern
 * match on the furigana.
 *
 * In essence, every kanji needs to be converted to a
 * pattern similar to ".?", so that it can match some kana
 * from the furigana part. However, this alone is ambiguous.
 * Consider {可愛い犬|かわいいいぬ}: in this case there are
 * three different ways to assign furigana in the body.
 *
 * Ambiguities can be resolved by adding separator characters
 * in the furigana. These are only matched at the
 * boundaries between kanji and other kanji/kana.
 * So a regex created from 可愛い犬 should be able to match
 * か・わい・い・いぬ, but a regex created from 美味しい shouldn't
 * be able to match おいし・い.
 *
 * For purposes of this function, only ASCII dot is a
 * separators. Other characters are converted to dots in
 * the {@link cleanFurigana} function.
 *
 * The notation {可愛い犬|か・わい・い・いぬ} forces us to
 * have separate \<rt\> tags for 可 and 愛. If we want to
 * indicate that か corresponds to 可 and わい corresponds to 愛
 * while keeping them under a single \<rt\> tag, we can use
 * a combinator instead of a separator, e.g.:
 * {可愛い犬|か+わい・い・いぬ}
 *
 * For purposes of this function, only ASCII plus is a
 * combinator. Other characters are converted to pluses in
 * the {@link cleanFurigana} function.
 *
 * @param body The non-furigana part.
 * @returns Null if the body contains no hiragana
 *     or kanji, otherwise a regex to be used on the furigana.
 */
function bodyToRegex(body: string): RegExp | null {
  let regexStr = "^";
  let lastType = "other";
  
  for (let i = 0; i < body.length; i++) {
    const char = body[i];
    let currentType: string;
    
    if (kanaRegex.test(char)) {
      currentType = "kana";
    } else if (kanjiRegex.test(char)) {
      currentType = "kanji";
    } else {
      currentType = "other";
    }
    
    if (currentType === "kanji") {
      if (lastType === "kanji" || lastType === "kana") {
        regexStr += "[・+]?";
      }
      regexStr += "([^・+]*?)";
    } else if (currentType === "kana") {
      if (lastType === "kanji" || lastType === "kana") {
        regexStr += "[・+]?";
      }
      regexStr += "(" + char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ")";
    }
    
    lastType = currentType;
  }
  
  regexStr += "$";
  
  if (regexStr === "^$") {
    return null;
  }
  
  return new RegExp(regexStr);
}

/**
 * Matches furigana against the body using the regex generated
 * by {@link bodyToRegex}.
 *
 * @param body The non-furigana part.
 * @param toptext The furigana part.
 * @param options Plugin options.
 * @returns Array of {body, toptext} pairs for each ruby tag.
 */
function matchFurigana(body: string, toptext: string, options: FuriganaOptions = {}): Array<{body: string, toptext: string}> {
  const regex = bodyToRegex(body);
  
  if (!regex) {
    return [{body, toptext}];
  }
  
  const cleanedToptext = cleanFurigana(toptext, options);
  const match = cleanedToptext.match(regex);
  
  if (!match) {
    return [{body, toptext}];
  }
  
  const result: Array<{body: string, toptext: string}> = [];
  let bodyIndex = 0;
  let groupIndex = 1;
  
  for (let i = 0; i < body.length; i++) {
    const char = body[i];
    
    if (kanjiRegex.test(char) || kanaRegex.test(char)) {
      const matchedText = match[groupIndex] || "";
      
      // Handle combinators
      if (matchedText.includes("+")) {
        const parts = matchedText.split("+");
        let combinedToptext = "";
        let combinedBody = "";
        
        for (const part of parts) {
          if (i < body.length) {
            combinedBody += body[i];
            combinedToptext += part;
            i++;
          }
        }
        i--; // Adjust for the outer loop increment
        
        result.push({body: combinedBody, toptext: combinedToptext});
      } else {
        result.push({body: char, toptext: matchedText});
      }
      
      groupIndex++;
    }
  }
  
  return result.length > 0 ? result : [{body, toptext}];
}

/**
 * Cleans the furigana by converting extra separators and combinators
 * to standard ones.
 *
 * @param furigana The furigana text.
 * @param options Plugin options.
 * @returns Cleaned furigana text.
 */
function cleanFurigana(furigana: string, options: FuriganaOptions = {}): string {
  let cleaned = furigana;
  
  if (options.extraSeparators) {
    for (const sep of options.extraSeparators) {
      cleaned = cleaned.replace(new RegExp(sep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '・');
    }
  }
  
  if (options.extraCombinators) {
    for (const comb of options.extraCombinators) {
      cleaned = cleaned.replace(new RegExp(comb.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '+');
    }
  }
  
  return cleaned;
}

/**
 * Fallback function that creates ruby tags for every character
 * when pattern matching fails.
 *
 * @param body The non-furigana part.
 * @param toptext The furigana part.
 * @returns Array of {body, toptext} pairs.
 */
function rubifyEveryCharacter(body: string, toptext: string): Array<{body: string, toptext: string}> {
  const result: Array<{body: string, toptext: string}> = [];
  const bodyChars = Array.from(body);
  const toptextChars = Array.from(toptext);
  
  for (let i = 0; i < Math.max(bodyChars.length, toptextChars.length); i++) {
    result.push({
      body: bodyChars[i] || "",
      toptext: toptextChars[i] || ""
    });
  }
  
  return result;
}

/**
 * Main furigana plugin function.
 *
 * @param options Plugin options.
 * @returns Markdown-it rule function.
 */
function furigana(options: FuriganaOptions = {}) {
  return function(state: any, silent: boolean) {
    return process(state, silent, options);
  };
}

/**
 * Processes the markdown state to find and convert furigana syntax.
 *
 * @param state Markdown-it inline state.
 * @param silent Whether to run in silent mode.
 * @param options Plugin options.
 * @returns Whether furigana was found and processed.
 */
function process(state: any, silent: boolean, options: FuriganaOptions): boolean {
  const parsed = parse(state);
  
  if (!parsed) {
    return false;
  }
  
  if (silent) {
    return true;
  }
  
  const matches = matchFurigana(parsed.body, parsed.toptext, options);
  
  for (const match of matches) {
    addTag(state, match, options.fallbackParens || "");
  }
  
  state.pos = parsed.nextPos;
  return true;
}

export default furigana;