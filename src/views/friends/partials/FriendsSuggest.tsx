import FriendSuggestCard from "@/components/friends/FriendSuggestCard"
import { friendSuggestions } from "@/data/mock/friends"

export default function FriendsSuggest() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Nhung nguoi ban co the biet</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {friendSuggestions.map((profile) => (
          <FriendSuggestCard key={profile.id} profile={profile} />
        ))}
      </div>
    </div>
  )
}
