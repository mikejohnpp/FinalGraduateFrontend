import Default from "@/views/layouts/Default";
import React from "react";
import {
    createBrowserRouter,
    type RouteObject,
} from "react-router-dom";

export const PATH_CONSTRAINT = {
    HOME: "/",
    LOGIN: "/login",
    // CHAT: "/chat",
    // REGISTER: "/register",
};

const Home = React.lazy(() => import("@/views/home/Home"));
const Login = React.lazy(() => import("@/views/login/Login"));

const routes: RouteObject[] = [
    { path: PATH_CONSTRAINT.HOME, element: <Home /> },
    { path: PATH_CONSTRAINT.LOGIN, element: <Login /> },
];

const router = createBrowserRouter([
    {
        element: <Default />,
        errorElement: <div>Đã có lỗi xảy ra</div>,
        children: routes,
    },
]);

export default router;