import React from "react";
import type { RouteObject } from "react-router-dom";

const HOME_PATH_CONSTRAINT = {};

const Home = React.lazy(() => import("@/views/home/Home"));

const homeRoutes: RouteObject[] = [{ index: true, element: <Home /> }];

export { HOME_PATH_CONSTRAINT, homeRoutes };
