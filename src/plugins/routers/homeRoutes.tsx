import React from "react";
import type { RouteObject } from "react-router-dom";

const HOME_PATH_CONSTRAINT = {
  HOME: "/",
  CREATE_STORY: "/story/create",
};

const Home = React.lazy(() => import("@/views/home/Home"));
const CreateStory = React.lazy(() => import("@/views/story/CreateStory"));
const StoryViewer = React.lazy(() => import("@/views/story/StoryViewer"));

const homeRoutes: RouteObject[] = [
  { index: true, element: <Home /> },
  { path: "story/create", element: <CreateStory /> },
  { path: "stories", element: <StoryViewer /> },
];

export { HOME_PATH_CONSTRAINT, homeRoutes };
