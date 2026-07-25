import { Outlet } from "react-router-dom";

import FriendsSidebar from "@/components/friends/FriendsSidebar";

export default function Friends() {
  return (

    <div className="flex w-full flex-col px-0 py-0 md:grid md:h-[calc(100vh-62px)] md:grid-cols-[320px_1fr] md:overflow-hidden">
      <aside className="md:block md:h-full md:w-80 lg:block">
        <FriendsSidebar />
      </aside>
      <section className="md:h-full md:overflow-hidden">
        <Outlet />
      </section>
    </div>

  );
}
