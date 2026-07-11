import BaseService from "@/types/base/BaseService";
import http from "@/lib/http";
import { API } from "@/common/constants";
import type { ApiResult } from "@/types/interfaces/result/apiResult";

export class NotificationService extends BaseService {
    /** PUT /notifications/{id}/read?userId={userId} */
    async markAsRead(id: number, userId: number): Promise<boolean> {
        const response = await http.put<ApiResult>(
            `${API.NOTIFICATION.BASE}/${id}/read?userId=${userId}`,
            null,
        );
        return response.success ?? response.code === 200;
    }

    /** PUT /notifications/read-all?userId={userId} */
    async markAllAsRead(userId: number): Promise<boolean> {
        const response = await http.put<ApiResult>(
            `${API.NOTIFICATION.READ_ALL}?userId=${userId}`,
            null,
        );
        return response.success ?? response.code === 200;
    }
}

export default new NotificationService();
