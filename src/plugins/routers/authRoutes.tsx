import React from "react";
import type { RouteObject } from "react-router-dom";

const AUTH_PATH_CONSTRAINT = {
  LOGIN: "login",
  REGISTER: "register",
};

const Login = React.lazy(() => import("@/views/auth/Login"));
const Register = React.lazy(() => import("@/views/auth/Register"));

const authRoutes: RouteObject[] = [
  { path: AUTH_PATH_CONSTRAINT.LOGIN, element: <Login /> },
  { path: AUTH_PATH_CONSTRAINT.REGISTER, element: <Register /> },
];

export { AUTH_PATH_CONSTRAINT, authRoutes };
