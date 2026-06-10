import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import dinhDangThoiGian from "@/utils/DinhDangThoiGian";
import { stompClient } from "@/websocket/stompClient";
import chatSlice, { type MessageChat } from "@/stores/chatSlice";
import chatService from "@/services/chatService";

interface MessageListProps {
  chatInfo: MessageChat;
  userId: number;
}

export default function MessageList({ chatInfo, userId }: MessageListProps) {
  const dispatch = useDispatch();

  const containerRef = useRef<HTMLDivElement>(null);

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const isInitialLoadRef = useRef(true);
  const previousMessageCountRef = useRef(0);

  const connected = useSelector((state: any) => state.socket.connected);
  const conversationId = useSelector((state: any) => state.chat.conversationId);

  const typingUsers = useSelector((state: any) => state.chat.typingUsers) || [];

  const activeTypingUsers = typingUsers.filter((id: number) => id !== userId);

  /**
   * Scroll xuống cuối
   */
  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    const container = containerRef.current;

    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    });

    setShowScrollButton(false);
  };

  /**
   * Kiểm tra có đang ở gần cuối không
   */
  const isNearBottom = () => {
    const container = containerRef.current;

    if (!container) return true;

    return container.scrollHeight - container.scrollTop - container.clientHeight < 100;
  };

  /**
   * Subscribe websocket
   */
  useEffect(() => {
    if (!connected || !conversationId) return;

    const subscription = stompClient.subscribe(
      `/topic/conversation/${conversationId}`,
      (message) => {
        const newMessage = JSON.parse(message.body);

        dispatch(chatSlice.actions.addMessage(newMessage));
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [conversationId, connected, dispatch]);

  /**
   * Reset khi đổi cuộc trò chuyện
   */
  useEffect(() => {
    isInitialLoadRef.current = true;
    previousMessageCountRef.current = 0;
    setShowScrollButton(false);
  }, [conversationId]);

  /**
   * Xử lý khi số lượng tin nhắn thay đổi
   */
  useEffect(() => {
    const container = containerRef.current;

    if (!container || !chatInfo?.messages) return;

    const currentCount = chatInfo.messages.length;

    /**
     * Lần đầu mở chat
     */
    if (isInitialLoadRef.current) {
      setTimeout(() => {
        scrollToBottom("auto");
      }, 0);

      isInitialLoadRef.current = false;
      previousMessageCountRef.current = currentCount;

      return;
    }

    /**
     * Có tin nhắn mới
     */
    if (currentCount > previousMessageCountRef.current) {
      if (isNearBottom()) {
        scrollToBottom();
      } else {
        setShowScrollButton(true);
      }
    }

    previousMessageCountRef.current = currentCount;
  }, [chatInfo?.messages]);

  /**
   * Infinite scroll
   */
  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;

    /**
     * Hiện / ẩn nút xuống cuối
     */
    if (isNearBottom()) {
      setShowScrollButton(false);
    }

    /**
     * Load tin nhắn cũ
     */
    if (
      target.scrollTop === 0 &&
      !isLoadingMore &&
      chatInfo.currentPage + 1 < chatInfo.totalPages
    ) {
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

          /**
           * Giữ nguyên vị trí đang đọc
           */
          setTimeout(() => {
            if (containerRef.current) {
              containerRef.current.scrollTop =
                containerRef.current.scrollHeight - previousScrollHeight;
            }
          }, 0);
        }
      } catch (error) {
        console.error("Failed to load older messages", error);
      } finally {
        setIsLoadingMore(false);
      }
    }
  };

  return (
    <div className="relative flex min-h-0 flex-1">
      {!chatInfo?.messages?.length ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center text-sm text-muted-foreground">Chưa có tin nhắn nào</div>
        </div>
      ) : (
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="custom-scrollbar flex-1 overflow-y-auto py-4"
        >
          <div className="flex flex-col gap-1">
            {isLoadingMore && (
              <div className="py-2 text-center text-xs text-muted-foreground">Đang tải thêm...</div>
            )}

            {[...(chatInfo?.messages || [])].reverse().map((message: any) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === userId ? "justify-end" : "justify-start"
                } gap-1 p-2`}
              >
                <div
                  className={`flex w-fit max-w-[70%] flex-col gap-1 rounded-lg px-3 py-2 ${
                    message.senderId === userId
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <div>{message.content}</div>

                  <div
                    className={`text-[10px] ${
                      message.senderId === userId ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {dinhDangThoiGian(message.createdAt)}
                  </div>
                </div>
              </div>
            ))}

            {activeTypingUsers.length > 0 && (
              <div className="flex justify-start gap-1 p-2">
                <div className="flex w-fit items-center gap-1 rounded-full bg-gray-200 px-4 py-2 text-gray-800">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.3s]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.15s]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showScrollButton && (
        <button
          onClick={() => scrollToBottom()}
          className="absolute right-4 bottom-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg transition hover:bg-blue-600"
        >
          <ChevronDown size={20} />
        </button>
      )}
    </div>
  );
}
