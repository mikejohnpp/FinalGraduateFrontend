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
  friendship;
  return (
    <Card size="sm">
      {friendship.user.avatar ? (
        <img
          src={friendship.user.avatar}
          alt={friendship.user.name}
          className="aspect-square w-full object-cover"
        />
      ) : (
        <div className="grid aspect-square w-full place-items-center rounded-none bg-muted text-2xl font-semibold text-muted-foreground">
          {friendship.user.name?.charAt(0) ?? ""}
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-sm">{friendship.user.name}</CardTitle>
        <p className="text-xs text-muted-foreground">
          Bạn bè từ {formatFriendSince(friendship.friendSince)}
        </p>
        {friendship.mutualFriendCount > 0 ? (
          <p className="text-xs text-muted-foreground">{friendship.mutualFriendCount} bạn chung</p>
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
