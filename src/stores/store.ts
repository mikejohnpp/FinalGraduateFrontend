import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice.ts";
import userReducer from "./userSlice.ts";
import postReducer from "./postSlice.ts";
import groupReducer from "./groupSlice.ts";
import commentReducer from "./commentSlice.ts";
import friendReducer from "./friendSlice.ts";
import { THUNK_EXTRA } from "./thunkExtra.ts";
import socketSlice from "./socketSlice.ts";
import chatSlice from "./chatSlice.ts";
import { userOnlineSlice } from "./userOnlineSlice.ts";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    post: postReducer,
    group: groupReducer,
    comment: commentReducer,
    friend: friendReducer,
    socket: socketSlice.reducer,
    chat: chatSlice.reducer,
    userOnline: userOnlineSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: THUNK_EXTRA,
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
