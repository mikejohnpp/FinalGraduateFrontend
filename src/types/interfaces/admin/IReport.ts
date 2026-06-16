/** Số liệu tổng quan hệ thống cho dashboard báo cáo. */
export interface ReportOverviewDTO {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    totalGroups: number;
    activeGroups: number;
    totalPosts: number;
    totalComments: number;
}
