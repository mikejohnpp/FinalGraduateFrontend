export const API = {
  REFRESH: "auth/refresh-token",
  LOGIN: "auth/login",
  LOGOUT: "auth/logout",
  REGISTER: "auth/register",
  ACTIVE: "auth/active",

  POST: {
    BASE: "users/posts",
    SUGGESTED: "users/posts/suggested",
    SEARCH: "users/posts/search",
  },

  GROUP: {
    BASE: "users/groups",
    JOINED: "users/groups/joined",
    SUGGESTED: "users/groups/suggested",
    FEED: "users/groups/posts/feed",
  },

  COMMENT: {
    PATH: "comments",
    REPLIES_PATH: "replies",
    LIKE_PATH: "like",
  },

  FRIEND: {
    BASE: "users/friends", // GET danh sách bạn bè, DELETE unfriend
    REQUESTS: "users/friends/requests", // GET lời mời, POST gửi lời mời
    REQUESTS_COUNT: "users/friends/requests/count", // GET badge count
    SUGGESTIONS: "users/friends/suggestions", // GET gợi ý bạn bè
  },

  NOTIFICATION: {
    BASE: "notifications", // GET danh sách thông báo
    UNREAD_COUNT: "notifications/unread-count", // GET badge count chưa đọc
    READ_ALL: "notifications/read-all", // PUT đánh dấu tất cả đã đọc
    // PUT notifications/{id}/read — đánh dấu 1 thông báo đã đọc
  },


  PROFILE: {
    BASE: "users",
    UPDATE: "users/profile",
    AVATAR: "users/profile/avatar",
    COVER: "users/profile/cover",
  },

  SEARCH: "users/search",

  ADMIN: {
    USERS: "users/admin/users",
    GROUPS: "users/admin/groups",
    SENTIMENT_OVERVIEW: "users/admin/sentiment/overview",
    SENTIMENT_ITEMS: "users/admin/sentiment/items",
    REPORT_OVERVIEW: "users/admin/reports/overview",
    REPORT_EXPORT: "users/admin/reports/export",
  },


  GROUP_ADMIN: {
    INFO: "users/groups", // Sẽ append /admin/info
    STATS: "users/groups", // Sẽ append /admin/stats
    MEMBER_REQUESTS: "users/groups", // Sẽ append /admin/member-requests
    MEMBER_APPROVE: "users/groups", // Sẽ append /admin/member-requests/approve
    MEMBER_REJECT: "users/groups", // Sẽ append /admin/member-requests/reject
    PENDING_POSTS: "users/groups", // Sẽ append /admin/pending-posts
    POST_APPROVE: "users/groups", // Sẽ append /admin/pending-posts/.../approve
    POST_REJECT: "users/groups", // Sẽ append /admin/pending-posts/.../reject
  },
};

export const AUTH_TOKEN_NAME = "access_token";
