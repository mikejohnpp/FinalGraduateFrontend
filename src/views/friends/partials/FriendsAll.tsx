import FriendSuggestCard from "@/components/friends/FriendSuggestCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { allFriends } from "@/data/mock/friends";

export default function FriendsAll() {
  return (
    <ScrollArea className="w-full h-full flex flex-col px-8 pt-8 pb-0">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Tất cả bạn bè</h1>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
          {allFriends.map((profile) => (
            <FriendSuggestCard key={profile.id} profile={profile} />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
