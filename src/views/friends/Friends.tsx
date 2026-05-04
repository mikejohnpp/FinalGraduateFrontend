import { Outlet } from "react-router-dom";

import FriendsSidebar from "@/components/friends/FriendsSidebar";

export default function Friends() {
  return (
    <div className="light">
      <div className="min-h-svh bg-background text-foreground">
        <div className="flex min-h-[calc(100svh-3.5rem)] w-full gap-4 px-0 py-0">
          <aside className="hidden w-80 shrink-0 lg:block">
            <FriendsSidebar />
          </aside>
          <section className="flex-1 px-4 py-4">
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  );
}
