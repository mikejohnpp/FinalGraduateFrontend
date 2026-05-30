import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "sonner";
import type { UserProfileDTO } from "@/types/interfaces/user/UserProfileDTO";

interface UserState {
  userId?: number;
  username?: string;
  accessToken?: string;
  loginSuccess: boolean;
  isLoading: boolean;
  profile: UserProfileDTO | null;
}

const storedUserId = localStorage.getItem("user_id");
const initialUserId = storedUserId ? parseInt(storedUserId, 10) : undefined;

const initialState: UserState = {
  userId: initialUserId,
  username: "",
  accessToken: undefined,
  loginSuccess: !!storedUserId,
  isLoading: false,
  profile: null,
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
    setProfile: (state, action: PayloadAction<UserProfileDTO | null>) => {
      state.profile = action.payload;
      if (action.payload) {
        state.username = action.payload.userName;
      }
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfileDTO>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    resetUser: (state) => {
      state.userId = undefined;
      state.username = "";
      state.accessToken = undefined;
      state.loginSuccess = false;
      state.profile = null;
      toast.info("Đã đăng xuất");
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
