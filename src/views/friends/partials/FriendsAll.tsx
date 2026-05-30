import FriendCard from "@/components/friends/FriendCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useAllFriends, useUnfriend } from "@/hooks/useFriend";

export default function FriendsAll() {
  const { friends, hasMore, loadMore, loading } = useAllFriends();
  const { unfriend, loadingId } = useUnfriend();

  return (
    <ScrollArea className="flex h-full w-full flex-col px-8 pt-8 pb-0">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Tất cả bạn bè</h1>

        {loading && friends.length === 0 ? (
          <p className="text-sm text-muted-foreground">Đang tải...</p>
        ) : friends.length === 0 ? (
          <p className="text-sm text-muted-foreground">Bạn chưa có bạn bè nào.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
              {friends.map((friendship) => (
                <FriendCard
                  key={friendship.user.id}
                  friendship={friendship}
                  onUnfriend={unfriend}
                  loadingId={loadingId}
                />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center py-4">
                <Button variant="outline" onClick={loadMore} disabled={loading}>
                  {loading ? "Đang tải..." : "Xem thêm"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </ScrollArea>
  );
}
