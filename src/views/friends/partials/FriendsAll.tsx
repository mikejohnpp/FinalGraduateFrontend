import FriendSuggestCard from "@/components/friends/FriendSuggestCard";
import { allFriends } from "@/data/mock/friends";

export default function FriendsAll() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Tat ca ban be</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
        {allFriends.map((profile) => (
          <FriendSuggestCard key={profile.id} profile={profile} />
        ))}
      </div>
    </div>
  );
}
