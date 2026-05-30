import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Video, Image as ImageIcon, Smile } from "lucide-react";
import type { UserProfileDTO } from "@/types/interfaces/user/UserProfileDTO";
import { resolveUploadUrl } from "@/utils/uploadHelper";

interface ProfileCreatePostProps {
  profile: UserProfileDTO;
  isOwner: boolean;
}

export default function ProfileCreatePost({ profile, isOwner }: ProfileCreatePostProps) {
  const avatarSrc = resolveUploadUrl(profile.avatar) ?? undefined;

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex gap-2">
          <Avatar className="size-10">
            <AvatarImage src={avatarSrc} alt={profile.userName} />
            <AvatarFallback>{profile.userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <Button
            variant="outline"
            className="flex-1 justify-start rounded-full border-none bg-muted/50 font-normal text-muted-foreground hover:bg-muted"
          >
            {isOwner
              ? `Bạn đang nghĩ gì thế?`
              : `Viết gì đó cho ${profile.nickName ?? profile.userName}...`}
          </Button>
        </div>

        <Separator className="my-3" />

        <div className="flex justify-between gap-1">
          <Button variant="ghost" className="flex-1 text-muted-foreground hover:bg-muted">
            <Video className="text-red-500" data-icon="inline-start" />
            Video trực tiếp
          </Button>
          <Button variant="ghost" className="flex-1 text-muted-foreground hover:bg-muted">
            <ImageIcon className="text-green-500" data-icon="inline-start" />
            Ảnh/video
          </Button>
          <Button
            variant="ghost"
            className="hidden flex-1 text-muted-foreground hover:bg-muted sm:flex"
          >
            <Smile className="text-yellow-500" data-icon="inline-start" />
            Cảm xúc
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
