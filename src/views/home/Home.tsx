import LeftSidebar from "@/components/home/LeftSidebar";
import NewsFeed from "@/components/home/NewsFeed";
import RightSidebar from "@/components/home/RightSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useReels } from "@/hooks/useReel";

export default function Home() {

  // Call useReels to clear and fetch all reels when navigating to home page
  useReels();

  return (
    <div className="flex h-[calc(100vh-62px)] justify-center overflow-hidden">
      <LeftSidebar />
      <ScrollArea className="mt-13 min-w-0 flex-1 md:mt-0">
        <NewsFeed />
      </ScrollArea>
      <RightSidebar />
    </div>
  );
}
