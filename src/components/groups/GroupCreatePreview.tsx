import type { GroupPrivacy } from "@/types/Group";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageIcon, Monitor, Smartphone, Globe, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveUploadUrl } from "@/utils/uploadHelper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface GroupCreatePreviewProps {
  groupName: string;
  privacy: GroupPrivacy;
  previewMode: "desktop" | "mobile";
  onPreviewModeChange: (mode: "desktop" | "mobile") => void;
  avatarPreview: string | null;
  coverPreview: string | null;
  creatorName: string;
  creatorAvatar: string | null;
}

export default function GroupCreatePreview({
  groupName,
  privacy,
  previewMode,
  onPreviewModeChange,
  avatarPreview,
  coverPreview,
  creatorName,
  creatorAvatar,
}: GroupCreatePreviewProps) {
  const creatorSrc = resolveUploadUrl(creatorAvatar) ?? undefined;

  return (
    <div className="flex flex-1 flex-col items-center overflow-y-auto bg-muted/30 p-4 dark:bg-background">
      <div className="mb-4 flex w-fit gap-2 rounded-lg bg-background p-1 shadow-sm">
        <Button
          variant={previewMode === "desktop" ? "secondary" : "ghost"}
          size="icon"
          onClick={() => onPreviewModeChange("desktop")}
          className="rounded-md"
        >
          <Monitor data-icon="inline" />
        </Button>
        <Button
          variant={previewMode === "mobile" ? "secondary" : "ghost"}
          size="icon"
          onClick={() => onPreviewModeChange("mobile")}
          className="rounded-md"
        >
          <Smartphone data-icon="inline" />
        </Button>
      </div>

      <Card
        className={cn(
          "w-full overflow-hidden border-0 shadow-md ring-1 ring-black/5 transition-all duration-300 dark:ring-white/10",
          previewMode === "desktop" ? "max-w-4xl" : "max-w-[375px]",
        )}
      >
        {/* Cover */}
        <div className="flex aspect-[16/7] flex-col items-center justify-center overflow-hidden border-b bg-muted text-muted-foreground">
          {coverPreview ? (
            <img src={coverPreview} alt="Ảnh bìa" className="size-full object-cover" />
          ) : (
            <ImageIcon className="mb-2 size-12 opacity-50" />
          )}
        </div>

        {/* Group Header Info */}
        <div className="bg-background px-4 pb-4 md:px-8">
          <div className="flex items-end gap-4">
            {/* Avatar nhóm */}
            <Avatar className="-mt-10 size-24 border-4 border-background ring-1 ring-border/10 md:-mt-12">
              <AvatarImage src={avatarPreview ?? undefined} alt="Ảnh đại diện nhóm" className="object-cover" />
              <AvatarFallback className="text-3xl">
                {(groupName || "N").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 pt-4">
              <h2 className="mb-1 text-2xl font-bold break-words">{groupName || "Tên nhóm"}</h2>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                {privacy === "public" ? <Globe data-icon="inline" /> : <Lock data-icon="inline" />}
                <span className="font-medium">
                  Nhóm {privacy === "public" ? "Công khai" : "Riêng tư"}
                </span>
                <span>·</span>
                <span className="font-medium">1 thành viên</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t pt-1">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="flex h-12 justify-start gap-2 bg-transparent p-0">
                <TabsTrigger
                  value="about"
                  className="h-full rounded-none px-4 font-semibold text-muted-foreground data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
                >
                  Giới thiệu
                </TabsTrigger>
                <TabsTrigger
                  value="posts"
                  className="h-full rounded-none px-4 font-semibold text-muted-foreground data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
                >
                  Bài viết
                </TabsTrigger>
                <TabsTrigger
                  value="members"
                  className="h-full rounded-none px-4 font-semibold text-muted-foreground data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
                >
                  Thành viên
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Mock Content Layout */}
        <div
          className={cn(
            "grid gap-4 bg-muted/40 p-4 dark:bg-black/20",
            previewMode === "desktop" ? "grid-cols-[2fr_3fr]" : "grid-cols-1",
          )}
        >
          {/* About Card */}
          <Card className="h-fit border-0 p-4 shadow-sm">
            <h3 className="mb-3 text-lg font-bold">Giới thiệu</h3>
            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                {privacy === "public" ? (
                  <Globe className="mt-1 size-6 opacity-70" />
                ) : (
                  <Lock className="mt-1 size-6 opacity-70" />
                )}
                <div>
                  <p className="font-semibold">{privacy === "public" ? "Công khai" : "Riêng tư"}</p>
                  <p className="text-sm text-muted-foreground">
                    {privacy === "public"
                      ? "Bất kỳ ai cũng có thể nhìn thấy mọi người trong nhóm và những gì họ đăng."
                      : "Chỉ thành viên mới nhìn thấy mọi người trong nhóm và những gì họ đăng."}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Posts Area Placeholder */}
          <div className="flex flex-col gap-4">
            <Card className="flex items-center gap-2 border-0 p-3 shadow-sm">
              <Avatar className="size-10">
                <AvatarImage src={creatorSrc} alt={creatorName} className="object-cover" />
                <AvatarFallback>{creatorName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex h-10 flex-1 cursor-not-allowed items-center rounded-full bg-muted px-4 text-muted-foreground">
                Bạn đang nghĩ gì?
              </div>
            </Card>

            <Card className="flex min-h-[200px] items-center justify-center border-0 text-muted-foreground shadow-sm">
              Bài viết sẽ hiển thị ở đây
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
}
