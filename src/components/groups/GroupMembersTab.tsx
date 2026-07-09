import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { resolveUploadUrl } from "@/utils/uploadHelper";
import type { IGroupMember } from "@/types/interfaces/group/IGroupMember";


interface GroupMembersTabProps {
  members: IGroupMember[];
  memberCount: number;
}

const ROLE_LABEL: Record<IGroupMember["role"], string> = {
  ADMIN: "Quản trị viên",
  MODERATOR: "Người kiểm duyệt",
  MEMBER: "Thành viên",
};

const ROLE_ORDER: Record<IGroupMember["role"], number> = {
  ADMIN: 0,
  MODERATOR: 1,
  MEMBER: 2,
};

export default function GroupMembersTab({ members, memberCount }: GroupMembersTabProps) {
  const navigate = useNavigate();
  const sorted = [...members].sort((a, b) => ROLE_ORDER[a.role] - ROLE_ORDER[b.role]);


  return (
    <Card className="border-0 p-4 shadow-sm md:p-6">
      <div className="mb-4 flex items-center gap-2">
        <Users className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-[17px] font-bold">
          Thành viên · {memberCount.toLocaleString("vi-VN")}
        </h3>
      </div>

      {sorted.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">Chưa có thành viên nào.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {sorted.map((m) => (
            <div
              key={m.userId}
              className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent/50"
              onClick={() => navigate(`/profile/${m.userId}`)}
            >

              <Avatar className="h-11 w-11">
                <AvatarImage src={resolveUploadUrl(m.avatar) ?? undefined} alt={m.name} />
                <AvatarFallback>{m.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold">{m.name}</p>
                {m.role !== "MEMBER" && (
                  <Badge variant="secondary" className="mt-0.5 text-[11px]">
                    {ROLE_LABEL[m.role]}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
