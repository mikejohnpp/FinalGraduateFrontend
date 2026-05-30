import React from "react";
import type { RouteObject } from "react-router-dom";

const GROUP_PATH_CONSTRAINT = {
  GROUPS: "/groups",
  GROUPS_DISCOVER: "/groups/discover",
  GROUPS_MINE: "/groups/mine",
  GROUPS_CREATE: "/groups/create",
  GROUP_DETAIL: "/groups/:groupId",
};

const GroupsLayout = React.lazy(() => import("@/views/layouts/GroupsLayout"));
const GroupsFeed = React.lazy(() => import("@/views/groups/GroupsFeed"));
const GroupsDiscover = React.lazy(() => import("@/views/groups/GroupsDiscover"));
const GroupsMine = React.lazy(() => import("@/views/groups/GroupsMine"));
const GroupCreate = React.lazy(() => import("@/views/groups/GroupCreate"));
const GroupDetail = React.lazy(() => import("@/views/groups/GroupDetail"));

const groupsRoutes: RouteObject[] = [
  { path: GROUP_PATH_CONSTRAINT.GROUPS_CREATE, element: <GroupCreate /> },
  {
    element: <GroupsLayout />,
    children: [
      { path: GROUP_PATH_CONSTRAINT.GROUPS, element: <GroupsFeed /> },
      {
        path: GROUP_PATH_CONSTRAINT.GROUPS_DISCOVER,
        element: <GroupsDiscover />,
      },
      { path: GROUP_PATH_CONSTRAINT.GROUPS_MINE, element: <GroupsMine /> },
      { path: GROUP_PATH_CONSTRAINT.GROUP_DETAIL, element: <GroupDetail /> },
    ],
  },
];

export { GROUP_PATH_CONSTRAINT, groupsRoutes };
