import http from "@/lib/http";
import BaseService from "@/types/base/BaseService";
import type { TokenResult } from "@/types/interfaces/auth/TokenResult";
import type { ApiResultGeneric } from "@/types/interfaces/result/apiResult";

export class LoginService extends BaseService {
    async login(email: string, password: string): Promise<ApiResultGeneric<TokenResult>> {
        const data: any = {
            email: email,
            password: password
        }
        const response = await http.post<ApiResultGeneric<TokenResult>>("/api/auth/login", data);
        return response;
    }

    async logout() {
        return true;
    }
}

export default new LoginService();
