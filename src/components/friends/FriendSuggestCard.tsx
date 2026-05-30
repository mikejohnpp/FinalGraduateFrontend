import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { IFriendSuggestion } from "@/types/interfaces/friend/IFriendSuggestion";

type FriendSuggestCardProps = {
  suggestion: IFriendSuggestion;
  onSend: (userId: number) => void;
  onDismiss: (userId: number) => void;
  loadingId: number | null;
};

export default function FriendSuggestCard({
  suggestion,
  onSend,
  onDismiss,
  loadingId,
}: FriendSuggestCardProps) {
  const isLoading = loadingId === suggestion.user.id;

  return (
    <Card size="sm">
      <img
        src={suggestion.user.avatar ?? undefined}
        alt={suggestion.user.name}
        className="aspect-square w-full object-cover"
      />
      <CardHeader>
        <CardTitle className="text-sm">{suggestion.user.name}</CardTitle>
        {suggestion.mutualFriendCount > 0 ? (
          <p className="text-xs text-muted-foreground">{suggestion.mutualFriendCount} bạn chung</p>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Button
          className="w-full"
          size="sm"
          disabled={isLoading}
          onClick={() => onSend(suggestion.user.id)}
        >
          Thêm bạn bè
        </Button>
        <Button
          className="w-full"
          size="sm"
          variant="secondary"
          disabled={isLoading}
          onClick={() => onDismiss(suggestion.user.id)}
        >
          Gỡ
        </Button>
      </CardContent>
    </Card>
  );
}
