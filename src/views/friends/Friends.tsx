import { Outlet } from "react-router-dom";

import FriendsSidebar from "@/components/friends/FriendsSidebar";

export default function Friends() {
  return (
    <div className="flex w-full gap-4 px-0 py-0 min-h-svh">
      <aside className="sticky top-0 h-screen w-80 shrink-0 lg:block z-30">
        <FriendsSidebar />
      </aside>
      <section className="min-h-svh flex-1 px-4 py-4">
        <Outlet />
      </section>
    </div>
  );
}
