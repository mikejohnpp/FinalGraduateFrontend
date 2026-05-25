import React from "react";
import type { RouteObject } from "react-router-dom";

const PROFILE_PATH_CONSTRAINT = {
  PROFILE: "/profile/:userId",
};

const Profile = React.lazy(() => import("@/views/profile/Profile"));

const profileRoutes: RouteObject[] = [
  { path: PROFILE_PATH_CONSTRAINT.PROFILE, element: <Profile /> },
];

export { PROFILE_PATH_CONSTRAINT, profileRoutes };
