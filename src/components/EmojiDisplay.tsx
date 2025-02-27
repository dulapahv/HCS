import React, { useEffect, useState } from 'react';
import twemoji from 'twemoji';
import GraphemeSplitter from 'grapheme-splitter';

interface EmojiDisplayProps {
  text: string;
  className?: string;
}

const EmojiDisplay: React.FC<EmojiDisplayProps> = ({
  text,
  className = '',
}) => {
  const [html, setHtml] = useState<string>('');

  useEffect(() => {
    // Parse text and replace emojis with Twemoji images
    const parsedHtml = twemoji.parse(text, {
      folder: 'svg',
      ext: '.svg',
      className: 'twemoji', // Add class to emojis for styling
      base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/',
    });

    setHtml(parsedHtml);
  }, [text]);

  return (
    <span
      className={`inline-block ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

// For rendering individual emojis in the emoji keyboard
export const EmojiButton: React.FC<{
  emoji: string;
  onClick: (emoji: string) => void;
  className?: string;
}> = ({ emoji, onClick, className = '' }) => {
  const [html, setHtml] = useState<string>('');

  useEffect(() => {
    // Parse emoji and replace with Twemoji image
    const parsedHtml = twemoji.parse(emoji, {
      folder: 'svg',
      ext: '.svg',
      className: 'twemoji-btn', // Add class to emojis for styling
      base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/',
    });

    setHtml(parsedHtml);
  }, [emoji]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick(emoji);
  };

  return (
    <button
      type='button'
      className={`p-2 cursor-pointer rounded transition-all hover:bg-blue-100 active:bg-blue-200 flex items-center justify-center size-9 aspect-square ${className}`}
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

// Split text into array of characters, properly handling emoji sequences
export const splitTextWithEmojis = (text: string): string[] => {
  const splitter = new GraphemeSplitter();
  return splitter.splitGraphemes(text);
};

export default EmojiDisplay;
