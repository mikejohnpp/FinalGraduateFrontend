import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ChatState {
  conversationId: number | null;
  chatInfo: MessageChat | null;
  typingUsers: UserResponse[];
}

export interface UserResponse {
  id: number;
  username?: string;
  avatarUrl?: string;
}

export interface MessageChat {
  conversationId: number;
  conversationName: string;
  group: boolean;
  createAd: string;
  members: UserResponse[];
  messages: Message[];
  totalElements: number;
}

export type MessageType = "TEXT" | "VIDEO_CALL" | "AUDIO_CALL" | "IMAGE" | "FILE";

export interface Message {
  id?: number;
  conversationId?: number;
  content: string;
  createdAt?: string;
  user: UserResponse;
  isActive?: boolean;
  messageType?: MessageType;
  callDuration?: number | null;
  tempId?: string;
}

export interface MessageSend {
  conversationId?: number;
  content: string;
  createdAt?: string;
  senderId: number;
  tempId?: string;
  messageType?: MessageType;
}

const initialState: ChatState = {
  conversationId: null,
  chatInfo: null,
  typingUsers: [],
};

const chatSlice = createSlice({
  name: "chat",

  initialState,

  reducers: {
    setConversationId: (state, action: PayloadAction<number>) => {
      state.conversationId = action.payload;
    },

    setChatList: (state, action: PayloadAction<MessageChat>) => {
      state.chatInfo = action.payload;
    },

    // realtime/new message
    // thêm vào cuối
    addMessage: (state, action: PayloadAction<Message>) => {
      if (!state.chatInfo) return;

      state.chatInfo.messages.unshift(action.payload);
    },

    updateMessage: (state, action: PayloadAction<Message>) => {
      if (!state.chatInfo) return;

      const index = state.chatInfo.messages.findIndex(
        (msg) => msg.tempId === action.payload.tempId,
      );

      if (index !== -1) {
        state.chatInfo.messages[index] = action.payload;
      }
    },

    prependMessages: (state, action: PayloadAction<{ messages: Message[] }>) => {
      if (!state.chatInfo) return;
      state.chatInfo.messages = [...state.chatInfo.messages, ...action.payload.messages];
    },

    clearChat: (state) => {
      state.conversationId = null;
      state.chatInfo = null;
      state.typingUsers = [];
    },
    setTyping: (state, action: PayloadAction<{ userId: number; isTyping: boolean }>) => {
      const { userId, isTyping } = action.payload;
      console.log("Redux setTyping:", userId, isTyping);
      if (isTyping) {
        const user = state.typingUsers.find((u) => u.id === userId);
        if (!user) {
          state.typingUsers.push({ id: userId, username: "", avatarUrl: "" });
        }
      } else {
        state.typingUsers = state.typingUsers.filter((u) => u.id !== userId);
      }
    },
    clearTyping: (state) => {
      state.typingUsers = [];
    },
  },
});

export default chatSlice;
