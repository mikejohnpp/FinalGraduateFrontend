import { useState, type KeyboardEvent, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group";
import { Plus, Image, Smile, ThumbsUp, SendHorizonal } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import EmojiPicker from "emoji-picker-react";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onTypingChange?: (isTyping: boolean) => void;
}

export default function ChatInput({ onSendMessage, onTypingChange }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
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
          <Plus data-icon />
        </Button>
        <Button variant="ghost" size="icon" className="size-9 rounded-full text-primary">
          <Image data-icon />
        </Button>
      </div>

      <InputGroup className="flex-1">
        <InputGroupInput
          placeholder="Aa"
          value={message}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="rounded-full border-none bg-secondary"
        />
        <InputGroupAddon align="inline-end">
          <Popover open={isEmojiOpen} onOpenChange={setIsEmojiOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8 rounded-full">
                <Smile data-icon className="text-primary" />
              </Button>
            </PopoverTrigger>
            <PopoverContent side="top" align="end" className="w-auto p-0 border-none shadow-none bg-transparent">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>

      {message.trim() ? (
        <Button
          variant="ghost"
          size="icon"
          className="size-9 rounded-full text-primary"
          onClick={handleSend}
        >
          <SendHorizonal data-icon />
        </Button>
      ) : (
        <Button variant="ghost" size="icon" className="size-9 rounded-full text-primary">
          <ThumbsUp data-icon />
        </Button>
      )}
    </div>
  );
}
