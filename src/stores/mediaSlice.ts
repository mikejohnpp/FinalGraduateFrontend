import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Message, MessageType, UserResponse } from "./chatSlice";

export interface MediaManager {
  conversationId: number;
  members: UserResponse[];
  messages: Message[];
}

const initialState: MediaManager = {
  conversationId: 0,
  members: [],
  messages: [],
};

const mediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {
    setMediaManager: (state, action: PayloadAction<MediaManager>) => {
      state.conversationId = action.payload.conversationId;
      state.members = action.payload.members;
      state.messages = action.payload.messages;
    },

    addMediaMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
  },
});
export default mediaSlice;
