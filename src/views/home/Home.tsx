import LeftSidebar from "@/components/home/LeftSidebar";
import NewsFeed from "@/components/home/NewsFeed";
import RightSidebar from "@/components/home/RightSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { AppDispatch } from "@/stores/store";
import { asyncLogin } from "@/stores/userSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function Home() {
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    dispatch(asyncLogin("tahoangphuc1901@gmail.com", "phucta1901"));
  });
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
