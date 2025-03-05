import GraphemeSplitter from 'grapheme-splitter';

// Calculate Levenshtein distance between two strings, handling emojis correctly
export const calculateLevenshteinDistance = (
  str1: string,
  str2: string
): number => {
  // Split strings into graphemes (visual characters) to properly handle emojis
  const splitter = new GraphemeSplitter();
  const s1 = splitter.splitGraphemes(str1);
  const s2 = splitter.splitGraphemes(str2);

  // Create matrix
  const matrix: number[][] = [];

  // Initialize first row
  for (let i = 0; i <= s2.length; i++) {
    matrix[0] = matrix[0] || [];
    matrix[0][i] = i;
  }

  // Initialize first column
  for (let i = 1; i <= s1.length; i++) {
    matrix[i] = matrix[i] || [];
    matrix[i][0] = i;
  }

  // Fill in the rest of the matrix
  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }

  return matrix[s1.length][s2.length];
};

// Calculate similarity percentage based on Levenshtein distance
export const calculateSimilarity = (str1: string, str2: string): number => {
  const splitter = new GraphemeSplitter();
  const s1 = splitter.splitGraphemes(str1);
  const s2 = splitter.splitGraphemes(str2);

  const maxLength = Math.max(s1.length, s2.length);
  if (maxLength === 0) return 100; // Both strings are empty

  const distance = calculateLevenshteinDistance(str1, str2);
  return Math.round(((maxLength - distance) / maxLength) * 100);
};

// Get the minimum Levenshtein distance from multiple attempts
export const getMinLevenshteinDistance = (
  target: string,
  attempts: string[]
): number => {
  if (!attempts.length) return -1;

  return Math.min(
    ...attempts.map((attempt) => calculateLevenshteinDistance(target, attempt))
  );
};
