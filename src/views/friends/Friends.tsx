import { Outlet } from "react-router-dom";

import FriendsSidebar from "@/components/friends/FriendsSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Friends() {
  const isMobile = useIsMobile();
  return (
    <div className="flex w-full flex-col px-0 py-0 md:grid md:grid-cols-[320px_1fr] md:overflow-hidden">
      <aside className="md:block md:h-[calc(100vh-62px)] md:w-80 lg:block">
        <FriendsSidebar />
      </aside>
      <section>
        <Outlet />
      </section>
    </div>
  );
}
