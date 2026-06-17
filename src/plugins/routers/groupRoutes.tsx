import React from "react";
import type { RouteObject } from "react-router-dom";

const GROUP_PATH_CONSTRAINT = {
  GROUPS: "/groups",
  GROUPS_DISCOVER: "/groups/discover",
  GROUPS_MINE: "/groups/mine",
  GROUPS_CREATE: "/groups/create",
  GROUP_DETAIL: "/groups/:groupId",
  GROUP_ADMIN: "/groups/:groupId/admin",
  GROUP_COMMUNITY_HOME: "/groups/:groupId/admin/community",
  GROUP_OVERVIEW: "/groups/:groupId/admin/overview",
  GROUP_MEMBER_REQUESTS: "/groups/:groupId/admin/member-requests",
  GROUP_PENDING_POSTS: "/groups/:groupId/admin/pending-posts",
};

const GroupsLayout = React.lazy(() => import("@/views/layouts/GroupsLayout"));
const GroupsFeed = React.lazy(() => import("@/views/groups/GroupsFeed"));
const GroupsDiscover = React.lazy(() => import("@/views/groups/GroupsDiscover"));
const GroupsMine = React.lazy(() => import("@/views/groups/GroupsMine"));
const GroupCreate = React.lazy(() => import("@/views/groups/GroupCreate"));
const GroupDetail = React.lazy(() => import("@/views/groups/GroupDetail"));

const GroupAdminLayout = React.lazy(() => import("@/views/layouts/GroupAdminLayout"));
const GroupCommunityHome = React.lazy(() => import("@/views/groups/partials/GroupCommunityHome"));
const GroupOverview = React.lazy(() => import("@/views/groups/partials/GroupOverview"));
const GroupMemberRequests = React.lazy(() => import("@/views/groups/partials/GroupMemberRequests"));
const GroupPendingPosts = React.lazy(() => import("@/views/groups/partials/GroupPendingPosts"));

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
  {
    element: <GroupAdminLayout />,
    children: [
      { path: GROUP_PATH_CONSTRAINT.GROUP_COMMUNITY_HOME, element: <GroupCommunityHome /> },
      { path: GROUP_PATH_CONSTRAINT.GROUP_OVERVIEW, element: <GroupOverview /> },
      { path: GROUP_PATH_CONSTRAINT.GROUP_MEMBER_REQUESTS, element: <GroupMemberRequests /> },
      { path: GROUP_PATH_CONSTRAINT.GROUP_PENDING_POSTS, element: <GroupPendingPosts /> },
    ],
  },
];

export { GROUP_PATH_CONSTRAINT, groupsRoutes };
