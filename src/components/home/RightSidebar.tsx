import { GiftIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllFriends } from "@/hooks/useFriend";
import type { RootState } from "@/stores/store";
import type { IFriendship } from "@/types/interfaces/friend/IFriendship";

import ContactItem from "./ContactItem";

function ContactSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
      <Skeleton className="size-8 shrink-0 rounded-full" />
      <Skeleton className="h-3.5 w-32 rounded" />
    </div>
  );
}

export default function RightSidebar() {
  const { friends, loading } = useAllFriends();
  const onlineUsers = useSelector((s: RootState) => s.userOnline.onlineUsers);
  const [search, setSearch] = useState("");

  const filtered: IFriendship[] = search.trim()
    ? friends.filter((f) => {
        const name = (f.user.nickName || f.user.name).toLowerCase();
        return name.includes(search.toLowerCase());
      })
    : friends;

  const onlineSet = new Set(onlineUsers);

  const onlineFriends = filtered.filter((f) => onlineSet.has(f.user.id));
  const offlineFriends = filtered.filter((f) => !onlineSet.has(f.user.id));
  const sorted = [...onlineFriends, ...offlineFriends];

  return (
    <aside className="hidden w-75 shrink-0 flex-col gap-2 overflow-y-auto py-4 pr-4 pl-2 lg:flex">
      <div className="flex flex-col gap-1 px-2">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground">
            Liên hệ
            {onlineFriends.length > 0 && (
              <span className="ml-1 text-emerald-500">({onlineFriends.length} online)</span>
            )}
          </span>
        </div>

        <div className="relative mb-2">
          <SearchIcon className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm kiếm bạn bè..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg bg-muted py-1.5 pr-3 pl-8 text-xs outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
          />
        </div>

        {loading && friends.length === 0 ? (
          <>
            <ContactSkeleton />
            <ContactSkeleton />
            <ContactSkeleton />
            <ContactSkeleton />
          </>
        ) : sorted.length === 0 ? (
          <p className="px-2 py-4 text-center text-xs text-muted-foreground">
            {search ? "Không tìm thấy bạn bè" : "Chưa có bạn bè nào"}
          </p>
        ) : (
          sorted.map((f) => (
            <ContactItem key={f.user.id} friendship={f} isOnline={onlineSet.has(f.user.id)} />
          ))
        )}
      </div>
    </aside>
  );
}
