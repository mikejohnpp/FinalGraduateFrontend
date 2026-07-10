import { useState, type KeyboardEvent, useRef, useEffect, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Image as ImageIcon, Smile, ThumbsUp, SendHorizonal, Loader2 } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import TextareaAutosize from "react-textarea-autosize";
import EmojiPicker from "emoji-picker-react";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { DraftPreview } from "@/components/media/MediaPicker";

interface ChatInputProps {
  onSendMessage: (content: string, messageType?: any) => void;
  onTypingChange?: (isTyping: boolean) => void;
}

export default function ChatInput({ onSendMessage, onTypingChange }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const { drafts, uploading, hasMedia, addFiles, removeDraft, clear, upload } = useMediaUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

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

  const handleSend = async (contentOverride?: string) => {
    const content = (contentOverride ?? message).trim();

    if (!content && !hasMedia) {
      return;
    }

    if (hasMedia) {
      const uploadedMedia = await upload();
      if (uploadedMedia && uploadedMedia.length > 0) {
        uploadedMedia.forEach((m, index) => {
          const type = m.mediaType === "IMAGE" || m.mediaType === "VIDEO" ? "IMAGE" : "FILE";
          if (type === "FILE" && drafts[index]) {
            onSendMessage(`${m.url}|${drafts[index].file.name}`, type);
          } else {
            onSendMessage(m.url, type);
          }
        });
      }
      clear();
    }

    if (content) {
      onSendMessage(content, "TEXT");
    }

    setMessage("");
    setIsEmojiOpen(false);
    setIsTyping(false);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addFiles(e.target.files);
    e.target.value = "";
  };

  return (
    <div className="flex flex-col gap-2 border-t border-border px-4 py-3">
      {hasMedia && (
        <div className="flex flex-wrap gap-2 pb-1">
          {drafts.map((d) => (
            <DraftPreview key={d.id} draft={d} onRemove={removeDraft} />
          ))}
        </div>
      )}

      <input type="file" multiple hidden ref={fileInputRef} onChange={handleFileChange} />
      <input
        type="file"
        multiple
        hidden
        accept="image/*,video/*"
        ref={imageInputRef}
        onChange={handleFileChange}
      />

      <div className="flex shrink-0 items-center gap-2">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-9 rounded-full text-primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Plus className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-9 rounded-full text-primary"
            onClick={() => imageInputRef.current?.click()}
            disabled={uploading}
          >
            <ImageIcon className="size-5" />
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
              disabled={uploading}
              className="min-h-6 w-full resize-none overflow-y-auto border-none bg-transparent pt-2 outline-none disabled:opacity-50"
            />
          </div>
          <div className="flex items-center">
            <Popover open={isEmojiOpen} onOpenChange={setIsEmojiOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  disabled={uploading}
                  className="flex size-9 items-center justify-center rounded-full disabled:opacity-50"
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

        {message.trim() || hasMedia ? (
          <Button
            variant="ghost"
            size="icon"
            className="size-9 rounded-full text-primary"
            onClick={() => handleSend()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <SendHorizonal className="size-5" />
            )}
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="size-9 rounded-full text-primary"
            onClick={() => handleSend("👍")}
            disabled={uploading}
          >
            <ThumbsUp className="size-5" />
          </Button>
        )}
      </div>
    </div>
  );
}
