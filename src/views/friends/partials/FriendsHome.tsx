import { useNavigate } from "react-router-dom";

import FriendRequestCard from "@/components/friends/FriendRequestCard";
import FriendSuggestCard from "@/components/friends/FriendSuggestCard";
import FriendsSectionHeader from "@/components/friends/FriendsSectionHeader";
import { friendRequests, friendSuggestions } from "@/data/mock/friends";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function FriendsHome() {
  const navigate = useNavigate();

  return (
    <ScrollArea className="w-full h-full px-8 pt-8 pb-0">
      <div className="flex flex-col gap-6">
        <section className="flex flex-col gap-4">
          <FriendsSectionHeader
            title="Lời mời kết bạn"
            onAction={() => navigate("/friends/request")}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {friendRequests.map((profile) => (
              <FriendRequestCard key={profile.id} profile={profile} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <FriendsSectionHeader
            title="Những người bạn có thể biết"
            onAction={() => navigate("/friends/suggest")}
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {friendSuggestions.map((profile) => (
              <FriendSuggestCard key={profile.id} profile={profile} />
            ))}
          </div>
        </section>
      </div>
    </ScrollArea>
  );
}
