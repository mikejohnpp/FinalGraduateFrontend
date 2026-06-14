import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { IFriendship } from "@/types/interfaces/friend/IFriendship";

interface ContactItemProps {
  friendship: IFriendship;
  isOnline: boolean;
}

export default function ContactItem({ friendship, isOnline }: ContactItemProps) {
  const { user } = friendship;
  const displayName = user.nickName || user.name;
  const initials = displayName.charAt(0).toUpperCase();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/messenger?userId=${user.id}`);
  };

  return (
    <div
      className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
      onClick={handleClick}
    >
      <div className="relative shrink-0">
        <Avatar size="sm">
          <AvatarImage src={user.avatar ?? undefined} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span
          className={cn(
            "absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-background",
            isOnline ? "bg-emerald-500" : "bg-amber-400",
          )}
          title={isOnline ? "Đang hoạt động" : "Không hoạt động"}
        />
      </div>
      <span className="truncate">{displayName}</span>
    </div>
  );
}
