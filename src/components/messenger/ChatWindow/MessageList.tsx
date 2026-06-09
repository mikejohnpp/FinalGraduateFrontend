import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageBubble from "./MessageBubble";
import type { Message, Conversation } from "@/types/messenger";
import { CURRENT_USER_ID } from "@/data/mock/messengerData";
import type { MessageChat } from "@/stores/chatSlice";
import dinhDangThoiGian from "@/utils/DinhDangThoiGian";
import { useDispatch, useSelector } from "react-redux";
import { stompClient } from "@/websocket/stompClient";
import chatSlice from "@/stores/chatSlice";
import chatService from "@/services/chatService";

interface MessageListProps {
  chatInfo: MessageChat;
  userId: number;
}

export default function MessageList({ chatInfo, userId }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const connected = useSelector((state: any) => state.socket.connected);
  const conversationId = useSelector((state: any) => state.chat.conversationId);
  const dispatch = useDispatch();

  // Scroll to bottom when a new message is received (chatInfo.messages[0] changes)
  // or on initial load.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatInfo?.messages?.[0]]);

  useEffect(() => {
    if (!connected) return;
    if (!conversationId) return;
    const subscription = stompClient.subscribe(
      `/topic/conversation/${conversationId}`,
      (message) => {
        const newMessage = JSON.parse(message.body);

        dispatch(chatSlice.actions.addMessage(newMessage));
      },
    );
    return () => {
      console.log(`Unsubscribe /topic/conversation/${conversationId}`);
      subscription.unsubscribe();
    };
  }, [conversationId, connected]);

  useEffect(() => {
    if (!connected) return;
    if (!conversationId) return;
    const subscription = stompClient.subscribe(
      `/topic/conversation/${conversationId}/typing`,
      (message) => {
        const data = JSON.parse(message.body);
        console.log("MessageList: Received typing event:", data);
        const typing = data.typing !== undefined ? data.typing : data.isTyping;
        dispatch(chatSlice.actions.setTyping({ userId: data.senderId, isTyping: typing }));
      },
    );
    return () => {
      subscription.unsubscribe();
    };
  }, [conversationId, connected]);

  const typingUsers = useSelector((state: any) => state.chat.typingUsers) || [];
  const activeTypingUsers = typingUsers.filter((id: number) => id !== userId);

  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollTop === 0) {
      if (chatInfo && chatInfo.currentPage + 1 < chatInfo.totalPages && !isLoadingMore) {
        setIsLoadingMore(true);
        const previousScrollHeight = target.scrollHeight;

        try {
          const res = await chatService.getConversationDetail(
            conversationId,
            chatInfo.currentPage + 1,
            50,
          );
          if (res?.data) {
            const data = res.data as MessageChat;
            dispatch(
              chatSlice.actions.prependMessages({
                messages: data.messages,
                currentPage: data.currentPage,
              }),
            );

            // Restore scroll position so it doesn't jump to top
            setTimeout(() => {
              if (scrollAreaRef.current) {
                const viewport = scrollAreaRef.current.querySelector(
                  "[data-radix-scroll-area-viewport]",
                );
                if (viewport) {
                  viewport.scrollTop = viewport.scrollHeight - previousScrollHeight;
                }
              }
            }, 0);
          }
        } catch (error) {
          console.error("Failed to load older messages", error);
        } finally {
          setIsLoadingMore(false);
        }
      }
    }
  };

  return (
    <ScrollArea
      ref={scrollAreaRef}
      className="min-h-0 flex-1 overflow-hidden py-4"
      onScrollCapture={handleScroll}
    >
      <div className="flex flex-col gap-1">
        {isLoadingMore && (
          <div className="py-2 text-center text-xs text-muted-foreground">Đang tải thêm...</div>
        )}
        {[...(chatInfo?.messages || [])].reverse().map((message: any) => {
          return (
            <div
              key={message.id}
              className={`flex ${message.senderId === userId ? "justify-end" : "justify-start"} gap-1 p-2`}
            >
              <div
                className={`flex w-fit flex-col gap-1 rounded-lg px-3 py-2 ${message.senderId === userId ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
              >
                <div>{message.content}</div>
                <div
                  className={`text-[10px] ${message.senderId === userId ? "text-blue-100" : "text-gray-500"}`}
                >
                  {dinhDangThoiGian(message.createdAt)}
                </div>
              </div>
            </div>
          );
        })}
        {activeTypingUsers.length > 0 && (
          <div className="flex justify-start gap-1 p-2">
            <div className="flex w-fit items-center gap-1 rounded-full bg-gray-200 px-4 py-2 text-gray-800">
              <div className="flex space-x-1">
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
