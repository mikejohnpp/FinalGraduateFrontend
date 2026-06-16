import React, { Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import AdminLayout from "@/views/layouts/AdminLayout";
import OverlaySpinner from "@/components/OverlaySpinner";

const UserManagement = React.lazy(() => import("@/views/admin/UserManagement"));
const GroupManagement = React.lazy(() => import("@/views/admin/GroupManagement"));
const SentimentStats = React.lazy(() => import("@/views/admin/SentimentStats"));
const SentimentItems = React.lazy(() => import("@/views/admin/SentimentItems"));
const SystemReport = React.lazy(() => import("@/views/admin/SystemReport"));

export const ADMIN_PATH_CONSTRAINT = {
  ADMIN: "/admin",
  ADMIN_SENTIMENT: "/admin/sentiment",
  ADMIN_SENTIMENT_ITEMS: "/admin/sentiment/items",
  ADMIN_REPORTS: "/admin/reports",
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
      {
        path: "sentiment",
        element: <SentimentStats />,
      },
      {
        path: "sentiment/items",
        element: <SentimentItems />,
      },
      {
        path: "reports",
        element: <SystemReport />,
      },
    ],
  }
];

