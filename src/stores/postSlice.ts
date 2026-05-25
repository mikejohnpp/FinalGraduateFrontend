import { API } from "@/common/constants";
import postService from "@/services/postService";
import type { IPost } from "@/types/interfaces/post/IPost";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { IPostDetails } from "@/types/interfaces/post/IPostDetails";

interface PostState {
    list: Array<IPost>
}

const initialState: PostState = {
    list: []
};

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getPostList.fulfilled, (state, action) => {
            state.list = action.payload;
            console.log(action.payload)
        })
    }
});


// test test
export const getPostList = createAsyncThunk(
    "post/list",
    async (_, { dispatch }) => {
        const response = await postService.getList<IPost>(API.POST.GET_LIST)
        return response;
    }
);


export const getPostDetails = createAsyncThunk("posts/details",
    async (id: number) => {
        try {
            const response = await postService.getSingle<IPostDetails>(API.POST.GET_DETAILS, id)
            console.log(response);
        } catch (error: any) {
            console.error("Login failed:", error);
        }
    }
)

export const { } = postSlice.actions;

export default postSlice.reducer;
