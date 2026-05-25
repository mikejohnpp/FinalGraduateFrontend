import type { RouteObject } from "react-router-dom";
import React from "react";

const FRIENDS_PATH_CONSTRAINT = {
  FRIENDS: "friends",
};

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

const friendRoutes: RouteObject[] = [
  {
    path: FRIENDS_PATH_CONSTRAINT.FRIENDS,
    element: <Friends />,
    children: [
      { index: true, element: <FriendsHome /> },
      { path: "request", element: <FriendsRequests /> },
      { path: "suggest", element: <FriendsSuggest /> },
      { path: "all", element: <FriendsAll /> },
    ],
  },
];

export { FRIENDS_PATH_CONSTRAINT as FRIENDS_PATH_CONSTRAINS, friendRoutes };
