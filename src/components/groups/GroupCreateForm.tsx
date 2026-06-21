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
import { ChevronDown, X } from "lucide-react";
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
}

export default function GroupCreateForm({
  groupName,
  privacy,
  onGroupNameChange,
  onPrivacyChange,
  onSubmit,
  loading,
}: GroupCreateFormProps) {
  return (
    <div className="hidden h-full w-[320px] shrink-0 flex-col overflow-y-auto border-r bg-background md:flex">
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
        <Button
          variant="ghost"
          className="h-auto w-full justify-start gap-3 px-2 py-2 hover:bg-muted"
        >
          <Avatar className="size-10">
            <AvatarFallback>Me</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold">Bạn</p>
            <p className="text-xs text-muted-foreground">Quản trị viên</p>
          </div>
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>

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

          <Input placeholder="Mời bạn bè (không bắt buộc)" className="bg-muted/50" />
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
