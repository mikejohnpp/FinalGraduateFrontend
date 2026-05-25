import { AUTH_TOKEN_NAME } from "@/common/constants";
import { PATH_CONSTRAINT } from "@/plugins/routers";
import userService from "@/services/userService";
import type { AppDispatch, RootState } from "@/stores/store";
import { userActions } from "@/stores/userSlice";
import type { ApiResultGeneric } from "@/types/interfaces/result/apiResult";
import { RedirectLogin, RemoveToken } from "@/utils/redirectHelper";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface LoginUserInterface {
  login: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
}

interface LogoutUserInterface {
  logout: () => Promise<void>;
  isLoading: boolean;
}

export function useLoginUser() {
  const dispatch: AppDispatch = useDispatch();
  const userState = useSelector((r: RootState) => r.user);
  const navigate = useNavigate();

  async function login(email: string, password: string) {
    try {
      dispatch(userActions.setIsLoading(true));

      const response = await userService.login(email, password);

      if (response?.data) {
        const { token, userId } = response.data;

        localStorage.setItem(AUTH_TOKEN_NAME, token);

        dispatch(userActions.setAccessToken(token));
        dispatch(userActions.setUserId(userId));
        dispatch(userActions.setLoginSuccess(true));

        navigate(PATH_CONSTRAINT.HOME);
      } else {
        dispatch(userActions.setLoginSuccess(false));
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      dispatch(userActions.setLoginSuccess(false));
    } finally {
      dispatch(userActions.setIsLoading(false));
    }
  }

  return {
    login: login,
    isLoading: userState.isLoading,
  } as LoginUserInterface;
}

export function useLogoutUser() {
  const dispatch: AppDispatch = useDispatch();
  const userState = useSelector((r: RootState) => r.user);

  async function logout() {
    try {
      dispatch(userActions.setIsLoading(true));

      const res: ApiResultGeneric<undefined> | undefined =
        await userService.logout();
      if (res?.success) {
        dispatch(userActions.resetUser());
        RemoveToken();
        RedirectLogin();
      } else {
        console.error("Không thể đăng xuất do có lỗi xảy ra", res);
      }
    } catch (error) {
      console.log("Không thể đăng xuất do có lỗi xảy ra", error);
    }
  }

  return {
    logout: logout,
    isLoading: userState.isLoading,
  } as LogoutUserInterface;
}
