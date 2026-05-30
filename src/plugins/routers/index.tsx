import Default from "@/views/layouts/Default";
import MainLayout from "@/views/layouts/MainLayout";
import { createBrowserRouter } from "react-router-dom";
import { friendRoutes, FRIENDS_PATH_CONSTRAINS as FRIENDS_PATH_CONSTRAINT } from "./friendRoutes";
import { GROUP_PATH_CONSTRAINT, groupsRoutes } from "./groupRoutes";
import { AUTH_PATH_CONSTRAINT, authRoutes } from "./authRoutes";
import { MESSENGER_ROUTE_CONSTRAINT, messengerRoutes } from "./messengerRoutes";
import { PROFILE_PATH_CONSTRAINT, profileRoutes } from "./profileRoutes";
import { HOME_PATH_CONSTRAINT, homeRoutes } from "./homeRoutes";

export const PATH_CONSTRAINT = {
  ...HOME_PATH_CONSTRAINT,
  ...AUTH_PATH_CONSTRAINT,
  ...FRIENDS_PATH_CONSTRAINT,
  ...GROUP_PATH_CONSTRAINT,
  ...MESSENGER_ROUTE_CONSTRAINT,
  ...PROFILE_PATH_CONSTRAINT,
};

const router = createBrowserRouter([
  {
    element: <Default />,
    errorElement: <div>Đã có lỗi xảy ra</div>,
    children: [...authRoutes],
  },
  {
    element: <MainLayout />,
    errorElement: <div>Đã có lỗi xảy ra</div>,
    children: [
      ...homeRoutes,
      ...messengerRoutes,
      ...groupsRoutes,
      ...profileRoutes,
      ...friendRoutes,
    ],
  },
]);

export default router;
