import type { UserProfileDTO } from "@/types/interfaces/user/UserProfileDTO";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Pencil, MessageCircle } from "lucide-react";
import { useRef, useState } from "react";
import { resolveUploadUrl } from "@/utils/uploadHelper";
import { IMAGE_ACCEPT } from "@/utils/mediaUpload";
import { useUploadAvatar, useUploadCover } from "@/hooks/useProfile";
import ProfileEditPanel from "./ProfileEditPanel";
import { useNavigate } from "react-router-dom";

interface ProfileCoverProps {
  profile: UserProfileDTO;
  isOwner: boolean;
}

export default function ProfileCover({ profile, isOwner }: ProfileCoverProps) {
  const [editPanelOpen, setEditPanelOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/messenger?userId=${profile.id}`);
  };

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const { upload: uploadAvatar, loading: avatarLoading } = useUploadAvatar();
  const { upload: uploadCover, loading: coverLoading } = useUploadCover();

  const avatarSrc = avatarPreview ?? resolveUploadUrl(profile.avatar) ?? undefined;
  const coverSrc = coverPreview ?? resolveUploadUrl(profile.coverPhoto) ?? undefined;

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
    const url = await uploadAvatar(file);
    setAvatarPreview(url ?? null);
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCoverPreview(reader.result as string);
    reader.readAsDataURL(file);
    const url = await uploadCover(file);
    setCoverPreview(url ?? null);
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  return (
    <div className="relative mt-15 flex w-full flex-col bg-background md:mt-0">
      {/* Ảnh bìa */}
      <div className="group relative aspect-3/1 max-h-100 w-full overflow-hidden rounded-b-lg bg-muted">
        {coverSrc && <img src={coverSrc} alt="Ảnh bìa" className="h-full w-full object-cover" />}

        {isOwner && (
          <div className="absolute right-4 bottom-4 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="secondary"
              className="bg-white/80 text-black backdrop-blur-sm hover:bg-white"
              disabled={coverLoading}
              onClick={() => coverInputRef.current?.click()}
            >
              <Camera data-icon="inline-start" />
              {coverLoading ? "Đang tải..." : "Chỉnh sửa ảnh bìa"}
            </Button>
            <input
              type="file"
              accept={IMAGE_ACCEPT}
              className="hidden"
              ref={coverInputRef}
              onChange={handleCoverChange}
            />
          </div>
        )}
      </div>

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center justify-between px-4 pb-4 sm:px-8 md:flex-row md:items-end">
        <div className="z-10 -mt-16 flex flex-col items-center gap-4 md:-mt-8 md:flex-row md:items-end">
          {/* Ảnh đại diện */}
          <div className="group relative">
            <Avatar className="size-40 border-4 border-background ring-1 ring-border/10">
              <AvatarImage
                src={avatarSrc}
                alt={profile.userName}
                className="bg-background object-cover"
              />
              <AvatarFallback className="text-4xl">{profile.userName.charAt(0)}</AvatarFallback>
            </Avatar>

            {isOwner && (
              <>
                <button
                  type="button"
                  disabled={avatarLoading}
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute right-2 bottom-2 flex size-10 items-center justify-center rounded-full bg-muted text-foreground shadow-md ring-2 ring-background transition-colors hover:bg-accent disabled:opacity-60"
                  aria-label="Đổi ảnh đại diện"
                >
                  <Camera className="size-5" />
                </button>
                <input
                  type="file"
                  accept={IMAGE_ACCEPT}
                  className="hidden"
                  ref={avatarInputRef}
                  onChange={handleAvatarChange}
                />
              </>
            )}
          </div>

          <div className="mb-4 flex flex-col items-center text-center md:mb-2 md:items-start md:text-left">
            <h1 className="text-3xl font-bold">{profile.nickName || profile.userName}</h1>
            <p className="cursor-pointer font-medium text-muted-foreground hover:underline">
              {profile.friendCount} người bạn
            </p>
          </div>
        </div>

        <div className="mb-4 flex w-full items-center justify-center gap-2 md:mb-2 md:w-auto md:justify-end">
          {isOwner ? (
            <div className="relative">
              <Button variant="secondary" onClick={() => setEditPanelOpen(!editPanelOpen)}>
                <Pencil data-icon="inline-start" />
                Chỉnh sửa trang cá nhân
              </Button>
              {editPanelOpen && (
                <ProfileEditPanel profile={profile} onClose={() => setEditPanelOpen(false)} />
              )}
            </div>
          ) : (
            <div className="relative" onClick={handleClick}>
              <Button
                variant="secondary"
                className="bg-blue-300 text-black backdrop-blur-sm hover:cursor-pointer hover:bg-blue-200"
              >
                <MessageCircle data-icon="inline-start" />
                Nhắn tin
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
