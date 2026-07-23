import { Image, Video, Type } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AnhAvatar from "@/assets/images/AnhAvatar.jpg";
import type { StoryType } from "../types";
import { useIsMobile } from "@/hooks/use-mobile";

interface Props {
  user: any;
  onSelect: (type: StoryType) => void;
}

export default function StoryTypePicker({ user, onSelect }: Props) {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="flex items-center gap-3 px-4 py-3">
        <Avatar className="size-10 ring-2 ring-primary">
          <AvatarImage src={user?.profile?.avatar || AnhAvatar} />
          <AvatarFallback>{user?.username?.charAt(0)?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-semibold text-foreground">{user?.username || "Bạn"}</span>
      </div>

      <div className="flex flex-col gap-3 px-4 py-2">
        {!isMobile && (
          <>
            <button
              onClick={() => onSelect("image")}
              className="group flex items-center gap-4 rounded-2xl border border-border bg-muted p-4 text-left transition-all hover:bg-accent"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/30 transition-transform group-hover:scale-105">
                <Image className="size-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Tạo tin có ảnh hoặc video</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Thêm ảnh, video và chú thích</p>
              </div>
            </button>

            <button
              onClick={() => onSelect("video")}
              className="group flex items-center gap-4 rounded-2xl border border-border bg-muted p-4 text-left transition-all hover:bg-accent"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-red-500 shadow-lg shadow-pink-500/30 transition-transform group-hover:scale-105">
                <Video className="size-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Tạo tin dạng video</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Chỉ cần chọn video của bạn</p>
              </div>
            </button>
          </>
        )}

        <button
          onClick={() => onSelect("text")}
          className="group flex items-center gap-4 rounded-2xl border border-border bg-muted p-4 text-left transition-all hover:bg-accent"
        >
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-pink-400 shadow-lg shadow-fuchsia-500/30 transition-transform group-hover:scale-105">
            <Type className="size-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Tạo tin dạng văn bản</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Chọn nền màu và thêm nhạc</p>
          </div>
        </button>
      </div>
    </div>
  );
}
