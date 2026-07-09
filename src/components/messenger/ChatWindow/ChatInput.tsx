import { useState, type KeyboardEvent, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Image, Smile, ThumbsUp, SendHorizonal } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import TextareaAutosize from "react-textarea-autosize";
import EmojiPicker from "emoji-picker-react";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onTypingChange?: (isTyping: boolean) => void;
}

export default function ChatInput({ onSendMessage, onTypingChange }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (onTypingChange) {
      console.log("ChatInput: onTypingChange called with", isTyping);
      onTypingChange(isTyping);
    }
  }, [isTyping, onTypingChange]);

  const handleChange = (val: string) => {
    setMessage(val);

    if (!isTyping && val.trim() !== "") {
      setIsTyping(true);
    }

    if (val.trim() === "") {
      setIsTyping(false);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      return;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
      setIsEmojiOpen(false);
      setIsTyping(false);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = (emojiObject: any) => {
    setMessage((prev) => prev + emojiObject.emoji);
  };

  return (
    <div className="flex shrink-0 items-center gap-2 border-t border-border px-4 py-3">
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="size-9 rounded-full text-primary">
          <Plus className="size-5" />
        </Button>
        <Button variant="ghost" size="icon" className="size-9 rounded-full text-primary">
          <Image className="size-5" />
        </Button>
      </div>

      <div className="flex flex-1 items-center gap-2">
        <div className="flex-1 rounded-3xl bg-secondary px-4 py-1 outline-1 outline-transparent focus-within:outline-blue-500">
          <TextareaAutosize
            minRows={1}
            maxRows={5}
            placeholder="Nhập tin nhắn..."
            value={message}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-6 w-full resize-none overflow-y-auto border-none bg-transparent pt-2 outline-none"
          />
        </div>
        <div className="flex items-center">
          <Popover open={isEmojiOpen} onOpenChange={setIsEmojiOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex size-9 items-center justify-center rounded-full"
              >
                <Smile className="text-primary" />
              </button>
            </PopoverTrigger>

            <PopoverContent
              side="top"
              align="end"
              className="w-auto border-none bg-transparent p-0 shadow-none"
            >
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {message.trim() ? (
        <Button
          variant="ghost"
          size="icon"
          className="size-9 rounded-full text-primary"
          onClick={handleSend}
        >
          <SendHorizonal className="size-5" />
        </Button>
      ) : (
        <Button variant="ghost" size="icon" className="size-9 rounded-full text-primary">
          <ThumbsUp className="size-5" />
        </Button>
      )}
    </div>
  );
}
