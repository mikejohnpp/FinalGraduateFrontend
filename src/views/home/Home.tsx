import LeftSidebar from "@/components/home/LeftSidebar";
import NewsFeed from "@/components/home/NewsFeed";
import RightSidebar from "@/components/home/RightSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  return (
    <div className="flex h-[calc(100vh-62px)] justify-center overflow-hidden">
      <LeftSidebar />
      <ScrollArea className="mt-13 min-w-0 flex-1 overflow-y-auto md:mt-0">
        <NewsFeed />
      </ScrollArea>
      <RightSidebar />
    </div>
  );
}
