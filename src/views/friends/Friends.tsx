import { Outlet } from "react-router-dom";

import FriendsSidebar from "@/components/friends/FriendsSidebar";

export default function Friends() {
  return (
    <div className="grid grid-cols-[320px_1fr] overflow-hidden w-full px-0 py-0">
      <aside className="h-[calc(100vh-62px)] w-80 shrink-0 lg:block">
        <FriendsSidebar />
      </aside>
      <section className="h-[calc(100vh-62px)] overflow-hidden">
        <Outlet />
      </section>
    </div>
  );
}
