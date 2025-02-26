// Common emojis grouped by category
export const commonEmojis = [
  // Smileys
  '😀',
  '😁',
  '😂',
  '🤣',
  '😃',
  '😄',
  '😅',
  '😆',
  '😉',
  '😊',
  '😋',
  '😎',
  '😍',
  '🥰',
  '😘',
  '😗',
  '😙',
  '😚',
  '🙂',
  '🤔',

  // People
  '👋',
  '👌',
  '✌️',
  '🤞',
  '👍',
  '👎',
  '✊',
  '👊',
  '🤲',
  '👐',

  // Animals
  '🐶',
  '🐱',
  '🐭',
  '🐹',
  '🐰',
  '🦊',
  '🐻',
  '🐼',
  '🐨',
  '🦁',

  // Food
  '🍎',
  '🍐',
  '🍊',
  '🍋',
  '🍌',
  '🍉',
  '🍇',
  '🍓',
  '🍒',
  '🍑',

  // Travel & Places
  '🚗',
  '🚕',
  '🚙',
  '🚌',
  '🚎',
  '🏠',
  '🏢',
  '🏨',
  '🏫',
  '⛪',

  // Activities
  '⚽',
  '🏀',
  '🏈',
  '⚾',
  '🎾',
  '🏐',
  '🏉',
  '🎱',
  '🏓',
  '🏸',

  // Objects
  '💻',
  '📱',
  '💰',
  '💎',
  '🔑',
  '🔒',
  '🔨',
  '📚',
  '🎁',
  '📦',

  // Symbols
  '❤️',
  '💔',
  '💯',
  '✅',
  '❌',
  '⭐',
  '🔴',
  '🟢',
  '🔵',
  '⚫',
];

// Function to count emojis in a string
export const countEmojis = (str: string): number => {
  // This regex will match most emoji characters
  const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
  const matches = str.match(emojiRegex);
  return matches ? matches.length : 0;
};

// Function to check if a character is an emoji
export const isEmoji = (char: string): boolean => {
  const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u;
  return emojiRegex.test(char);
};

// Function to get unique emojis in a string
export const getUniqueEmojis = (str: string): string[] => {
  const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
  const matches = str.match(emojiRegex) || [];
  return [...new Set(matches)];
};
