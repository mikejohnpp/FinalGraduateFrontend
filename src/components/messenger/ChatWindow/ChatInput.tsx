import { useState, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group";
import { Plus, Image, Smile, ThumbsUp, SendHorizonal } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-shrink-0 items-center gap-2 border-t border-border px-4 py-3">
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
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="rounded-full border-none bg-secondary"
        />
        <InputGroupAddon align="inline-end">
          <Button variant="ghost" size="icon" className="size-8 rounded-full">
            <Smile data-icon className="text-primary" />
          </Button>
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
