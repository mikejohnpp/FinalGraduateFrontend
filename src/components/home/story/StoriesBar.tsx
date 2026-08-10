import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { RootState } from "@/stores/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AnhAvatar from "@/assets/images/AnhAvatar.jpg";
import { PATH_CONSTRAINT } from "@/plugins/routers";
import { useFriendsStories } from "@/hooks/useStory";
import { Plus } from "lucide-react";

export default function StoriesBar() {
  const userCurrent = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const { groupedStories } = useFriendsStories();
  console.log("groupStory", groupedStories);

  return (
    <ScrollArea className="w-full">
      <div className="flex flex-row gap-3 px-1 py-2">
        <div
          onClick={() => navigate(PATH_CONSTRAINT.CREATE_STORY)}
          className="relative flex h-50 w-28 shrink-0 cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-opacity hover:opacity-90"
        >
          <div className="h-3/4 w-full">
            <img
              src={userCurrent?.profile?.avatar || AnhAvatar}
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="relative flex h-1/4 w-full flex-col items-center justify-end bg-card pb-2">
            <div className="absolute -top-5 flex size-10 items-center justify-center rounded-full bg-primary ring-4 ring-card">
              <Plus className="size-6 text-primary-foreground" />
            </div>
            <span className="text-xs font-semibold text-foreground">Tạo tin</span>
          </div>
        </div>

        {groupedStories.map((group) => {
          const latestStory = group.stories[0];

          return (
            <div
              key={group.user.id}
              onClick={() => navigate(`/stories?user=${group.user.id}`)}
              className="relative flex h-50 w-28 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-border bg-muted shadow-sm transition-opacity hover:opacity-90"
            >
              {latestStory.urlImage ? (
                <img
                  src={latestStory.urlImage}
                  className="absolute inset-0 h-full w-full object-cover"
                  alt=""
                />
              ) : latestStory.urlVideo ? (
                <video
                  src={latestStory.urlVideo}
                  className="absolute inset-0 h-full w-full object-cover"
                  muted
                />
              ) : (
                <div
                  className="absolute inset-0 flex h-full w-full items-center justify-center"
                  style={{ background: latestStory.color || "var(--primary)" }}
                >
                  <p className="max-w-full px-3 text-center break-all whitespace-pre-wrap text-white">
                    {latestStory.content}
                  </p>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
              <div className="absolute top-3 left-3 rounded-full ring-2 ring-primary">
                <img
                  src={group.user.avatarUrl || AnhAvatar}
                  alt={group.user.username}
                  className="size-8 rounded-full object-cover ring-2 ring-card"
                />
              </div>
              <div className="absolute right-2 bottom-2 left-2 truncate text-xs font-semibold text-white drop-shadow-md">
                {group.user.username}
              </div>
            </div>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
