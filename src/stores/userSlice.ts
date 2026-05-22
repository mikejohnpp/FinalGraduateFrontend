import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { LoginStatus } from "@/types/LoginCredentials";
import type { AppDispatch, RootState } from "./store";
import loginService from "@/services/loginService";

interface UserState {
    username?: string;
    loginSuccess: boolean;
}

// Legacy thunk
export function asyncLogin(username: string, passwd: string) {
    return async function(
        dispatch: AppDispatch,
        getState: () => RootState,
    ) {
        const status: LoginStatus = await loginService.login(username, passwd);
        if (status.status === "success") {
            dispatch(setUsername(status.username));
            dispatch(setLoginSuccess(true));
            console.log("Login")
        } else {
            console.log("Login failed")
            dispatch(setUsername(""));
            dispatch(setLoginSuccess(false));
        }
    };
}

// Modern thunk
export const asyncLogout = createAsyncThunk(
    "user/logout",

    async (_,) => {

        const response = await loginService.logout();
        console.log("logout", response);
        return response;
    }
)

const initialState: UserState = {
    username: "",
    loginSuccess: false
};

const userSlice = createSlice({
    name: "onlineStatus",
    initialState,
    reducers: {
        setUsername: (state, action: PayloadAction<string>) => {
            state.username = action.payload;
        },
        setLoginSuccess: (state, action: PayloadAction<boolean>) => {
            state.loginSuccess = action.payload;
        }
    },
});

export const { setUsername, setLoginSuccess } = userSlice.actions;

export default userSlice.reducer;
