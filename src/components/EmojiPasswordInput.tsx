import { useState, useRef, useEffect, useMemo } from "react";
import EmojiPicker from "./EmojiPicker";
import GraphemeSplitter from "grapheme-splitter";

interface EmojiPasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const EmojiPasswordInput = ({
  value,
  onChange,
  placeholder = "Password",
}: EmojiPasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const splitter = new GraphemeSplitter();

  // Compute masked value: one '•' per grapheme
  const maskedValue = useMemo(
    () =>
      splitter
        .splitGraphemes(value)
        .map(() => "•")
        .join(""),
    [value]
  );

  // Handle input changes when password is shown
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // Toggle password visibility
  const handleToggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  // Toggle emoji picker
  const toggleEmojiPicker = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!showEmojiPicker) {
      inputRef.current?.blur();
    }
    setShowEmojiPicker(!showEmojiPicker);
  };

  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    const pos = inputRef.current?.selectionStart ?? 0;
    const graphemes = splitter.splitGraphemes(value);
    const newGraphemes = [
      ...graphemes.slice(0, pos),
      emoji,
      ...graphemes.slice(pos),
    ];
    const newValue = newGraphemes.join("");
    onChange(newValue);

    if (!showPassword) {
      const newMasked = splitter
        .splitGraphemes(newValue)
        .map(() => "•")
        .join("");
      if (inputRef.current) {
        inputRef.current.value = newMasked;
        setTimeout(() => {
          inputRef.current?.setSelectionRange(pos + 1, pos + 1);
        }, 0);
      }
    } else {
      setTimeout(() => {
        const newPos = value.slice(0, pos).length + emoji.length;
        inputRef.current?.setSelectionRange(newPos, newPos);
      }, 0);
    }
    inputRef.current?.focus();
  };

  // Helper to get code unit offset for a grapheme index
  const getCodeUnitOffset = (text: string, graphemeIndex: number): number => {
    const graphemes = splitter.splitGraphemes(text);
    let offset = 0;
    for (let i = 0; i < Math.min(graphemeIndex, graphemes.length); i++) {
      offset += graphemes[i].length;
    }
    return offset;
  };

  // Handle input events when password is hidden
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handleBeforeInput = (event: InputEvent) => {
      if (showPassword) return; // Let default behavior handle when shown

      event.preventDefault();
      const start = input.selectionStart ?? 0;
      const end = input.selectionEnd ?? 0;
      let newPassword = value;
      let newPos = start;

      const codeUnitStart = getCodeUnitOffset(value, start);
      const codeUnitEnd = getCodeUnitOffset(value, end);

      if (
        event.inputType === "insertText" ||
        event.inputType === "insertFromPaste"
      ) {
        const data = event.data || "";
        newPassword =
          value.slice(0, codeUnitStart) + data + value.slice(codeUnitEnd);
        newPos = start + splitter.countGraphemes(data);
      } else if (event.inputType === "deleteContentBackward") {
        if (start === end) {
          if (start > 0) {
            const prevGraphemeStart = getCodeUnitOffset(value, start - 1);
            newPassword =
              value.slice(0, prevGraphemeStart) + value.slice(codeUnitStart);
            newPos = start - 1;
          }
        } else {
          newPassword =
            value.slice(0, codeUnitStart) + value.slice(codeUnitEnd);
          newPos = start;
        }
      } else if (event.inputType === "deleteContentForward") {
        if (start === end) {
          if (start < splitter.countGraphemes(value)) {
            const nextGraphemeEnd = getCodeUnitOffset(value, start + 1);
            newPassword =
              value.slice(0, codeUnitStart) + value.slice(nextGraphemeEnd);
            newPos = start;
          }
        } else {
          newPassword =
            value.slice(0, codeUnitStart) + value.slice(codeUnitEnd);
          newPos = start;
        }
      }

      onChange(newPassword);
      const newMasked = splitter
        .splitGraphemes(newPassword)
        .map(() => "•")
        .join("");
      input.value = newMasked;
      setTimeout(() => {
        input.setSelectionRange(newPos, newPos);
      }, 0);
    };

    input.addEventListener("beforeinput", handleBeforeInput);
    return () => input.removeEventListener("beforeinput", handleBeforeInput);
  }, [showPassword, value, onChange]);

  // Update input value and cursor when showPassword toggles
  useEffect(() => {
    if (inputRef.current) {
      const graphemeCount = splitter.countGraphemes(value);
      inputRef.current.value = showPassword ? value : maskedValue;
      const pos = showPassword ? value.length : graphemeCount;
      inputRef.current.setSelectionRange(pos, pos);
    }
  }, [showPassword, value, maskedValue]);

  return (
    <div className="mb-2 relative">
      <div className="flex border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-50 focus-within:border-blue-500">
        <input
          ref={inputRef}
          type="text"
          value={showPassword ? value : maskedValue}
          onChange={showPassword ? handleInputChange : () => {}}
          placeholder={placeholder}
          className="w-full py-2 px-3 focus:outline-none"
          style={{ fontFamily: "monospace", whiteSpace: "nowrap" }}
        />
        <button
          type="button"
          className="px-3 flex items-center justify-center hover:bg-gray-100 transition-colors"
          onClick={toggleEmojiPicker}
          title="Add emoji"
        >
          😊
        </button>
        <button
          type="button"
          className="px-3 flex items-center justify-center hover:bg-gray-100 transition-colors"
          onClick={handleToggleShowPassword}
          title={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? "👁️" : "👁️‍🗨️"}
        </button>
      </div>

      {showEmojiPicker && (
        <div className="absolute z-10 mt-1 w-full">
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
