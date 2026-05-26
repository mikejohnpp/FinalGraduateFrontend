import React from "react";
import type { RouteObject } from "react-router-dom";

const AUTH_PATH_CONSTRAINT = {
  LOGIN: "/login",
  REGISTER: "/register",
  ACTIVATE: "/kich-hoat/:code",
};

const Login = React.lazy(() => import("@/views/auth/Login"));
const Register = React.lazy(() => import("@/views/auth/Register"));
const ActivateAccount = React.lazy(() => import("@/views/auth/ActivateAccount"));

const authRoutes: RouteObject[] = [
  { path: AUTH_PATH_CONSTRAINT.LOGIN, element: <Login /> },
  { path: AUTH_PATH_CONSTRAINT.REGISTER, element: <Register /> },
  { path: AUTH_PATH_CONSTRAINT.ACTIVATE, element: <ActivateAccount /> },
];

export { AUTH_PATH_CONSTRAINT, authRoutes };
