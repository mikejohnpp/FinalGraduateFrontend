import LeftSidebar from "@/components/home/LeftSidebar";
import NewsFeed from "@/components/home/NewsFeed";
import RightSidebar from "@/components/home/RightSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  return (
    <div className="flex justify-center h-[calc(100vh-62px)] overflow-hidden">
      <LeftSidebar />
      <ScrollArea className="flex-1 min-w-0 overflow-y-auto">
        <NewsFeed />
      </ScrollArea>
      <RightSidebar />
    </div>
  );
}
