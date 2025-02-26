import { countEmojis, getUniqueEmojis } from './emojiUtils';

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

// Estimate time to crack password (returns a string like "2 days" or "3 years")
export const estimateTimeToHack = (password: string): string => {
  const strength = calculatePasswordStrength(password);

  if (strength < 20) return 'instantly';
  if (strength < 30) return 'a few seconds';
  if (strength < 40) return 'a few minutes';
  if (strength < 50) return 'a few hours';
  if (strength < 60) return 'a few days';
  if (strength < 70) return 'a few weeks';
  if (strength < 80) return 'a few months';
  if (strength < 90) return 'a few years';
  return 'centuries';
};
