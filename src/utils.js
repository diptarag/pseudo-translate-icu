import { ACCENTED_MAP, BIDI_MAP } from './characterMaps';

function getTranslation(text, strategy) {
  const charMap = strategy === 'bidi' ? BIDI_MAP : ACCENTED_MAP;
  return text
    .split('')
    .map((char) => {
      let mappedChar = charMap[char];
      return mappedChar || char;
    })
    .join('');
}

function expandTextByPercentage(text, percentage) {
  // Split the text into words
  const words = text.split(' ');

  // Calculate the number of words to add
  const wordsToAdd = Math.floor(words.length * (percentage / 100));

  // Duplicate words in the original text
  for (let i = 0; i < wordsToAdd; i++) {
    const randomIndex = Math.floor(Math.random() * words.length); // Randomly select a word
    const wordToDuplicate = words[randomIndex];
    words.splice(randomIndex, 0, wordToDuplicate); // Duplicate the word
  }

  // Join the expanded words back together
  const expandedText = words.join(' ');

  return expandedText;
}

export { getTranslation, expandTextByPercentage };
