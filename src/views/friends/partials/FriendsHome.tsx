import { useNavigate } from "react-router-dom";

import FriendRequestCard from "@/components/friends/FriendRequestCard";
import FriendSuggestCard from "@/components/friends/FriendSuggestCard";
import FriendsSectionHeader from "@/components/friends/FriendsSectionHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useAcceptRequest,
  useDeclineRequest,
  useDismissSuggestion,
  useFriendRequests,
  useFriendSuggestions,
  useSendFriendRequest,
} from "@/hooks/useFriend";

export default function FriendsHome() {
  const navigate = useNavigate();

  const { requests, loading: loadingRequests } = useFriendRequests();
  const { suggestions, loading: loadingSuggestions } = useFriendSuggestions();

  const { accept, loadingId: acceptLoadingId } = useAcceptRequest();
  const { decline, loadingId: declineLoadingId } = useDeclineRequest();
  const { send, loadingId: sendLoadingId } = useSendFriendRequest();
  const { dismiss } = useDismissSuggestion();

  // Dùng loadingId từ accept hoặc decline (chỉ 1 active tại 1 thời điểm)
  const requestLoadingId = acceptLoadingId ?? declineLoadingId;

  return (
    <ScrollArea className="h-full w-full px-8 pt-8 pb-0">
      <div className="flex flex-col gap-6">
        {/* Lời mời kết bạn */}
        <section className="flex flex-col gap-4">
          <FriendsSectionHeader
            title="Lời mời kết bạn"
            onAction={() => navigate("/friends/request")}
          />
          {loadingRequests && requests.length === 0 ? (
            <p className="text-sm text-muted-foreground">Đang tải...</p>
          ) : requests.length === 0 ? (
            <p className="text-sm text-muted-foreground">Không có lời mời kết bạn nào.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {requests.slice(0, 5).map((request) => (
                <FriendRequestCard
                  key={request.requestId}
                  request={request}
                  onAccept={accept}
                  onDecline={decline}
                  loadingId={requestLoadingId}
                />
              ))}
            </div>
          )}
        </section>

        {/* Gợi ý bạn bè */}
        <section className="flex flex-col gap-4">
          <FriendsSectionHeader
            title="Những người bạn có thể biết"
            onAction={() => navigate("/friends/suggest")}
          />
          {loadingSuggestions && suggestions.length === 0 ? (
            <p className="text-sm text-muted-foreground">Đang tải...</p>
          ) : suggestions.length === 0 ? (
            <p className="text-sm text-muted-foreground">Không có gợi ý nào.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {suggestions.slice(0, 10).map((suggestion) => (
                <FriendSuggestCard
                  key={suggestion.user.id}
                  suggestion={suggestion}
                  onSend={send}
                  onDismiss={dismiss}
                  loadingId={sendLoadingId}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </ScrollArea>
  );
}
