import { PlusIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Story } from "@/types/HomeFeed";

export default function StoryItem({ story, isCreate }: { story: Story; isCreate?: boolean }) {
  if (isCreate) {
    return (
      <div className="flex shrink-0 flex-col items-center gap-1">
        <div className="relative size-16 cursor-pointer overflow-hidden rounded-full bg-muted ring-2 ring-muted transition-transform hover:scale-105">
          <Avatar size="lg" className="size-full">
            <AvatarImage src={story.avatarUrl} />
            <AvatarFallback>{story.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <PlusIcon className="size-4" />
            </span>
          </div>
        </div>
        <span className="max-w-16 truncate text-xs text-muted-foreground">{story.name}</span>
      </div>
    );
  }

  return (
    <div className="flex shrink-0 flex-col items-center gap-1">
      <div className="relative size-16 cursor-pointer overflow-hidden rounded-full bg-gradient-to-tr from-amber-500 to-purple-600 p-0.5 transition-transform hover:scale-105">
        <Avatar size="lg" className="size-full rounded-full border-2 border-background">
          <AvatarImage src={story.avatarUrl} />
          <AvatarFallback>{story.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
      <span className="max-w-16 truncate text-xs text-muted-foreground">{story.name}</span>
    </div>
  );
}
