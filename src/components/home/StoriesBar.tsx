import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { RootState } from "@/stores/store";
import { useSelector } from "react-redux";
import AnhAvatar from "@/assets/images/AnhAvatar.jpg";

export default function StoriesBar() {
  const userCurrent = useSelector((state: RootState) => state.user);
  return (
    <ScrollArea className="w-full">
      <div className="flex flex-row gap-2 py-2">
        <div className="flex shrink-0 flex-col items-center justify-center gap-3 rounded-2xl bg-muted hover:cursor-pointer hover:bg-muted/80">
          <img
            src={userCurrent?.profile?.avatar || AnhAvatar}
            alt="Avatar"
            className="h-30 w-30 rounded-t-2xl object-fill"
          />
          <div className="relative w-full p-2 text-center text-sm font-semibold before:absolute before:-top-15 before:right-0 before:bottom-0 before:left-0 before:z-2 before:m-auto before:flex before:h-7.5 before:w-7.5 before:items-center before:justify-center before:rounded-full before:bg-blue-500 before:text-3xl before:transition before:duration-300 before:ease-in-out before:content-['+'] after:absolute after:-top-15 after:right-0 after:bottom-0 after:left-0 after:z-1 after:m-auto after:h-10 after:w-10 after:rounded-full after:bg-muted after:content-[''] hover:before:scale-110">
            <h3>Tạo tin</h3>
          </div>
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
