import { readFileSync } from 'fs';
import { parse, TYPE } from '@formatjs/icu-messageformat-parser';
import { printAST } from '@formatjs/icu-messageformat-parser/printer';

import { getTranslation, expandTextByPercentage } from './utils';

function translateText(text, options) {
  let translatedText = getTranslation(text, options.strategy);
  if (options.expand) {
    translatedText = expandTextByPercentage(
      translatedText,
      options.expandPercentage
    );
  }

  return translatedText;
}

// Credit - https://github.com/1stdibs/icu-pseudo-translate/blob/master/src/index.js
function translateFromAST(elements, options) {
  for (const el of elements) {
    if (el.type === TYPE.literal) {
      el.value = translateText(el.value, options);
    }
    if (el.options) {
      for (const [key, option] of Object.entries(el.options)) {
        el.options[key].value = translateFromAST(option.value, options);
      }
    }
    if (el.children) {
      el.children = translateFromAST(el.children, options);
    }
  }
  return elements;
}

function translate(text, options) {
  const ast = parse(text);
  const translatedAST = translateFromAST(ast, options);
  const resultAST = printAST(translatedAST);

  let translatedText = resultAST;

  if (options.enableMarker) {
    const startMarker =
        options.strategy === 'bidi' ? '\u202e' : options.startMarker,
      endMarker = options.strategy === 'bidi' ? '\u202c' : options.endMarker;
    translatedText = `${startMarker}${translatedText}${endMarker}`;
  }
  return translatedText;
}

function transform(source, options) {
  if (typeof source === 'object') {
    let transformedObj = {};
    for (let [key, value] of Object.entries(source)) {
      transformedObj[key] = transform(value, options);
    }
    return transformedObj;
  } else if (typeof source === 'string') {
    return translate(source, options);
  } else {
    throw new Error('Translation source must either be string or an object');
  }
}

/**
 * Generate pseudo translation for a string or a JSON object
 * @param {string|object} source a string or JSON object to generate pseudo translation
 * @param {object} options options to configure pseudo translation
 * @param {boolean} [options.enableMarker=true] enable markers around the translated text to indicate sentence boundary
 * @param {string} [options.startMarker='['] start marker to prefix the translated text
 * @param {string} [options.endMarker=']'] end marker to suffix the translated text
 * @param {boolean} [options.expand=false] simulate expandsion of text by duplicating some words randomly
 * @param {number} [options.expandPercentage=30] percentage expansion of translated text
 * @param {accented|bidi} [options.strategy='accented'] strategy to follow while translating the text. Available strategies - accented & bidi (useful for RTL)
 * @returns {string|object} Pseudo translated string or JSON object containing psuedo translated texts
 */
function pseudoTranslate(source, options = {}) {
  return transform(
    source,
    Object.assign(
      {},
      {
        enableMarker: true,
        startMarker: '[',
        endMarker: ']',
        expand: false,
        expandPercentage: 30,
        strategy: 'accented'
      },
      options
    )
  );
}

/**
 * Generate pseudo translation for a JSON file
 * @param {string} source JSON file path
 * @param {object} options options to configure pseudo translation
 * @param {boolean} [options.enableMarker=true] enable markers around the translated text to indicate sentence boundary
 * @param {string} [options.startMarker='['] start marker to prefix the translated text
 * @param {string} [options.endMarker=']'] end marker to suffix the translated text
 * @param {boolean} [options.expand=false] simulate expandsion of text by duplicating some words randomly
 * @param {number} [options.expandPercentage=30] percentage expansion of translated text
 * @param {accented|bidi} [options.strategy='accented'] strategy to follow while translating the text. Available strategies - accented & bidi (useful for RTL)
 * @returns {object} A JSON object containing psuedo translated texts
 */
function pseudoTranslateJsonFile(source, options) {
  const data = readFileSync(source, 'utf8');
  return pseudoTranslate(JSON.parse(data), options);
}

export { pseudoTranslate, pseudoTranslateJsonFile };
