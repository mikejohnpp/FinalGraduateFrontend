import { Image, Video, Type, Music } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AnhAvatar from "@/assets/images/AnhAvatar.jpg";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { StoryType } from "../types";

interface Props {
  storyType: StoryType;
  user: any;
  onSelect: (type: StoryType) => void;
  textContent?: string;
  selectedBg?: string;
  imagePreview?: string | null;
  overlayText?: string;
  onPickImage?: () => void;
  videoPreview?: string | null;
  onPickVideo?: () => void;
  hasMusicText?: boolean;
  musicTitle?: string;
  isMobile: Boolean;
}

export default function StoryPreview({
  storyType,
  user,
  onSelect,
  textContent = "",
  selectedBg = "",
  imagePreview,
  overlayText = "",
  onPickImage,
  videoPreview,
  onPickVideo,
  hasMusicText = false,
  musicTitle = "",
  isMobile,
}: Props) {
  const UserBadge = () => (
    <div className="absolute top-4 left-4 flex items-center gap-2">
      <Avatar className="size-8 ring-2 ring-white/60">
        <AvatarImage src={user?.profile?.avatar || AnhAvatar} />
        <AvatarFallback>{user?.username?.charAt(0)?.toUpperCase()}</AvatarFallback>
      </Avatar>
      <span className="text-xs font-semibold text-white drop-shadow">
        {user?.username || "Bạn"}
      </span>
    </div>
  );

  const MusicTag = () =>
    hasMusicText && musicTitle ? (
      <div className="absolute right-0 bottom-6 left-0 flex justify-center">
        <div className="flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-sm">
          <Music className="size-3.5 animate-pulse text-green-400" />
          <span className="max-w-40 truncate text-xs font-medium text-white">{musicTitle}</span>
        </div>
      </div>
    ) : null;

  const PreviewCaption = () => (
    <p className="text-xs text-muted-foreground">Xem trước tin của bạn</p>
  );

  if (!isMobile && storyType === null) {
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-6">
          {[
            {
              type: "image" as StoryType,
              Icon: Image,
              label: "Tạo tin có ảnh hoặc video",
              bg: "linear-gradient(160deg,#4facfe,#667eea)",
              shadow: "hover:shadow-blue-500/30",
            },
            {
              type: "video" as StoryType,
              Icon: Video,
              label: "Tạo tin dạng video",
              bg: "linear-gradient(160deg,#f093fb,#f5576c)",
              shadow: "hover:shadow-pink-500/30",
            },
            {
              type: "text" as StoryType,
              Icon: Type,
              label: "Tạo tin dạng văn bản",
              bg: "linear-gradient(160deg,#fa709a,#764ba2)",
              shadow: "hover:shadow-fuchsia-500/30",
            },
          ].map(({ type, Icon, label, bg, shadow }) => (
            <button
              key={type}
              onClick={() => onSelect(type)}
              className={cn(
                "group relative h-72 w-48 cursor-pointer overflow-hidden rounded-3xl shadow-2xl transition-all hover:scale-105",
                shadow,
              )}
              style={{ background: bg }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/20 transition-colors group-hover:bg-black/10">
                <div className="flex size-14 items-center justify-center rounded-full bg-black/50">
                  <Icon className="size-6 text-white" />
                </div>
                <span className="px-4 text-center text-sm font-semibold text-white drop-shadow">
                  {label}
                </span>
              </div>
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">Chọn loại tin bạn muốn tạo</p>
      </div>
    );
  }

  if (storyType === "video" && !isMobile) {
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex h-[520px] w-72 items-center justify-center overflow-hidden rounded-3xl bg-muted shadow-2xl">
          {videoPreview ? (
            <video src={videoPreview} className="h-full w-full object-cover" autoPlay loop muted />
          ) : (
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <Video className="size-12" />
              <span className="text-sm">Chọn video để xem trước</span>
            </div>
          )}
          {videoPreview && <UserBadge />}
        </div>
        <PreviewCaption />
      </div>
    );
  }

  if (storyType === "image" && !isMobile) {
    return (
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex h-[520px] w-72 items-center justify-center overflow-hidden rounded-3xl bg-muted shadow-2xl">
          {imagePreview ? (
            <img src={imagePreview} className="h-full w-full object-cover" alt="story preview" />
          ) : (
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <Image className="size-12" />
              <span className="text-sm">Chọn ảnh để xem trước</span>
            </div>
          )}
          {imagePreview && <UserBadge />}
          {overlayText && (
            <div className="absolute right-0 bottom-16 left-0 px-6">
              <div className="rounded-xl bg-black/50 px-4 py-2 text-center backdrop-blur-sm">
                <p className="text-sm font-medium text-white">{overlayText}</p>
              </div>
            </div>
          )}
          <MusicTag />
        </div>
        {/* {!imagePreview && (
          <Button variant="default" onClick={onPickImage} className="rounded-full px-6">
            Chọn ảnh
          </Button>
        )} */}
        <PreviewCaption />
      </div>
    );
  }

  return (
    <div className="mt-10 flex flex-col items-center gap-6">
      <div
        className="relative flex h-[520px] w-72 flex-col items-center justify-center overflow-hidden rounded-3xl shadow-2xl select-none"
        style={{ background: selectedBg }}
      >
        <UserBadge />
        <p
          className={cn(
            "px-8 text-center font-bold text-white drop-shadow-lg transition-all",
            textContent.length > 100
              ? "text-lg"
              : textContent.length > 50
                ? "text-2xl"
                : "text-3xl",
          )}
        >
          {textContent || (
            <span className="text-xl font-normal text-white/40">Nội dung sẽ hiện ở đây...</span>
          )}
        </p>
        <MusicTag />
      </div>
      <PreviewCaption />
    </div>
  );
}
