import Default from "@/views/layouts/Default";
import MainLayout from "@/views/layouts/MainLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createBrowserRouter } from "react-router-dom";
import { friendRoutes, FRIENDS_PATH_CONSTRAINS as FRIENDS_PATH_CONSTRAINT } from "./friendRoutes";
import { GROUP_PATH_CONSTRAINT, groupsRoutes } from "./groupRoutes";
import { AUTH_PATH_CONSTRAINT, authRoutes } from "./authRoutes";
import { MESSENGER_ROUTE_CONSTRAINT, messengerRoutes } from "./messengerRoutes";
import { PROFILE_PATH_CONSTRAINT, profileRoutes } from "./profileRoutes";
import { HOME_PATH_CONSTRAINT, homeRoutes } from "./homeRoutes";
import { ADMIN_PATH_CONSTRAINT, adminRoutes } from "./adminRoutes";
import { REEL_PATH_CONSTRAINT, reelRoutes } from "./reelRoutes";

export const PATH_CONSTRAINT = {
  ...HOME_PATH_CONSTRAINT,
  ...AUTH_PATH_CONSTRAINT,
  ...FRIENDS_PATH_CONSTRAINT,
  ...GROUP_PATH_CONSTRAINT,
  ...MESSENGER_ROUTE_CONSTRAINT,
  ...PROFILE_PATH_CONSTRAINT,
  ...ADMIN_PATH_CONSTRAINT,
  ...REEL_PATH_CONSTRAINT,
};

const router = createBrowserRouter([
  {
    element: <Default />,
    errorElement: <div>Đã có lỗi xảy ra</div>,
    children: [...authRoutes],
  },
  {
    element: <ProtectedRoute />,
    errorElement: <div>Đã có lỗi xảy ra</div>,
    children: [
      {
        element: <MainLayout />,
        children: [
          ...homeRoutes,
          ...messengerRoutes,
          ...groupsRoutes,
          ...profileRoutes,
          ...friendRoutes,
          ...reelRoutes,
        ],
      },
    ],
  },
  ...adminRoutes,
]);

export default router;
