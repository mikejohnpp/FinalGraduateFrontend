import GroupsSidebar from "@/components/groups/GroupsSidebar";
import { Outlet } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function GroupsLayout() {
  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-background">
      <GroupsSidebar />
      <ScrollArea className="flex-1 h-full">
        <main className="min-h-full">
          <Outlet />
        </main>
      </ScrollArea>
    </div>
  );
}
