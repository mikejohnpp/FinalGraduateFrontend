import BaseService from "@/types/base/BaseService";
import type { LoginStatus } from "@/types/LoginCredentials";

const LOCAL_USER_KEY = "local_user";

export class LoginService extends BaseService {
    async login(username: string, password: string): Promise<LoginStatus> {
        const status: LoginStatus = {
            status: "success",
            token: "4324jkhj5kh234kj324234jk3j423l",
            username: username
        };
        return status;
    }

    async logout() {
        return true;
    }
}

export default new LoginService();
