# pseudo-translate-icu

Generate **pseudo translations** for ICU message strings
> [Ɠḗƞḗřȧŧḗ ƥşḗŭḓǿ ŧřȧƞşŀȧŧīǿƞş ƒǿř ĪƇŬ ḿḗşşȧɠḗ şŧřīƞɠş]

## What is pseudo translation?

Pseudo translation is a technique used in internationalization/localization to test and prepare software for translation into other languages. It involves transforming the source text of an application into a simulated or "pseudo" foreign language before the actual translation process.

## Why use pseudo translation?

* **Identifying UI Issues**: Pseudo translation helps identify UI and layout issues that may arise when text is translated into languages with different character sets, lengths, or text directionality. It helps developers and designers discover issues such as text overflow, layout misalignment, or clipping.

* **String Extraction Validation**: It helps validate that all strings that need to be translated are properly extracted from the source code.

* **Placeholder Verification**: Pseudo translation helps ensure that placeholders for dynamic content (e.g., variables, data values) are correctly handled. It checks that placeholders are in the correct order and that they do not break the translated text.

* **Text Expansion Testing**: Different languages may require more space to express the same meaning. Pseudo translation simulates text expansion by adding extra characters, allowing developers to test whether the UI can accommodate longer text without layout issues.

* **Text Directionality Issues**: Languages have varying text directionality (e.g., left-to-right or right-to-left). Pseudo translation can include right-to-left characters to test the application's support for bidirectional text.

* **Localization Readiness**: Pseudo translation helps ensure that the application is ready for localization and internationalization. It's an early check to prevent localization issues from surfacing late in the development cycle.

* **Quality Assurance**: It serves as a quality assurance step by uncovering potential issues before the actual translation process. This can save time and resources by addressing problems early.

## Install

Install using yarn -
```sh
yarn add pseudo-translate-icu
```
or using npm
```sh
npm install pseudo-translate-icu
```
## Usage

### Import or require the module

```javascript
// Using ESM
import { pseudoTranslate, pseudoTranslateJsonFile } from 'pseudo-translate-icu';

// Using CJS
const { pseudoTranslate, pseudoTranslateJsonFile } = require('pseudo-translate-icu');
```

### Translating a string

Pseudo translate a string -
```javascript
import { pseudoTranslate } from 'pseudo-translate-icu';

const translatedText = pseudoTranslate('Hello {name}, Welcome to pseudo-translate-icu doc');

// Output
// translatedText: [Ħḗŀŀǿ {name}, Ẇḗŀƈǿḿḗ ŧǿ ƥşḗŭḓǿ-ŧřȧƞşŀȧŧḗ-īƈŭ ḓǿƈ]
// Notice the dynamic segment {name} is not touched. This dynamic variable resolution is usually called interpolation
```

### Translating a JSON object
```javascript
import { pseudoTranslate } from 'pseudo-translate-icu';

const texts = {
  welcome: 'Hello {name}, Welcome to pseudo-translate-icu doc',
  pluralization: 'Hi {name}, you have {numProducts, plural, =0 {no items} =1 {one item} other {# items}} in cart',
  pseudo: 'Generate pseudo translations for ICU message strings'
}

const translatedText = pseudoTranslate(texts);

// Output
// translatedText:
//{
//  welcome: '[Ħḗŀŀǿ {name}, Ẇḗŀƈǿḿḗ ŧǿ ƥşḗŭḓǿ-ŧřȧƞşŀȧŧḗ-īƈŭ ḓǿƈ]',
//  pluralization: '[Ħī {name}, ẏǿŭ ħȧṽḗ {numProducts,plural,=0{ƞǿ īŧḗḿş} =1{ǿƞḗ īŧḗḿ} other{# īŧḗḿş}} īƞ ƈȧřŧ]',
//  pseudo: '[Ɠḗƞḗřȧŧḗ ƥşḗŭḓǿ ŧřȧƞşŀȧŧīǿƞş ƒǿř ĪƇŬ ḿḗşşȧɠḗ şŧřīƞɠş]'
// }
```

### Translating a JSON file
It's possible to translate an entire JSON file as well -

