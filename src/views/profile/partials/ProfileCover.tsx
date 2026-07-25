import type { UserProfileDTO } from "@/types/interfaces/user/UserProfileDTO";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Camera,
  Pencil,
  MessageCircle,
  UserPlus,
  UserCheck,
  UserX,
  Clock,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { useRef, useState } from "react";
import { resolveUploadUrl } from "@/utils/uploadHelper";
import { IMAGE_ACCEPT } from "@/utils/mediaUpload";
import { useUploadAvatar, useUploadCover } from "@/hooks/useProfile";
import ProfileEditPanel from "./ProfileEditPanel";
import { useNavigate } from "react-router-dom";
import { useProfileFriendStatus } from "@/hooks/useFriend";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProfileCoverProps {
  profile: UserProfileDTO;
  isOwner: boolean;
}

export default function ProfileCover({ profile, isOwner }: ProfileCoverProps) {
  const [editPanelOpen, setEditPanelOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const navigate = useNavigate();

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const { upload: uploadAvatar, loading: avatarLoading } = useUploadAvatar();
  const { upload: uploadCover, loading: coverLoading } = useUploadCover();

  const {
    status,
    loading: statusLoading,
    actionLoading,
    sendRequest,
    cancelRequest,
    acceptRequest,
    unfriend,
  } = useProfileFriendStatus(isOwner ? undefined : profile.id);

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

  const renderFriendButton = () => {
    if (statusLoading) {
      return (
        <Button variant="secondary" disabled>
          <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
      );
    }

    switch (status) {
      case "FRIENDS":
        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="secondary" disabled={actionLoading}>
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <UserCheck data-icon="inline-start" />
                  )}
                  Bạn bè
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={unfriend}
              >
                <UserX className="mr-2 h-4 w-4" />
                Hủy kết bạn
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );

      case "PENDING_SENT":
        return (
          <Button variant="secondary" disabled={actionLoading} onClick={cancelRequest}>
            {actionLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Clock data-icon="inline-start" />
            )}
            Đã gửi lời mời
          </Button>
        );

      case "PENDING_RECEIVED":
        return (
          <div className="flex gap-2">
            <Button variant="default" disabled={actionLoading} onClick={acceptRequest}>
              {actionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserPlus data-icon="inline-start" />
              )}
              Xác nhận
            </Button>
            <Button variant="secondary" disabled={actionLoading} onClick={cancelRequest}>
              Xóa
            </Button>
          </div>
        );

      case "NOT_FRIENDS":
      default:
        return (
          <Button
            variant="default"
            className="bg-blue-500 text-white hover:bg-blue-600"
            disabled={actionLoading}
            onClick={sendRequest}
          >
            {actionLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus data-icon="inline-start" />
            )}
            Thêm bạn bè
          </Button>
        );
    }
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
            <h1 className="text-3xl font-bold">{profile.userName || profile.nickName}</h1>
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
            <>
              {renderFriendButton()}
              <Button
                variant="secondary"
                className="bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                onClick={() => navigate(`/messenger?userId=${profile.id}`)}
              >
                <MessageCircle data-icon="inline-start" />
                Nhắn tin
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
