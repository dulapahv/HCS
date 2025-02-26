import { useRef, useEffect } from 'react';
import { commonEmojis } from '../utils/emojiUtils';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}

const EmojiPicker = ({ onEmojiSelect, onClose }: EmojiPickerProps) => {
  const pickerRef = useRef<HTMLDivElement>(null);

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

  const handleEmojiClick = (emoji: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEmojiSelect(emoji);
  };

  return (
    <div
      ref={pickerRef}
      className='bg-white border border-gray-300 rounded-lg shadow-lg p-2 w-full max-h-60 overflow-y-auto'
    >
      <div className='grid grid-cols-10 gap-1'>
        {commonEmojis.map((emoji, index) => (
          <button
            key={index}
            className='p-2 text-xl cursor-pointer rounded transition-all hover:bg-blue-100 hover:scale-110 active:bg-blue-200'
            onClick={(e) => handleEmojiClick(emoji, e)}
            title={`Add ${emoji} emoji`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;
