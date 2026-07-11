import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/**
 * State cho trình xem bài viết toàn cục (mở overlay từ thông báo).
 *
 * - `postId`: bài viết cần mở; null nghĩa là đóng viewer.
 * - `commentId`: bình luận cần cuộn tới & highlight (tuỳ chọn).
 */
interface PostViewerState {
    postId: number | null;
    commentId: number | null;
}

const initialState: PostViewerState = {
    postId: null,
    commentId: null,
};

const postViewerSlice = createSlice({
    name: "postViewer",
    initialState,
    reducers: {
        openPostViewer(
            state,
            action: PayloadAction<{ postId: number; commentId?: number | null }>,
        ) {
            state.postId = action.payload.postId;
            state.commentId = action.payload.commentId ?? null;
        },
        closePostViewer(state) {
            state.postId = null;
            state.commentId = null;
        },
    },
});

export const postViewerActions = postViewerSlice.actions;
export default postViewerSlice.reducer;
