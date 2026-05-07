import Header from "@/components/Header";
import OverlaySpinner from "@/components/OverlaySpinner";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <main className="flex min-h-svh flex-col bg-background text-foreground">
      <Header />
      <div className="min-h-0 flex-1">
        <Suspense fallback={<OverlaySpinner show text="Đang tải..." />}>
          <Outlet />
        </Suspense>
      </div>
    </main>
  );
}
