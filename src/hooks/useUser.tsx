import { AUTH_TOKEN_NAME } from "@/common/constants";
import { PATH_CONSTRAINT } from "@/plugins/routers";
import userService from "@/services/userService";
import type { AppDispatch, RootState } from "@/stores/store";
import { userActions } from "@/stores/userSlice";
import type { RegisterFormData } from "@/types/interfaces/auth/RegisterFormData";
import type { ApiResultGeneric } from "@/types/interfaces/result/apiResult";
import {
  parseResDataOrMessage,
  type ParsedErrorRes,
} from "@/utils/errorHelper";
import { RedirectLogin, RemoveToken } from "@/utils/redirectHelper";
import { useEffect, useState } from "react";
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

interface RegisterUseInterface {
  register: (data: RegisterFormData) => Promise<boolean>;
  loading: boolean;
  error: ParsedErrorRes;
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

export function useUserRegister() {
  const dispatch: AppDispatch = useDispatch();
  const userState = useSelector((r: RootState) => r.user);
  const navigate = useNavigate();
  const [error, setError] = useState<ParsedErrorRes>();
  const [loading, setLoading] = useState<boolean>(false);

  async function register(data: RegisterFormData) {
    setError({});

    if (
      !data.email.trim() ||
      !data.password.trim() ||
      !data.confirmPassword.trim() ||
      !data.username.trim()
    ) {
      setError("Vui lòng điền đầy đủ thông tin");
      return false;
    }

    if (data.password !== data.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return false;
    }

    if (data.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }

    setLoading(true);
    try {
      const res = await userService.register(
        data.username,
        data.email,
        data.password,
        data.confirmPassword,
      );
      return res?.success ?? false;
    } catch (e: any) {
      setError(parseResDataOrMessage(e?.response?.data));
      return false;
    } finally {
      setLoading(false);
    }
  }

  return {
    register: register,
    error: error,
    loading: loading,
  };
}

export function useUserActivate(code: string | undefined) {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!code) {
      setStatus("error");
      setErrorMessage("Mã kích hoạt không hợp lệ.");
      return;
    }

    const activate = async () => {
      try {
        const res = await userService.activate(code);
        if (res?.success || res?.code === 200) {
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMessage("Kích hoạt thất bại. Vui lòng thử lại.");
        }
      } catch (e: any) {
        setStatus("error");
        const parsedError = parseResDataOrMessage(e?.response?.data);
        if (typeof parsedError === "string") {
          setErrorMessage(parsedError);
        } else {
          setErrorMessage("Đã có lỗi xảy ra. Kích hoạt thất bại.");
        }
      }
    };

    activate();
  }, [code]);

  return { status, errorMessage };
}

