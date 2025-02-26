import { countEmojis, getUniqueEmojis, isEmoji } from './emojiUtils';

// Calculate password strength on a scale of 0-100
export const calculatePasswordStrength = (password: string): number => {
  if (!password) return 0;

  // Base score starts at 0
  let strength = 0;

  // Length contribution (up to 30 points)
  strength += Math.min(30, password.length * 3);

  // Character variety contribution (up to 30 points)
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasDigits = /\d/.test(password);
  const hasSpecialChars =
    /[^a-zA-Z0-9\p{Emoji_Presentation}\p{Extended_Pictographic}]/u.test(
      password
    );

  if (hasLowercase) strength += 7;
  if (hasUppercase) strength += 7;
  if (hasDigits) strength += 7;
  if (hasSpecialChars) strength += 9;

  // Emoji contribution (up to 40 points)
  const emojiCount = countEmojis(password);
  const uniqueEmojis = getUniqueEmojis(password);

  // Each emoji adds 5 points (up to 25)
  strength += Math.min(25, emojiCount * 5);

  // Bonus for unique emojis (up to 15)
  strength += Math.min(15, uniqueEmojis.length * 3);

  // Ensure maximum is 100
  return Math.min(100, strength);
};

// Calculate password entropy in bits
export const calculatePasswordEntropy = (password: string): number => {
  if (!password) return 0;

  // Calculate entropy separately for text and emoji parts
  let textEntropy = 0;
  let emojiEntropy = 0;

  // Count character types in the text portion
  let hasLowercase = false;
  let hasUppercase = false;
  let hasDigits = false;
  let hasSpecialChars = false;
  let textLength = 0;
  let emojiLength = 0;

  // Analyze each character
  for (let i = 0; i < password.length; i++) {
    const char = password[i];

    if (isEmoji(char)) {
      emojiLength++;
    } else {
      textLength++;
      if (/[a-z]/.test(char)) hasLowercase = true;
      if (/[A-Z]/.test(char)) hasUppercase = true;
      if (/\d/.test(char)) hasDigits = true;
      if (/[^a-zA-Z0-9]/.test(char)) hasSpecialChars = true;
    }
  }

  // Determine size of character pools
  let textPoolSize = 0;
  if (hasLowercase) textPoolSize += 26;
  if (hasUppercase) textPoolSize += 26;
  if (hasDigits) textPoolSize += 10;
  if (hasSpecialChars) textPoolSize += 32; // Approximate number of common special characters

  // If there are no text characters, don't contribute to entropy
  if (textLength > 0 && textPoolSize > 0) {
    textEntropy = textLength * Math.log2(textPoolSize);
  }

  // For emojis, we use a conservative estimate of available emojis
  // Unicode 14.0 has approximately 3,633 emojis
  const emojiPoolSize = 3633;

  if (emojiLength > 0) {
    emojiEntropy = emojiLength * Math.log2(emojiPoolSize);
  }

  // Total entropy is the sum
  return textEntropy + emojiEntropy;
};

// Get human-readable description of entropy strength
export const getEntropyDescription = (entropy: number): string => {
  if (entropy < 28) return 'Very Weak (vulnerable to instant attacks)';
  if (entropy < 36) return 'Weak (vulnerable to modern hardware)';
  if (entropy < 60) return 'Reasonable (secure against most attacks)';
  if (entropy < 80) return 'Strong (secure against targeted attacks)';
  if (entropy < 100) return 'Very Strong (secure against nation-state actors)';
  return 'Extremely Strong (virtually unbreakable with current technology)';
};

// Estimate time to crack based on entropy
export const estimateTimeToCrack = (entropy: number): string => {
  // Based on 10 billion guesses per second (powerful attacker)
  const seconds = Math.pow(2, entropy) / 10000000000;

  if (seconds < 1) return 'Instantly';
  if (seconds < 60) return `${Math.round(seconds)} seconds`;

  const minutes = seconds / 60;
  if (minutes < 60) return `${Math.round(minutes)} minutes`;

  const hours = minutes / 60;
  if (hours < 24) return `${Math.round(hours)} hours`;

  const days = hours / 24;
  if (days < 365) return `${Math.round(days)} days`;

  const years = days / 365;
  if (years < 1000) return `${Math.round(years)} years`;
  if (years < 1000000) return `${Math.round(years / 1000)}k years`;
  if (years < 1000000000) return `${Math.round(years / 1000000)}M years`;

  return 'Billions of years+';
};
