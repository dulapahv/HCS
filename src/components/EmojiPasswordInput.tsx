import { useState, useRef, useEffect, useMemo } from 'react';
import GraphemeSplitter from 'grapheme-splitter';
import EmojiPicker from './EmojiPicker';
import twemoji from 'twemoji';

interface EmojiPasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hideRecentEmojis?: boolean;
}

const EmojiPasswordInput = ({
  value,
  onChange,
  placeholder = 'Password',
  hideRecentEmojis = false,
}: EmojiPasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const splitter = new GraphemeSplitter();

  const maskedValue = useMemo(
    () =>
      splitter
        .splitGraphemes(value)
        .map(() => '•')
        .join(''),
    [value]
  );

  const renderEmojiWithTwemoji = (text: string) => {
    return {
      __html: twemoji.parse(text, {
        folder: 'svg',
        ext: '.svg',
        className: 'inline-block h-8',
        base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/',
      }),
    };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleToggleShowPassword = () => {
    const input = inputRef.current;
    if (!input) return;

    const currentCursorPos = input.selectionStart ?? 0;
    const willShow = !showPassword;

    setShowPassword(willShow);

    setTimeout(() => {
      if (inputRef.current) {
        if (willShow) {
          const codeUnitPos = getCodeUnitOffset(value, currentCursorPos);
          inputRef.current.setSelectionRange(codeUnitPos, codeUnitPos);
        } else {
          const graphemePos = getGraphemeIndexFromOffset(
            value,
            currentCursorPos
          );
          inputRef.current.setSelectionRange(graphemePos, graphemePos);
        }
      }
    }, 0);
  };

  const toggleEmojiPicker = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowEmojiPicker(!showEmojiPicker);
    if (!showEmojiPicker && inputRef.current) {
      inputRef.current.blur();
    }
  };

  const getCodeUnitOffset = (text: string, graphemeIndex: number): number => {
    const graphemes = splitter.splitGraphemes(text);
    let offset = 0;
    for (let i = 0; i < Math.min(graphemeIndex, graphemes.length); i++) {
      offset += graphemes[i].length;
    }
    return offset;
  };

  const getGraphemeIndexFromOffset = (text: string, offset: number): number => {
    const graphemes = splitter.splitGraphemes(text);
    let currentOffset = 0;
    for (let i = 0; i < graphemes.length; i++) {
      currentOffset += graphemes[i].length;
      if (currentOffset > offset) {
        return i;
      }
    }
    return graphemes.length;
  };

  const handleEmojiSelect = (emoji: string) => {
    const input = inputRef.current;
    if (!input) return;

    const pos = input.selectionStart ?? value.length;
    const graphemePos = showPassword
      ? getGraphemeIndexFromOffset(value, pos)
      : pos;

    const graphemes = splitter.splitGraphemes(value);
    const newGraphemes = [
      ...graphemes.slice(0, graphemePos),
      emoji,
      ...graphemes.slice(graphemePos),
    ];
    onChange(newGraphemes.join(''));

    setTimeout(() => {
      if (inputRef.current) {
        const newPos = graphemePos + 1;
        if (showPassword) {
          const newOffset = getCodeUnitOffset(newGraphemes.join(''), newPos);
          inputRef.current.setSelectionRange(newOffset, newOffset);
        } else {
          inputRef.current.setSelectionRange(newPos, newPos);
        }
      }
    }, 0);
  };

  useEffect(() => {
    const input = inputRef.current;
    if (!input || showPassword) return;

    const handleBeforeInput = (event: InputEvent) => {
      event.preventDefault();
      const start = input.selectionStart ?? 0;
      const end = input.selectionEnd ?? 0;
      let newPassword = value;
      let newPos = start;

      const codeUnitStart = getCodeUnitOffset(value, start);
      const codeUnitEnd = getCodeUnitOffset(value, end);

      if (
        event.inputType === 'insertText' ||
        event.inputType === 'insertFromPaste'
      ) {
        const data = event.data || '';
        newPassword =
          value.slice(0, codeUnitStart) + data + value.slice(codeUnitEnd);
        newPos = start + splitter.countGraphemes(data);
      } else if (event.inputType === 'deleteContentBackward') {
        if (start === end && start > 0) {
          const prevGraphemeStart = getCodeUnitOffset(value, start - 1);
          newPassword =
            value.slice(0, prevGraphemeStart) + value.slice(codeUnitStart);
          newPos = start - 1;
        } else {
          newPassword =
            value.slice(0, codeUnitStart) + value.slice(codeUnitEnd);
          newPos = start;
        }
      } else if (event.inputType === 'deleteContentForward') {
        if (start === end && start < splitter.countGraphemes(value)) {
          const nextGraphemeEnd = getCodeUnitOffset(value, start + 1);
          newPassword =
            value.slice(0, codeUnitStart) + value.slice(nextGraphemeEnd);
          newPos = start;
        } else {
          newPassword =
            value.slice(0, codeUnitStart) + value.slice(codeUnitEnd);
          newPos = start;
        }
      }

      onChange(newPassword);

      setTimeout(() => {
        input.setSelectionRange(newPos, newPos);
      }, 0);
    };

    input.addEventListener('beforeinput', handleBeforeInput);
    return () => input.removeEventListener('beforeinput', handleBeforeInput);
  }, [showPassword, value, onChange]);

  return (
    <div className='mb-2 relative'>
      <div className='flex border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500'>
        <input
          ref={inputRef}
          type='text'
          value={showPassword ? value : maskedValue}
          onChange={showPassword ? handleInputChange : () => {}}
          placeholder={placeholder}
          className='w-full py-2 px-3 focus:outline-none'
          style={{ fontFamily: 'monospace', whiteSpace: 'nowrap' }}
        />
        <button
          type='button'
          className={`px-2 ${
            showEmojiPicker ? 'bg-blue-100' : 'hover:bg-gray-100'
          }`}
          onClick={toggleEmojiPicker}
        >
          <span
            dangerouslySetInnerHTML={renderEmojiWithTwemoji('🙂')}
            className='size-5'
          />
        </button>
        <button
          type='button'
          className='px-2 hover:bg-gray-100'
          onClick={handleToggleShowPassword}
        >
          <span
            dangerouslySetInnerHTML={renderEmojiWithTwemoji(
              showPassword ? '👁️' : '🕶️'
            )}
            className='size-5'
          />
        </button>
      </div>

      {showEmojiPicker && (
        <div className='absolute z-10 mt-1 w-full'>
          <EmojiPicker
            onEmojiSelect={handleEmojiSelect}
            onClose={() => setShowEmojiPicker(false)}
            hideRecentEmojis={hideRecentEmojis}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPasswordInput;
