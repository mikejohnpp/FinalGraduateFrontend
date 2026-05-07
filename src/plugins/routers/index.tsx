import Default from "@/views/layouts/Default";
import MainLayout from "@/views/layouts/MainLayout";
import React from "react";
import { createBrowserRouter, type RouteObject } from "react-router-dom";

export const PATH_CONSTRAINT = {
  HOME: "/",
  LOGIN: "login",
  REGISTER: "register",
  FRIENDS: "friends",
  MESSENGER: "messenger",
  PROFILE: "/profile/:userId",
};

const Home = React.lazy(() => import("@/views/home/Home"));
const Login = React.lazy(() => import("@/views/auth/Login"));
const Register = React.lazy(() => import("@/views/auth/Register"));
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
const Messenger = React.lazy(
  () => import("@/views/messenger/Messenger"),
);
const Profile = React.lazy(() => import("@/views/profile/Profile"));

const authRoutes: RouteObject[] = [
  { path: PATH_CONSTRAINT.LOGIN, element: <Login /> },
  { path: PATH_CONSTRAINT.REGISTER, element: <Register /> },
];

const mainRoutes: RouteObject[] = [
  { index: true, element: <Home /> },
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
  { path: PATH_CONSTRAINT.PROFILE, element: <Profile /> },
];

const messengerRoutes: RouteObject[] = [
  { path: PATH_CONSTRAINT.MESSENGER, element: <Messenger /> },
];

const router = createBrowserRouter([
  {
    element: <Default />,
    errorElement: <div>Đã có lỗi xảy ra</div>,
    children: [...authRoutes],
  },
  {
    element: <MainLayout />,
    errorElement: <div>Đã có lỗi xảy ra</div>,
    children: [...mainRoutes, ...messengerRoutes],
  },
]);

export default router;
