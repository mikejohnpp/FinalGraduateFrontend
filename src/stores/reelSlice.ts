import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IStoryDTO } from "@/types/interfaces/story/IStory";

export interface ReelState {
  reels: IStoryDTO[];
  hasMore: boolean;
}

const initialState: ReelState = {
  reels: [],
  hasMore: true,
};

const reelSlice = createSlice({
  name: "reel",
  initialState,
  reducers: {
    setReels: (state: ReelState, action: PayloadAction<IStoryDTO[]>) => {
      state.reels = action.payload;
    },
    appendReels: (state: ReelState, action: PayloadAction<IStoryDTO[]>) => {
      state.reels.push(...action.payload);
    },
    prependReel: (state: ReelState, action: PayloadAction<IStoryDTO>) => {
      state.reels.unshift(action.payload);
    },
    setHasMore: (state: ReelState, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    clearReels: (state: ReelState) => {
      state.reels = [];
      state.hasMore = true;
    },
  },
});

export const reelActions = reelSlice.actions;
export default reelSlice;
