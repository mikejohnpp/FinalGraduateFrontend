import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { IFriendRequest } from "@/types/interfaces/friend/IFriendRequest";

type FriendRequestCardProps = {
  request: IFriendRequest;
  onAccept: (requestId: number) => void;
  onDecline: (requestId: number) => void;
  loadingId: number | null;
};

export default function FriendRequestCard({
  request,
  onAccept,
  onDecline,
  loadingId,
}: FriendRequestCardProps) {
  const isLoading = loadingId === request.requestId;

  return (
    <Card size="sm">
      <img
        src={request.sender.avatar ?? undefined}
        alt={request.sender.name}
        className="aspect-square w-full object-cover"
      />
      <CardHeader>
        <CardTitle>{request.sender.name}</CardTitle>
        {request.mutualFriendCount > 0 ? (
          <p className="text-xs text-muted-foreground">
            {request.mutualFriendCount} bạn chung
          </p>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Button
          className="w-full"
          size="sm"
          disabled={isLoading}
          onClick={() => onAccept(request.requestId)}
        >
          Xác nhận
        </Button>
        <Button
          className="w-full"
          size="sm"
          variant="secondary"
          disabled={isLoading}
          onClick={() => onDecline(request.requestId)}
        >
          Xóa
        </Button>
      </CardContent>
    </Card>
  );
}
