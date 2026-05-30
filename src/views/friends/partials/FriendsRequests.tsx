import FriendRequestCard from "@/components/friends/FriendRequestCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useAcceptRequest, useDeclineRequest, useFriendRequests } from "@/hooks/useFriend";

export default function FriendsRequests() {
  const { requests, hasMore, loadMore, loading } = useFriendRequests();
  const { accept, loadingId: acceptLoadingId } = useAcceptRequest();
  const { decline, loadingId: declineLoadingId } = useDeclineRequest();

  const requestLoadingId = acceptLoadingId ?? declineLoadingId;

  return (
    <ScrollArea className="h-full w-full px-8 pt-8 pb-0">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Lời mời kết bạn</h1>

        {loading && requests.length === 0 ? (
          <p className="text-sm text-muted-foreground">Đang tải...</p>
        ) : requests.length === 0 ? (
          <p className="text-sm text-muted-foreground">Bạn không có lời mời kết bạn nào.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {requests.map((request) => (
                <FriendRequestCard
                  key={request.requestId}
                  request={request}
                  onAccept={accept}
                  onDecline={decline}
                  loadingId={requestLoadingId}
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
