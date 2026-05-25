import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    userId?: number;
    username?: string;
    accessToken?: string;
    loginSuccess: boolean;
    isLoading: boolean;
}


const initialState: UserState = {
    userId: undefined,
    username: "",
    accessToken: undefined,
    loginSuccess: false,
    isLoading: false
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUsername: (state, action: PayloadAction<string>) => {
            state.username = action.payload;
        },
        setUserId: (state, action: PayloadAction<number>) => {
            state.userId = action.payload;
        },
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
        },
        setLoginSuccess: (state, action: PayloadAction<boolean>) => {
            state.loginSuccess = action.payload;
        },
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        resetUser: (state) => {
            state.userId = undefined;
            state.username = "";
            state.accessToken = undefined;
            state.loginSuccess = false;
        },
    },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
