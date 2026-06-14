import type { UserProfileDTO } from "@/types/interfaces/user/UserProfileDTO";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Pencil, ChevronDown, Camera, Upload } from "lucide-react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { resolveUploadUrl } from "@/utils/uploadHelper";
import { useUploadCover } from "@/hooks/useProfile";
import ProfileEditPanel from "./ProfileEditPanel";

interface ProfileCoverProps {
  profile: UserProfileDTO;
  isOwner: boolean;
}

export default function ProfileCover({ profile, isOwner }: ProfileCoverProps) {
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [editPanelOpen, setEditPanelOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { upload: uploadCover, loading: coverLoading } = useUploadCover();
  const navigate = useNavigate();

  const coverSrc = coverPreview ?? resolveUploadUrl(profile.coverPhoto);
  const avatarSrc = resolveUploadUrl(profile.avatar) ?? undefined;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Preview optimistic
    const reader = new FileReader();
    reader.onload = () => setCoverPreview(reader.result as string);
    reader.readAsDataURL(file);
    // Upload thực
    const url = await uploadCover(file);
    if (url) setCoverPreview(url);
    // Reset input để có thể chọn lại cùng file
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="relative flex w-full flex-col bg-background">
      <div className="group relative aspect-[3/1] max-h-[400px] w-full overflow-hidden rounded-b-lg bg-muted">
        {coverSrc && <img src={coverSrc} alt="Cover" className="h-full w-full object-cover" />}

        {isOwner && (
          <div className="absolute right-4 bottom-4 opacity-0 transition-opacity group-hover:opacity-100">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="secondary"
                    className="bg-white/80 text-black backdrop-blur-sm hover:bg-white"
                    disabled={coverLoading}
                  />
                }
              >
                <Camera data-icon="inline-start" />
                {coverLoading ? "Đang tải..." : "Chỉnh sửa ảnh bìa"}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                  <Upload className="mr-2 size-4" />
                  Tải ảnh lên
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
          </div>
        )}
      </div>

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center justify-between px-4 pb-4 sm:px-8 md:flex-row md:items-end">
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
              <Button>
                <Plus data-icon="inline-start" />
                Thêm vào tin
              </Button>
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
          ) : (
            <>
              <Button>
                <Plus data-icon="inline-start" />
                Thêm bạn bè
              </Button>
              <Button variant="secondary" onClick={() => navigate(`/messenger?userId=${profile.id}`)}>Nhắn tin</Button>
            </>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="secondary" size="icon" className="px-2" />}
            >
              <ChevronDown className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Cài đặt trang cá nhân</DropdownMenuItem>
              <DropdownMenuItem>Kho lưu trữ</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
