import { useRef } from "react";
import type { GroupPrivacy } from "@/types/Group";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, ImagePlus } from "lucide-react";
import { resolveUploadUrl } from "@/utils/uploadHelper";
import { IMAGE_ACCEPT } from "@/utils/mediaUpload";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbLink,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

interface GroupCreateFormProps {
  groupName: string;
  privacy: GroupPrivacy;
  onGroupNameChange: (name: string) => void;
  onPrivacyChange: (privacy: GroupPrivacy) => void;
  onSubmit: () => void;
  loading: boolean;
  creatorName: string;
  creatorAvatar: string | null;
  onAvatarSelect: (file: File) => void;
  onCoverSelect: (file: File) => void;
}

export default function GroupCreateForm({
  groupName,
  privacy,
  onGroupNameChange,
  onPrivacyChange,
  onSubmit,
  loading,
  creatorName,
  creatorAvatar,
  onAvatarSelect,
  onCoverSelect,
}: GroupCreateFormProps) {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const creatorSrc = resolveUploadUrl(creatorAvatar) ?? undefined;

  const handleCoverInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onCoverSelect(file);
    e.target.value = "";
  };

  const handleAvatarInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onAvatarSelect(file);
    e.target.value = "";
  };

  return (
    <div className="hidden h-full w-[340px] shrink-0 flex-col overflow-y-auto border-r bg-background md:flex">
      <div className="flex flex-col gap-4 border-b p-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/groups">Nhóm</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Tạo nhóm</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl font-bold">Tạo nhóm</h1>
      </div>

      <div className="flex flex-1 flex-col gap-5 p-4">
        {/* Người tạo */}
        <div className="flex items-center gap-3 rounded-lg px-1 py-1">
          <Avatar className="size-10">
            <AvatarImage src={creatorSrc} alt={creatorName} className="object-cover" />
            <AvatarFallback>{creatorName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold">{creatorName}</p>
            <p className="text-xs text-muted-foreground">Quản trị viên</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Input
            placeholder="Tên nhóm"
            value={groupName}
            onChange={(e) => onGroupNameChange(e.target.value)}
          />

          <Select
            value={privacy}
            onValueChange={(val: string | null) => {
              if (val) onPrivacyChange(val as GroupPrivacy);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn quyền riêng tư" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Công khai</SelectItem>
              <SelectItem value="private">Riêng tư</SelectItem>
            </SelectContent>
          </Select>

          <p className="px-1 text-sm text-muted-foreground">
            {privacy === "public"
              ? "Bất kỳ ai cũng có thể nhìn thấy mọi người trong nhóm và những gì họ đăng."
              : "Chỉ thành viên mới nhìn thấy mọi người trong nhóm và những gì họ đăng."}
          </p>

          {/* Ảnh nhóm */}
          <div className="flex flex-col gap-2">
            <p className="px-1 text-sm font-semibold">Ảnh nhóm</p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 gap-2"
                size="sm"
                onClick={() => coverInputRef.current?.click()}
              >
                <ImagePlus data-icon="inline-start" />
                Ảnh bìa
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 gap-2"
                size="sm"
                onClick={() => avatarInputRef.current?.click()}
              >
                <Camera data-icon="inline-start" />
                Ảnh đại diện
              </Button>
              <input
                type="file"
                accept={IMAGE_ACCEPT}
                className="hidden"
                ref={coverInputRef}
                onChange={handleCoverInput}
              />
              <input
                type="file"
                accept={IMAGE_ACCEPT}
                className="hidden"
                ref={avatarInputRef}
                onChange={handleAvatarInput}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto border-t p-4">
        <Button className="w-full" disabled={!groupName.trim() || loading} onClick={onSubmit}>
          {loading ? "Đang tạo..." : "Tạo"}
        </Button>
      </div>
    </div>
  );
}
