import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { IFriendship } from "@/types/interfaces/friend/IFriendship";

type FriendCardProps = {
  friendship: IFriendship;
  onUnfriend: (userId: number) => void;
  loadingId: number | null;
};

function formatFriendSince(iso: string): string {
  try {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function FriendCard({ friendship, onUnfriend, loadingId }: FriendCardProps) {
  const isLoading = loadingId === friendship.user.id;

  return (
    <Card size="sm">
      <img
        src={friendship.user.avatar ?? undefined}
        alt={friendship.user.name}
        className="aspect-square w-full object-cover"
      />
      <CardHeader>
        <CardTitle className="text-sm">{friendship.user.name}</CardTitle>
        <p className="text-xs text-muted-foreground">
          Bạn bè từ {formatFriendSince(friendship.friendSince)}
        </p>
        {friendship.mutualFriendCount > 0 ? (
          <p className="text-xs text-muted-foreground">
            {friendship.mutualFriendCount} bạn chung
          </p>
        ) : null}
      </CardHeader>
      <CardContent>
        <Button
          className="w-full"
          size="sm"
          variant="secondary"
          disabled={isLoading}
          onClick={() => onUnfriend(friendship.user.id)}
        >
          Huỷ kết bạn
        </Button>
      </CardContent>
    </Card>
  );
}
