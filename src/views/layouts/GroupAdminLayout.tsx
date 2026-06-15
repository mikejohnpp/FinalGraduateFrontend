import { Suspense } from "react";
import { Outlet, useParams } from "react-router-dom";
import GroupAdminSidebar from "@/components/groups/GroupAdminSidebar";
import OverlaySpinner from "@/components/OverlaySpinner";

export default function GroupAdminLayout() {
  const { groupId } = useParams<{ groupId: string }>();

  if (!groupId) return null;

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-background">
      <GroupAdminSidebar groupId={groupId} />
      <div className="flex-1 overflow-y-auto relative">
        <Suspense fallback={<OverlaySpinner show={true} text="Đang tải..." />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}
