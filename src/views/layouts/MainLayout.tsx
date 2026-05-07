import Header from "@/components/Header";
import OverlaySpinner from "@/components/OverlaySpinner";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <main className="min-h-svh bg-background text-foreground dark">
      <Header />
      <Suspense fallback={<OverlaySpinner show text="Đang tải..." />}>
        <Outlet />
      </Suspense>
    </main>
  );
}
