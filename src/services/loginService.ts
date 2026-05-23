import { API } from "@/common/constants";
import http from "@/lib/http";
import BaseService from "@/types/base/BaseService";
import type { TokenResult } from "@/types/interfaces/auth/TokenResult";
import type { ApiResultGeneric } from "@/types/interfaces/result/apiResult";

export class LoginService extends BaseService {
    async login(email: string, password: string): Promise<ApiResultGeneric<TokenResult> | undefined> {
        const data: any = {
            email: email,
            password: password
        }
        try {
            const response = await http.post<ApiResultGeneric<TokenResult>>(`/${API.LOGIN}`, data);
            return response;
        } catch (e) {
            console.error(e)
            return undefined;
        }
    }

    async logout() {
        try {
            const response = await http.post<ApiResultGeneric<undefined>>(`/${API.LOGIN}`);
            if (response.success === true) return true
        } catch (e) {
            console.error(e)
            return false
        }
    }
}

export default new LoginService();
