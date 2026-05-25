import React from "react";
import type { RouteObject } from "react-router-dom";

const MESSENGER_ROUTE_CONSTRAINT = {
  MESSENGER: "messenger",
};

const Messenger = React.lazy(() => import("@/views/messenger/Messenger"));

const messengerRoutes: RouteObject[] = [
  { path: MESSENGER_ROUTE_CONSTRAINT.MESSENGER, element: <Messenger /> },
];

export { MESSENGER_ROUTE_CONSTRAINT, messengerRoutes };
