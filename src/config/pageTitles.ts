export const APP_NAME = "Misa App";
export const TITLE_SEPARATOR = " - ";

export const PAGE_TITLES: Record<string, string | null> = {
    "/": null,

    // Auth
    "/login": "Đăng nhập",
    "/register": "Đăng ký",
    "/forgot-password": "Quên mật khẩu",
    "/kich-hoat/:code": "Kích hoạt tài khoản",

    // Story
    "/story/create": "Tạo tin",
    "/stories": "Tin",

    // Friends
    "/friends": "Bạn bè",
    "/friends/request": "Lời mời kết bạn",
    "/friends/suggest": "Gợi ý kết bạn",
    "/friends/all": "Tất cả bạn bè",

    // Groups
    "/groups": "Nhóm",
    "/groups/discover": "Khám phá nhóm",
    "/groups/mine": "Nhóm của bạn",
    "/groups/create": "Tạo nhóm",
    "/groups/:groupId": "Nhóm",
    "/groups/:groupId/admin": "Quản trị nhóm",
    "/groups/:groupId/admin/community": "Quản trị nhóm",
    "/groups/:groupId/admin/overview": "Tổng quan nhóm",
    "/groups/:groupId/admin/member-requests": "Yêu cầu tham gia",
    "/groups/:groupId/admin/pending-posts": "Bài viết chờ duyệt",

    // Messenger
    "/messenger": "Tin nhắn",

    // Reels
    "/reels": "Reels",

    // Profile
    "/profile/:userId": "Trang cá nhân",

    // Admin
    "/admin": "Quản trị",
    "/admin/users": "Quản lý người dùng",
    "/admin/groups": "Quản lý nhóm",
    "/admin/sentiment": "Thống kê cảm xúc",
    "/admin/sentiment/items": "Chi tiết cảm xúc",
    "/admin/reports": "Báo cáo hệ thống",
};

export const FALLBACK_PAGE_TITLE: string | null = null;
