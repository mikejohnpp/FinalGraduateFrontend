import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const goToProfile = () => navigate(`/profile/${suggestion.user.id}`);

  return (
    <Card size="sm">
      {suggestion.user.avatar ? (
        <img
          src={suggestion.user.avatar}
          alt={suggestion.user.name}
          className="aspect-square w-full cursor-pointer object-cover"
          onClick={goToProfile}
        />
      ) : (
        <div
          className="grid aspect-square w-full cursor-pointer place-items-center rounded-none bg-muted text-2xl font-semibold text-muted-foreground"
          onClick={goToProfile}
        >
          {suggestion.user.name?.charAt(0) ?? ""}
        </div>
      )}
      <CardHeader>
        <CardTitle className="cursor-pointer text-sm hover:underline" onClick={goToProfile}>
          {suggestion.user.name}
        </CardTitle>
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
