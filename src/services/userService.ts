import { API } from "@/common/constants";
import http from "@/lib/http";
import BaseService from "@/types/base/BaseService";
import type { RegisterFormData } from "@/types/interfaces/auth/RegisterFormData";
import type { TokenResult } from "@/types/interfaces/auth/TokenResult";
import type { ApiResultGeneric } from "@/types/interfaces/result/apiResult";
import type { UserProfileDTO } from "@/types/interfaces/user/UserProfileDTO";

export class UserService extends BaseService {
    async login(email: string, password: string): Promise<ApiResultGeneric<TokenResult> | undefined> {
        const data: any = {
            email: email,
            password: password
        }
        try {
            const response = await http.post<ApiResultGeneric<TokenResult>>(
                `/${API.LOGIN}`,
                data,
                { withCredentials: true }
            );
            return response;
        } catch (e) {
            console.error(e)
            return Promise.reject(e);
        }
    }

    async logout(): Promise<ApiResultGeneric<undefined> | undefined> {
        try {
            const response = await http.post<ApiResultGeneric<undefined>>(`/${API.LOGOUT}`);
            return response;
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async register(userName: string, email: string, password: string, confirmPassword: string): Promise<ApiResultGeneric<undefined> | undefined> {
        try {
            const data: any = {
                userName: userName,
                email: email,
                password: password,
                confirmPassword: confirmPassword
            };
            const res = await http.post<ApiResultGeneric<undefined>>(API.REGISTER, data);
            return res;
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async activate(code: string): Promise<ApiResultGeneric<undefined> | undefined> {
        try {
            const res = await http.get<ApiResultGeneric<undefined>>(`${API.ACTIVE}`, { code: code });
            return res;
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async getProfile(userId: number): Promise<ApiResultGeneric<UserProfileDTO> | undefined> {
        try {
            const res = await http.get<ApiResultGeneric<UserProfileDTO>>(`/users/${userId}/profile`);
            return res;
        } catch (e) {
            return Promise.reject(e);
        }
    }
}

export default new UserService();
