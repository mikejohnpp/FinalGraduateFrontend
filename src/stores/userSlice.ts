import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "./store";
import loginService from "@/services/loginService";
import { AUTH_TOKEN_NAME } from "@/common/constants";
import http from "@/lib/http";

interface UserState {
    userId?: number;
    username?: string;
    accessToken?: string;
    loginSuccess: boolean;
}

// Test thôi nha nào sửa lại đấy
// Legacy thunk
export function asyncLogin(
    username: string,
    passwd: string,
) {
    return async function(
        dispatch: AppDispatch,
        _getState: () => RootState,
    ) {
        try {
            const response = await loginService.login(username, passwd);

            if (response.data) {
                const { token, userId } = response.data;

                localStorage.setItem(AUTH_TOKEN_NAME, token);

                dispatch(setAccessToken(token));
                dispatch(setUserId(userId));
                dispatch(setLoginSuccess(true));
            } else {
                dispatch(setLoginSuccess(false));
            }
        } catch (error: any) {
            console.error("Login failed:", error);
            dispatch(setLoginSuccess(false));
        }
    };
}

export function getProduct() {
    return async function(
        dispatch: AppDispatch,
        _getState: () => RootState,
    ) {
        try {
            const response = await http.get<any>("/users/posts/2");
            console.log(response);
        } catch (error: any) {
            console.error("Login failed:", error);
            dispatch(setLoginSuccess(false));
        }
    };
}

// Modern thunk
export const asyncLogout = createAsyncThunk(
    "user/logout",
    async (_, { dispatch }) => {
        localStorage.removeItem(AUTH_TOKEN_NAME);
        dispatch(resetUser());
        return true;
    }
);

const initialState: UserState = {
    userId: undefined,
    username: "",
    accessToken: undefined,
    loginSuccess: false,
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
        resetUser: (state) => {
            state.userId = undefined;
            state.username = "";
            state.accessToken = undefined;
            state.loginSuccess = false;
        },
    },
});

export const { setUsername, setUserId, setAccessToken, setLoginSuccess, resetUser } = userSlice.actions;

export default userSlice.reducer;
