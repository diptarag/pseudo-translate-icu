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

function pseudoTranslate(source, options = {}) {
  return transform(
    source,
    Object.assign(
      {},
      {
        enableMarker: true,
        startMarker: '[',
        endMarker: ']',
        exapnd: false,
        expandPercentage: 30,
        strategy: 'accented'
      },
      options
    )
  );
}

function pseudoTranslateJsonFile(source, options) {
  const data = readFileSync(source, 'utf8');
  return pseudoTranslate(JSON.parse(data), options);
}

export { pseudoTranslate, pseudoTranslateJsonFile };
