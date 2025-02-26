import { useState, useRef } from 'react';
import EmojiPicker from './EmojiPicker';

interface EmojiPasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const EmojiPasswordInput = ({
  value,
  onChange,
  placeholder = 'Password',
}: EmojiPasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEmojiSelect = (emoji: string) => {
    const newValue = value + emoji;
    onChange(newValue);
    // Keep the picker open to allow multiple emoji selection
    inputRef.current?.focus();
  };

  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const toggleEmojiPicker = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any default action
    e.stopPropagation(); // Stop event bubbling
    if (!showEmojiPicker) {
      // When opening the picker, blur the input to hide keyboard
      inputRef.current?.blur();
    }
    setShowEmojiPicker(!showEmojiPicker);
  };

  return (
    <div className='mb-2 relative'>
      <div className='flex border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-50 focus-within:border-blue-500'>
        <input
          ref={inputRef}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className='w-full py-2 px-3 focus:outline-none'
        />
        <button
          type='button'
          className='px-3 flex items-center justify-center hover:bg-gray-100 transition-colors'
          onClick={toggleEmojiPicker}
          title='Add emoji'
        >
          😊
        </button>
        <button
          type='button'
          className='px-3 flex items-center justify-center hover:bg-gray-100 transition-colors'
          onClick={handleToggleShowPassword}
          title={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? '👁️' : '👁️‍🗨️'}
        </button>
      </div>

      {showEmojiPicker && (
        <div className='absolute z-10 mt-1 w-full'>
          <EmojiPicker
            onEmojiSelect={handleEmojiSelect}
            onClose={() => setShowEmojiPicker(false)}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPasswordInput;
