import Default from "@/views/layouts/Default";
import MainLayout from "@/views/layouts/MainLayout";
import React from "react";
import { createBrowserRouter, type RouteObject } from "react-router-dom";

export const PATH_CONSTRAINT = {
  HOME: "/",
  LOGIN: "login",
  FRIENDS: "friends",
  // CHAT: "/chat",
  // REGISTER: "/register",
};

const Home = React.lazy(() => import("@/views/home/Home"));
const Login = React.lazy(() => import("@/views/login/Login"));
const Friends = React.lazy(() => import("@/views/friends/Friends"));
const FriendsHome = React.lazy(
  () => import("@/views/friends/partials/FriendsHome"),
);
const FriendsRequests = React.lazy(
  () => import("@/views/friends/partials/FriendsRequests"),
);
const FriendsSuggest = React.lazy(
  () => import("@/views/friends/partials/FriendsSuggest"),
);
const FriendsAll = React.lazy(
  () => import("@/views/friends/partials/FriendsAll"),
);

const routes: RouteObject[] = [
  { path: PATH_CONSTRAINT.HOME, element: <Home /> },
  { path: PATH_CONSTRAINT.LOGIN, element: <Login /> },
];

const friendRoutes: RouteObject[] = [
  {
    path: PATH_CONSTRAINT.FRIENDS,
    element: <Friends />,
    children: [
      { index: true, element: <FriendsHome /> },
      { path: "request", element: <FriendsRequests /> },
      { path: "suggest", element: <FriendsSuggest /> },
      { path: "all", element: <FriendsAll /> },
    ],
  },
];

const router = createBrowserRouter([
  {
    element: <Default />,
    errorElement: <div>Đã có lỗi xảy ra</div>,
    children: routes,
  },
  {
    element: <MainLayout />,
    errorElement: <div>Đã có lỗi xảy ra</div>,
    children: friendRoutes,
  },
]);

export default router;
