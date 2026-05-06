import FriendRequestCard from "@/components/friends/FriendRequestCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { friendRequests } from "@/data/mock/friends";

export default function FriendsRequests() {
  return (
    <ScrollArea className="w-full h-full px-8 pt-8 pb-0">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Lời mời kết bạn</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {friendRequests.map((profile) => (
            <FriendRequestCard key={profile.id} profile={profile} />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
