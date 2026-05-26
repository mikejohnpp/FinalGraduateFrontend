import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "sonner";

interface UserState {
    userId?: number;
    username?: string;
    accessToken?: string;
    loginSuccess: boolean;
    isLoading: boolean;
}


const storedUserId = localStorage.getItem("user_id");
const initialUserId = storedUserId ? parseInt(storedUserId, 10) : undefined;

const initialState: UserState = {
    userId: initialUserId,
    username: "",
    accessToken: undefined,
    loginSuccess: !!storedUserId,
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
            toast.info("Đã đăng xuất");
        },
    },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
