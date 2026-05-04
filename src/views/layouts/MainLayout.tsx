import FriendsHeader from "@/components/friends/FriendsHeader";
import OverlaySpinner from "@/components/OverlaySpinner";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <main className="min-h-svh bg-background text-foreground dark">
      <FriendsHeader />
      <Suspense fallback={<OverlaySpinner show text="Đang tải..." />}>
        <Outlet />
      </Suspense>
    </main>
  );
}