```javascript
import { pseudoTranslateJsonFile } from 'pseudo-translate-icu';

const translatedText = pseudoTranslateJsonFile('..path/to/json/file');

// Output
// translatedText:
//{
//  "welcome": "[Ħḗŀŀǿ {name}, Ẇḗŀƈǿḿḗ ŧǿ ƥşḗŭḓǿ-ŧřȧƞşŀȧŧḗ-īƈŭ ḓǿƈ]",
//  "pluralization": "[Ħī {name}, ẏǿŭ ħȧṽḗ {numProducts,plural,=0{ƞǿ īŧḗḿş} =1{ǿƞḗ īŧḗḿ} other{# īŧḗḿş}} īƞ ƈȧřŧ]",
//  "pseudo": "[Ɠḗƞḗřȧŧḗ ƥşḗŭḓǿ ŧřȧƞşŀȧŧīǿƞş ƒǿř ĪƇŬ ḿḗşşȧɠḗ şŧřīƞɠş]"
// }
```

## Options
Both ```pseudoTranslate``` and ```pseudoTranslateJsonFile``` take a 2nd argument - ```options``` to customize the translation behavior

```javascript
pseudoTranslate(source: string | object, options: object)
pseudoTranslateJsonFile(sourcePath: string, options: object)
```

Options include -

### `enableMarker` - default (`true`)
By default translated texts are wrapped around ```[]``` to indicate the text boundary. You can disable the behavior by passing the option ```enableMarker: false```
```javascript
pseudoTranslate('Hello {name}, Welcome to pseudo-translate-icu doc',
{
  enableMarker: false
});

// Output - Ħḗŀŀǿ {name}, Ẇḗŀƈǿḿḗ ŧǿ ƥşḗŭḓǿ-ŧřȧƞşŀȧŧḗ-īƈŭ ḓǿƈ
```

### `startMarker` - default (`'['`) & `endMarker` - default (`']'`)
If marker is enabled then default ```startMarker``` is `[` & ```endMarker``` is `]`. But you can configure the start and end marker -
```javascript
pseudoTranslate('Hello {name}, Welcome to pseudo-translate-icu doc',
{
  startMarker: '<< ',
  endMarker: ' >>'
});

// Output - << Ħḗŀŀǿ {name}, Ẇḗŀƈǿḿḗ ŧǿ ƥşḗŭḓǿ-ŧřȧƞşŀȧŧḗ-īƈŭ ḓǿƈ >>
```

### `expand` - default (`false`) & `expandPercentage` - default (`30`)
Simulating text expansion is a crucial use case of pseudo translation. You can enable text expandsion by using the flag `expand: true`. By default 30% expandsion will happen, but you can configure the expansion percentage using the option `expandPercentage`.
Expansion works by randomly duplicating some words.
```javascript
pseudoTranslate('Hello {name}, Welcome to pseudo-translate-icu doc',
{
  expand: true
});

 // Output - [Ħḗŀŀǿ {name}, Ẇḗŀƈǿḿḗ Ẇḗŀƈǿḿḗ ŧǿ ƥşḗŭḓǿ-ŧřȧƞşŀȧŧḗ-īƈŭ ḓǿƈ]
```

### `strategy` - default (`'accented'`)

2 strategies for pseudo translations are supported -

* **accented** - In Accented English all Latin letters are replaced by accented Unicode counterparts which don't impair the readability of the content. This allows developers to quickly test if any given string is being correctly displayed in its 'translated' form. This is the default strategy and so far all examples use `accented` strategy.

* **bidi** - Bidi English is a fake RTL locale.  All words are surrounded by Unicode formatting marks forcing the RTL directionality of characters. In addition, to make the reversed text easier to read, individual letters are flipped.
To set `bidi` strategy -
```javascript
pseudoTranslate('Welcome to pseudo-translate-icu doc',
{
  strategy: 'bidi'
});

// Output - ‮Mǝʅɔoɯǝ ʇo dsǝnpo-ʇɹɐusʅɐʇǝ-ıɔn poɔ‬
```

### `i18nextTrans` - default (`false`)
If you are using `react-i18next` with ICU, you will encounter situations where you need to externalize HTML elements. For react-i18next, the recommended method is [Trans component](https://react.i18next.com/latest/trans-component).
But the resultant string of Trans component is not compatible with ICU parser. And you may recieve an error ```SyntaxError: UNMATCHED_CLOSING_TAG```
To get around the problem, use the option ```i18nextTrans: true```.

## Credits

* The accented & bidi strategy is picked from the [mozilla code](https://hg.mozilla.org/mozreview/gecko/rev/a96cf6ff334617c3d51e325ece5f27eaa0fefac9)
* I only built this library as [icu-pseudo-translate](https://github.com/1stdibs/icu-pseudo-translate) could not meet many of my requirements. But I picked up the core parsing logic from the library.
