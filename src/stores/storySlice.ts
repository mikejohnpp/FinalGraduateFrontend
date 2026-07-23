import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IStoryDTO } from "@/types/interfaces/story/IStory";

export interface StoryState {
  storyId: number | null;
  stories: IStoryDTO[];
  loading: boolean;
}

const initialState: StoryState = {
  storyId: null,
  stories: [],
  loading: false,
};

const storySlice = createSlice({
  name: "story",
  initialState,
  reducers: {
    setStoryId: (state: StoryState, action: PayloadAction<number | null>) => {
      state.storyId = action.payload;
    },
    setStories: (state: StoryState, action: PayloadAction<IStoryDTO[]>) => {
      state.stories = action.payload;
    },
    addStory: (state: StoryState, action: PayloadAction<IStoryDTO>) => {
      state.stories.unshift(action.payload);
    },
    setLoading: (state: StoryState, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const storyActions = storySlice.actions;
export default storySlice;
