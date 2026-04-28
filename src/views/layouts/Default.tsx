import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import OverlaySpinner from "@/components/OverlaySpinner";

export default function Default() {
    return (
        <>
            <main>
                <Suspense fallback={<OverlaySpinner show text="Đang tải..." />}>
                    <Outlet />
                </Suspense>
            </main>
        </>
    );
}