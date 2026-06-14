import React, { Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import AdminLayout from "@/views/layouts/AdminLayout";
import OverlaySpinner from "@/components/OverlaySpinner";

const UserManagement = React.lazy(() => import("@/views/admin/UserManagement"));
const GroupManagement = React.lazy(() => import("@/views/admin/GroupManagement"));

export const ADMIN_PATH_CONSTRAINT = {
  ADMIN: "/admin",
};

export const adminRoutes: RouteObject[] = [
  {
    path: ADMIN_PATH_CONSTRAINT.ADMIN,
    element: (
      <Suspense fallback={<OverlaySpinner show text="Đang tải Admin..." />}>
        <AdminLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <UserManagement />,
      },
      {
        path: "users",
        element: <UserManagement />,
      },
      {
        path: "groups",
        element: <GroupManagement />,
      },
    ],
  }
];
