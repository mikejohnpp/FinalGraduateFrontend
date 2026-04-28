import type { LoginStatus } from "@/types/LoginCredentials";

const LOCAL_USER_KEY = "local_user";

export const loginSevice = {
    login: (username: string, password: string): LoginStatus => {
        const status: LoginStatus = {
            status: "success",
            token: "4324jkhj5kh234kj324234jk3j423l",
            username: username
        };
        return status;
    },
    logout: () => {
        return true;
    }
}


