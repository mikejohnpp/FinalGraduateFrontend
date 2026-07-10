import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "@/components/messenger/Sidebar/Sidebar";
import http from "@/lib/http";
import { useDispatch, useSelector } from "react-redux";
import type { Conversation } from "./interface/Conversation";
import chatSlice, { type Message, type MessageSend } from "@/stores/chatSlice";
import ChatWindow from "./ChatWindow/ChatWindow";
import { sendMessage } from "@/websocket/chatSocket";
import chatService from "@/services/chatService";
import type { MessageType } from "@/stores/chatSlice";

export default function MessengerLayout() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<any>(null);
  const userId = useSelector((state: any) => state.user?.userId);
  const conversationId = useSelector((state: any) => state.chat.conversationId);
  const connected = useSelector((state: any) => state.socket.connected);
  const chatInfo = useSelector((state: any) => state.chat.chatInfo);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchConversations = (): Promise<Conversation[]> =>
    http
      .get(`/chat/conversations/user/${userId}`)
      .then((res: any) => {
        setConversations(res.data);
        return res.data as Conversation[];
      })
      .catch((err) => {
        console.error("Failed to fetch conversations", err);
        return [] as Conversation[];
      });

  useEffect(() => {
    if (!userId) return;
    fetchConversations();
  }, [userId]);

  useEffect(() => {
    const targetUserId = searchParams.get("userId");
    if (!targetUserId || !userId) return;

    const open = async () => {
      try {
        const res = await chatService.createDirectConversation(Number(targetUserId), userId);
        const conversation = res?.data;
        if (!conversation) return;

        setSearchParams({}, { replace: true });

        const list = await fetchConversations();
        const exists = list.find((c) => c.id === conversation.id);
        if (!exists) {
          setConversations((prev) => [conversation, ...prev]);
        }
        onSelectConversation(conversation.id);
      } catch (err) {
        console.error("Failed to open direct conversation", err);
      }
    };

    open();
  }, [userId]);

  useEffect(() => {
    if (!conversationId || !connected) return;
    http
      .get(`/chat/conversations/conversation/${conversationId}`)
      .then((res: any) => {
        dispatch(chatSlice.actions.setChatList(res.data));
      })
      .catch((err) => {
        console.error("Failed to fetch conversation details", err);
      });
  }, [conversationId, connected]);

  const onSelectConversation = (id: any) => {
    dispatch(chatSlice.actions.setConversationId(id));
    setActiveConversationId(id);
  };

  const onConversationCreated = () => {
    fetchConversations();
  };

  const onSendMessage = (content: string, messageType: MessageType = "TEXT") => {
    if (content.trim() === "") return;
    const tempId = crypto.randomUUID();
    let newMessage: Message = {
      conversationId: conversationId,
      content: content,
      createdAt: new Date().toISOString(),
      user: { id: userId, username: "", avatarUrl: "" },
      tempId: tempId,
      messageType: messageType,
    };
    let newMessageSend: MessageSend = {
      conversationId: conversationId,
      content: content,
      createdAt: new Date().toISOString(),
      senderId: userId,
      tempId: tempId,
      messageType: messageType,
    };
    // dispatch(chatSlice.actions.addMessage(newMessage));
    sendMessage(newMessage);
  };

  return (
    <div className="flex h-[calc(100svh-62px)] w-full overflow-hidden bg-background">
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        userId={userId}
        onSelectConversation={onSelectConversation}
        onConversationCreated={onConversationCreated}
      />

      {activeConversationId && chatInfo && (
        <ChatWindow chatInfo={chatInfo} userId={userId} onSendMessage={onSendMessage} />
      )}
    </div>
  );
}
