import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { loginSevice } from "@/services/loginService";
import type { LoginStatus } from "@/types/LoginCredentials";

interface UserState {
    username?: string;
    loginSuccess: boolean;
}

const initialState: UserState = {
    username: "",
    loginSuccess: false
};

const userSlice = createSlice({
    name: "onlineStatus",
    initialState,
    reducers: {
        login: (
            state,
            action: PayloadAction<{ username: string, passwd: string }>
        ) => {
            const status: LoginStatus = loginSevice.login(action.payload.username, action.payload.passwd);
            if (status.status === "success") {
                state.username = status.username;
                state.loginSuccess = true;
            } else {
                state.username = "";
                state.loginSuccess = false;
            }
        },
        logout: (state) => {
            const logout = loginSevice.logout();
            if (logout === true) {
                state.username = "";
                state.loginSuccess = false;
            }
        }
    },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
