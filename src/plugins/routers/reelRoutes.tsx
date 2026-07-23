import { lazy, Suspense } from "react";
import type { RouteObject } from "react-router-dom";
import OverlaySpinner from "@/components/OverlaySpinner";

const Reels = lazy(() => import("@/views/reels/Reels"));

export const REEL_PATH_CONSTRAINT = {
  REELS: "reels",
};

export const reelRoutes: RouteObject[] = [
  {
    path: REEL_PATH_CONSTRAINT.REELS,
    element: (
      <Suspense fallback={<OverlaySpinner show text="Đang tải Reels..." />}>
        <Reels />
      </Suspense>
    ),
  },
];
