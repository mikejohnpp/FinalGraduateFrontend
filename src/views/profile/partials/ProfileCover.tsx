import type { UserProfileDTO } from "@/types/interfaces/user/UserProfileDTO";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { resolveUploadUrl } from "@/utils/uploadHelper";
import ProfileEditPanel from "./ProfileEditPanel";

interface ProfileCoverProps {
  profile: UserProfileDTO;
  isOwner: boolean;
}

export default function ProfileCover({ profile, isOwner }: ProfileCoverProps) {
  const [editPanelOpen, setEditPanelOpen] = useState(false);

  const avatarSrc = resolveUploadUrl(profile.avatar) ?? undefined;

  return (
    <div className="relative flex w-full flex-col bg-background">
      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center justify-between px-4 pt-10 pb-4 sm:px-8 md:flex-row md:items-end">
        <div className="z-10 -mt-16 flex flex-col items-center gap-4 md:-mt-8 md:flex-row md:items-end">
          <Avatar className="size-40 border-4 border-background ring-1 ring-border/10">
            <AvatarImage
              src={avatarSrc}
              alt={profile.userName}
              className="bg-background object-cover"
            />
            <AvatarFallback className="text-4xl">{profile.userName.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="mb-4 flex flex-col items-center text-center md:mb-2 md:items-start md:text-left">
            <h1 className="text-3xl font-bold">{profile.nickName ?? profile.userName}</h1>
            <p className="cursor-pointer font-medium text-muted-foreground hover:underline">
              {profile.friendCount} người bạn
            </p>
          </div>
        </div>

        <div className="mb-4 flex w-full items-center justify-center gap-2 md:mb-2 md:w-auto md:justify-end">
          {isOwner ? (
            <>
              <div className="relative">
                <Button variant="secondary" onClick={() => setEditPanelOpen(!editPanelOpen)}>
                  <Pencil data-icon="inline-start" />
                  Chỉnh sửa trang cá nhân
                </Button>
                {editPanelOpen && (
                  <ProfileEditPanel profile={profile} onClose={() => setEditPanelOpen(false)} />
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
