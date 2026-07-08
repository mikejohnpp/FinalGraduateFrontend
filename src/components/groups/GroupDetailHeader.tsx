import { useRef } from "react";
import type { IGroup } from "@/types/interfaces/group/IGroup";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Lock, MoreHorizontal, UserCheck, Camera } from "lucide-react";
import { resolveUploadUrl } from "@/utils/uploadHelper";
import { IMAGE_ACCEPT } from "@/utils/mediaUpload";
import { useGroupImage } from "@/hooks/useGroup";

interface GroupDetailHeaderProps {
  group: IGroup;
  onJoin: () => void;
  onLeave: () => void;
  onGroupUpdated?: (group: IGroup) => void;
  activeTab: "about" | "members";
  onTabChange: (tab: "about" | "members") => void;
}

export default function GroupDetailHeader({
  group,
  onJoin,
  onLeave,
  onGroupUpdated,
  activeTab,
  onTabChange,
}: GroupDetailHeaderProps) {
  const isAdmin = group.role === "ADMIN";

  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const { uploadAvatar, uploadCover, uploadingAvatar, uploadingCover } = useGroupImage();

  const coverSrc = resolveUploadUrl(group.coverPhoto) ?? undefined;
  const avatarSrc = resolveUploadUrl(group.avatar) ?? undefined;

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const updated = await uploadCover(group.id, file);
    if (updated) onGroupUpdated?.(updated);
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const updated = await uploadAvatar(group.id, file);
    if (updated) onGroupUpdated?.(updated);
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  };

  return (
    <div className="bg-background shadow-sm">
      {/* Cover */}
      <div className="mx-auto max-w-[1096px]">
        <div className="group relative aspect-[16/5] overflow-hidden rounded-b-lg bg-muted md:aspect-[16/6]">
          {coverSrc && (
            <img src={coverSrc} alt={group.name} className="size-full object-cover" />
          )}

          {isAdmin && (
            <div className="absolute right-4 bottom-4 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                variant="secondary"
                className="bg-white/80 text-black backdrop-blur-sm hover:bg-white"
                size="sm"
                disabled={uploadingCover}
                onClick={() => coverInputRef.current?.click()}
              >
                <Camera data-icon="inline-start" />
                {uploadingCover ? "Đang tải..." : "Chỉnh sửa ảnh bìa"}
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

        {/* Group Info */}
        <div className="flex flex-col justify-between gap-4 px-4 py-4 md:flex-row md:items-end md:px-8">
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-end">
            {/* Avatar nhóm */}
            <div className="group relative -mt-12 shrink-0 md:-mt-16">
              <Avatar className="size-24 border-4 border-background ring-1 ring-border/10 md:size-32">
                <AvatarImage src={avatarSrc} alt={group.name} className="object-cover" />
                <AvatarFallback className="text-3xl">{group.name.charAt(0)}</AvatarFallback>
              </Avatar>

              {isAdmin && (
                <>
                  <button
                    type="button"
                    disabled={uploadingAvatar}
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute right-1 bottom-1 flex size-9 items-center justify-center rounded-full bg-muted text-foreground shadow-md ring-2 ring-background transition-colors hover:bg-accent disabled:opacity-60"
                    aria-label="Đổi ảnh đại diện nhóm"
                  >
                    <Camera className="size-4.5" />
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

            <div className="text-center md:text-left">
              <h1 className="mb-1 text-3xl font-bold">{group.name}</h1>
              <div className="mb-4 flex items-center justify-center gap-1.5 text-muted-foreground md:justify-start">
                {group.privacy === "public" ? (
                  <Globe data-icon="inline" />
                ) : (
                  <Lock data-icon="inline" />
                )}
                <span className="font-medium">
                  Nhóm {group.privacy === "public" ? "Công khai" : "Riêng tư"}
                </span>
                <span>·</span>
                <span className="font-medium">
                  {group.memberCount.toLocaleString("vi-VN")} thành viên
                </span>
              </div>
            </div>
          </div>

          {!isAdmin && (
            <div className="mb-2 flex shrink-0 gap-2">
              {group.isJoined ? (
                <Button variant="secondary" className="gap-2" size="sm" onClick={onLeave}>
                  <UserCheck data-icon="inline-start" /> Đã tham gia
                </Button>
              ) : (
                <Button variant="default" className="gap-2" size="sm" onClick={onJoin}>
                  Tham gia nhóm
                </Button>
              )}
              {group.isJoined && (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="secondary" size="sm">
                        <MoreHorizontal data-icon="inline" />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-destructive" onClick={onLeave}>
                      Rời khỏi nhóm
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}

        </div>

        <Separator className="mx-4 md:mx-8" />

        {/* Sticky Tabs */}
        <div className="flex items-center justify-between px-4 md:px-8">
          <Tabs
            value={activeTab}
            onValueChange={(value) => onTabChange(value as "about" | "members")}
            className="w-full"
          >
            <TabsList className="flex h-14 justify-start gap-2 bg-transparent p-0">
              <TabsTrigger
                value="about"
                className="h-full rounded-none px-4 font-semibold text-muted-foreground data-active:border-b-4 data-active:border-primary data-active:bg-transparent data-active:text-primary data-active:shadow-none"
              >
                Giới thiệu
              </TabsTrigger>
              <TabsTrigger
                value="members"
                className="h-full rounded-none px-4 font-semibold text-muted-foreground data-active:border-b-4 data-active:border-primary data-active:bg-transparent data-active:text-primary data-active:shadow-none"
              >
                Thành viên
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

      </div>
    </div>
  );
}
