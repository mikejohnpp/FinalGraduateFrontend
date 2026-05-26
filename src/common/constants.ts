export const API = {
  REFRESH: "api/auth/refresh-token",
  LOGIN: "api/auth/login",
  LOGOUT: "api/auth/logout",
  REGISTER: "api/auth/register",
  ACTIVE: "api/auth/active",

  POST: {
    BASE: "users/posts",
    SUGGESTED: "users/posts/suggested",
    SEARCH: "users/posts/search",
  }
};

export const AUTH_TOKEN_NAME = "access_token";
