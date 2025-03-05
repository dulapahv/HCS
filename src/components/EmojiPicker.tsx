import { useRef, useEffect, useState, useMemo } from 'react';
import { commonEmojis, emojiCategories } from '../utils/emojiUtils';
import { EmojiButton } from './EmojiDisplay';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
  hideRecentEmojis?: boolean; // Added prop to control recent emojis visibility
}

const EmojiPicker = ({
  onEmojiSelect,
  onClose,
  hideRecentEmojis = false, // Default to false for backward compatibility
}: EmojiPickerProps) => {
  const pickerRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<string>(
    hideRecentEmojis ? 'faces' : 'recent'
  );

  // Close the picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Recently used emojis (could be stored in localStorage)
  const recentEmojis = useMemo(() => {
    if (hideRecentEmojis) return [];

    const stored = localStorage.getItem('recentEmojis');
    if (stored) {
      try {
        return JSON.parse(stored).slice(0, 20);
      } catch (e) {
        console.error('Error parsing recent emojis:', e);
        return commonEmojis.slice(0, 20);
      }
    }
    return commonEmojis.slice(0, 20);
  }, [hideRecentEmojis]);

  const addToRecentEmojis = (emoji: string) => {
    if (hideRecentEmojis) return;

    const stored = localStorage.getItem('recentEmojis');
    let recent = [];

    if (stored) {
      try {
        recent = JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing recent emojis:', e);
        recent = [];
      }
    }

    // Add to front of array and remove duplicates
    recent = [emoji, ...recent.filter((e: string) => e !== emoji)].slice(0, 30);
    localStorage.setItem('recentEmojis', JSON.stringify(recent));
  };

  // Handler for emoji selection
  const handleEmojiSelect = (emoji: string) => {
    if (!hideRecentEmojis) {
      addToRecentEmojis(emoji);
    }
    onEmojiSelect(emoji);
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  // Get emojis for the current category
  const currentEmojis = useMemo(() => {
    if (activeCategory === 'recent' && !hideRecentEmojis) {
      return recentEmojis;
    }
    return (
      emojiCategories[activeCategory as keyof typeof emojiCategories] ||
      commonEmojis
    );
  }, [activeCategory, recentEmojis, hideRecentEmojis]);

  return (
    <div
      ref={pickerRef}
      className='bg-white border border-gray-300 rounded-lg shadow-lg p-2 w-full max-h-60 overflow-y-auto'
      onClick={(e) => e.stopPropagation()}
    >
      {/* Category tabs */}
      <div className='flex border-b mb-2 pb-1 overflow-x-auto'>
        {!hideRecentEmojis && (
          <button
            type='button'
            className={`p-1 mr-1 rounded text-sm flex-shrink-0 ${
              activeCategory === 'recent'
                ? 'bg-blue-100 font-medium'
                : 'hover:bg-gray-100'
            }`}
            onClick={() => handleCategoryChange('recent')}
          >
            Recent
          </button>
        )}
        {Object.keys(emojiCategories).map((category) => (
          <button
            type='button'
            key={category}
            className={`p-1 mx-1 rounded text-sm flex-shrink-0 ${
              activeCategory === category
                ? 'bg-blue-100 font-medium'
                : 'hover:bg-gray-100'
            }`}
            onClick={() => handleCategoryChange(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Emoji grid */}
      <div className='grid grid-cols-10 gap-1'>
        {currentEmojis.map((emoji: string, index: number) => (
          <EmojiButton key={index} emoji={emoji} onClick={handleEmojiSelect} />
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;
