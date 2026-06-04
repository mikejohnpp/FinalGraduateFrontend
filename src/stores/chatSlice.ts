import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ChatState {
  conversationId: number | null;
  chatInfo: MessageChat | null;
  typingUsers: number[];
}

export interface UserResponse {
  id: number;
  username: string;
  avatarUrl: string;
}

export interface MessageChat {
  conversationId: number;
  conversationName: string;
  group: boolean;
  createAd: string;
  members: UserResponse[];
  messages: Message[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
}

export interface Message {
  id: number;
  conversationId?: number;
  content: string;
  createdAt: string;
  senderId: number;
  isActive: boolean;
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

    prependMessages: (
      state,
      action: PayloadAction<{ messages: Message[]; currentPage: number }>,
    ) => {
      if (!state.chatInfo) return;
      state.chatInfo.messages = [...state.chatInfo.messages, ...action.payload.messages];
      state.chatInfo.currentPage = action.payload.currentPage;
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
        if (!state.typingUsers.includes(userId)) {
          state.typingUsers.push(userId);
        }
      } else {
        state.typingUsers = state.typingUsers.filter((id) => id !== userId);
      }
    },
    clearTyping: (state) => {
      state.typingUsers = [];
    }
  },
});

export default chatSlice;
