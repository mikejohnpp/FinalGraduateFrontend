import FriendSuggestCard from "@/components/friends/FriendSuggestCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  useDismissSuggestion,
  useFriendSuggestions,
  useSendFriendRequest,
} from "@/hooks/useFriend";

export default function FriendsSuggest() {
  const { suggestions, hasMore, loadMore, loading } = useFriendSuggestions();
  const { send, loadingId: sendLoadingId } = useSendFriendRequest();
  const { dismiss } = useDismissSuggestion();

  return (
    <ScrollArea className="w-full h-full px-8 pt-8 pb-0">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Bạn có thể biết</h1>

        {loading && suggestions.length === 0 ? (
          <p className="text-sm text-muted-foreground">Đang tải...</p>
        ) : suggestions.length === 0 ? (
          <p className="text-sm text-muted-foreground">Không có gợi ý nào.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {suggestions.map((suggestion) => (
                <FriendSuggestCard
                  key={suggestion.user.id}
                  suggestion={suggestion}
                  onSend={send}
                  onDismiss={dismiss}
                  loadingId={sendLoadingId}
                />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center py-4">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={loading}
                >
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
