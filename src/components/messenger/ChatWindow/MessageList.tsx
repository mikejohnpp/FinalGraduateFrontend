import { useEffect, useRef, useState } from "react";
import { ChevronDown, Phone, Video } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import dinhDangThoiGian from "@/utils/DinhDangThoiGian";
import { stompClient } from "@/websocket/stompClient";
import chatSlice, { type MessageChat } from "@/stores/chatSlice";
import chatService from "@/services/chatService";
import { useWebRTC } from "@/hooks/useWebRTC";
import mediaSlice from "@/stores/mediaSlice";

interface MessageListProps {
  chatInfo: MessageChat;
  userId: number;
}

export default function MessageList({ chatInfo, userId }: MessageListProps) {
  const dispatch = useDispatch();
  const { startCall } = useWebRTC();

  const containerRef = useRef<HTMLDivElement>(null);

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const isInitialLoadRef = useRef(true);
  const previousMessageCountRef = useRef(0);

  const connected = useSelector((state: any) => state.socket.connected);
  const conversationId = useSelector((state: any) => state.chat.conversationId);

  const typingUsers = useSelector((state: any) => state.chat.typingUsers) || [];

  const activeTypingUsers = typingUsers.filter((id: number) => id !== userId);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    const container = containerRef.current;

    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    });

    setShowScrollButton(false);
  };

  const isNearBottom = () => {
    const container = containerRef.current;

    if (!container) return true;

    return container.scrollHeight - container.scrollTop - container.clientHeight < 100;
  };

  useEffect(() => {
    if (!connected || !conversationId) return;

    const subscription = stompClient.subscribe(
      `/topic/conversation/${conversationId}`,
      (message) => {
        const newMessage = JSON.parse(message.body);
        console.log("Received new message:", newMessage);
        if (newMessage.messageType === "IMAGE" || newMessage.messageType === "FILE") {
          dispatch(mediaSlice.actions.addMediaMessage(newMessage));
        }

        dispatch(chatSlice.actions.addMessage(newMessage));
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [conversationId, connected, dispatch, userId]);

  useEffect(() => {
    isInitialLoadRef.current = true;
    previousMessageCountRef.current = 0;
    setShowScrollButton(false);
    setHasMore(true);
  }, [conversationId]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || !chatInfo?.messages) return;

    const currentCount = chatInfo.messages.length;

    if (isInitialLoadRef.current) {
      setTimeout(() => {
        scrollToBottom("auto");
      }, 0);

      isInitialLoadRef.current = false;
      previousMessageCountRef.current = currentCount;

      return;
    }

    if (currentCount > previousMessageCountRef.current) {
      if (isNearBottom()) {
        scrollToBottom();
      } else {
        setShowScrollButton(true);
      }
    }

    previousMessageCountRef.current = currentCount;
  }, [chatInfo?.messages]);

  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;

    if (isNearBottom()) {
      setShowScrollButton(false);
    }

    if (target.scrollTop === 0 && !isLoadingMore && hasMore) {
      setIsLoadingMore(true);

      const previousScrollHeight = target.scrollHeight;

      try {
        // const res = await chatService.getConversationDetail(
        //   conversationId,
        //   chatInfo.currentPage + 1,
        //   50,
        // );

        const res = await chatService.getConversationDetail2(
          conversationId,
          chatInfo.messages[chatInfo.messages.length - 1]?.id || null,
        );
        console.log("Fetched older messages2222222:", res);
        if (res?.data) {
          const data = res.data as MessageChat;
          if (!data.messages || data.messages.length === 0) {
            setHasMore(false);
          } else {
            dispatch(
              chatSlice.actions.prependMessages({
                messages: data.messages,
              }),
            );
          }

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

            {[...(chatInfo?.messages || [])]
              .reverse()
              .map((message: any, index: number, messages: any[]) => {
                const isMe = message.user.id === userId;

                const nextMessage = messages[index + 1];

                const showAvatar = !isMe && nextMessage?.user?.id !== message.user.id;

                return (
                  <div
                    key={message.id || -1}
                    className={`flex items-end gap-1 p-2 ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    {!isMe &&
                      (showAvatar ? (
                        message.user.avatar ? (
                          <img
                            src={message.user.avatar}
                            alt={message.user.username}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-400 font-semibold text-white">
                            {message.user.username?.charAt(0).toUpperCase()}
                          </div>
                        )
                      ) : (
                        <div className="h-10 w-10" />
                      ))}

                    <div
                      className={`flex w-fit max-w-[70%] flex-col gap-1 rounded-lg px-3 py-2 ${
                        message.messageType === "VIDEO_CALL" || message.messageType === "AUDIO_CALL"
                          ? !message.callDuration || message.callDuration === 0
                            ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                          : isMe
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {message.user.id !== userId && (
                        <div className="text-[12px] opacity-30">{message.user.username}</div>
                      )}
                      {message.messageType === "VIDEO_CALL" ||
                      message.messageType === "AUDIO_CALL" ? (
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 text-sm">
                            {!message.callDuration || message.callDuration === 0 ? (
                              <span>📵 Cuộc gọi nhỡ</span>
                            ) : message.messageType === "VIDEO_CALL" ? (
                              <span>
                                📹 Cuộc gọi video đã kết thúc ·{" "}
                                {message.callDuration < 60
                                  ? `${message.callDuration} giây`
                                  : `${Math.floor(message.callDuration / 60)} phút`}
                              </span>
                            ) : (
                              <span>
                                📞 Cuộc gọi thoại đã kết thúc ·{" "}
                                {message.callDuration < 60
                                  ? `${message.callDuration} giây`
                                  : `${Math.floor(message.callDuration / 60)} phút`}
                              </span>
                            )}
                          </div>
                          {!chatInfo.group &&
                            (() => {
                              const otherMember = chatInfo.members.find((m) => m.id !== userId);
                              if (!otherMember) return null;
                              const isVideo = message.messageType === "VIDEO_CALL";
                              return (
                                <button
                                  onClick={() =>
                                    startCall(otherMember.id, chatInfo.conversationId, isVideo)
                                  }
                                  className="flex items-center gap-1.5 self-start rounded-full bg-white/20 px-3 py-1 text-xs font-medium transition hover:bg-white/30"
                                >
                                  {isVideo ? (
                                    <Video className="size-3" />
                                  ) : (
                                    <Phone className="size-3" />
                                  )}
                                  Gọi lại
                                </button>
                              );
                            })()}
                        </div>
                      ) : message.messageType === "IMAGE" ? (
                        <div className="overflow-hidden rounded-lg">
                          <img
                            src={message.content}
                            alt="Sent image"
                            className="object-full max-h-100 max-w-full"
                          />
                        </div>
                      ) : message.messageType === "FILE" ? (
                        (() => {
                          const parts = message.content.split("|");
                          const fileUrl = parts[0];
                          const fileName =
                            parts.length > 1 ? parts.slice(1).join("|") : fileUrl.split("/").pop();
                          return (
                            <div
                              className={`g-red-500" : "bg-background" } flex w-64 max-w-full cursor-pointer items-center gap-3 rounded-xl p-3`}
                              onClick={() => window.open(fileUrl, "_blank")}
                            >
                              <div
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border`}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                  <polyline points="14 2 14 8 20 8" />
                                  <line x1="16" y1="13" x2="8" y2="13" />
                                  <line x1="16" y1="17" x2="8" y2="17" />
                                  <polyline points="10 9 9 9 8 9" />
                                </svg>
                              </div>
                              <div className="flex flex-1 flex-col overflow-hidden">
                                <span
                                  className={`truncate text-sm font-medium ${isMe ? "text-foreground" : "text-foreground"}`}
                                >
                                  {fileName}
                                </span>
                              </div>
                              <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border ${isMe ? "bg-background text-foreground" : "bg-background text-foreground hover:bg-muted"}`}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                  <polyline points="7 10 12 15 17 10" />
                                  <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                              </div>
                            </div>
                          );
                        })()
                      ) : (
                        <div className="break-words whitespace-pre-wrap">{message.content}</div>
                      )}

                      <div className={`text-[10px] ${isMe ? "text-blue-100" : "text-gray-500"}`}>
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
          className="absolute right-4 bottom-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg transition hover:bg-amber-300"
        >
          <ChevronDown size={20} />
        </button>
      )}
    </div>
  );
}
