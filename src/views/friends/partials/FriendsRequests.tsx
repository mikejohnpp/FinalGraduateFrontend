import FriendRequestCard from "@/components/friends/FriendRequestCard"
import { friendRequests } from "@/data/mock/friends"

export default function FriendsRequests() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Loi moi ket ban</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {friendRequests.map((profile) => (
          <FriendRequestCard key={profile.id} profile={profile} />
        ))}
      </div>
    </div>
  )
}
