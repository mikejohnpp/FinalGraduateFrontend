import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const goToProfile = () => navigate(`/profile/${request.sender.id}`);

  return (
    <Card size="sm">
      {request.sender.avatar ? (
        <img
          src={request.sender.avatar}
          alt={request.sender.name}
          className="aspect-square w-full cursor-pointer object-cover"
          onClick={goToProfile}
        />
      ) : (
        <div
          className="grid aspect-square w-full cursor-pointer place-items-center rounded-none bg-muted text-2xl font-semibold text-muted-foreground"
          onClick={goToProfile}
        >
          {request.sender.name?.charAt(0) ?? ""}
        </div>
      )}
      <CardHeader>
        <CardTitle className="cursor-pointer hover:underline" onClick={goToProfile}>
          {request.sender.name}
        </CardTitle>
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
