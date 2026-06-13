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
      {request.sender.avatar ? (
        <img
          src={request.sender.avatar}
          alt={request.sender.name}
          className="aspect-square w-full object-cover"
        />
      ) : (
        <div className="grid aspect-square w-full place-items-center rounded-none bg-muted text-2xl font-semibold text-muted-foreground">
          {request.sender.name?.charAt(0) ?? ""}
        </div>
      )}
      <CardHeader>
        <CardTitle>{request.sender.name}</CardTitle>
        {request.mutualFriendCount > 0 ? (
          <p className="text-xs text-muted-foreground">{request.mutualFriendCount} bạn chung</p>
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
