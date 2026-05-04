import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FriendProfile } from "@/types/Friend";

type FriendSuggestCardProps = {
  profile: FriendProfile;
};

export default function FriendSuggestCard({ profile }: FriendSuggestCardProps) {
  return (
    <Card size="sm">
      <img
        src={profile.avatarUrl}
        alt={profile.name}
        className="aspect-square w-full object-cover"
      />
      <CardHeader>
        <CardTitle className="text-sm">{profile.name}</CardTitle>
        {profile.mutualCount ? (
          <p className="text-xs text-muted-foreground">
            {profile.mutualCount} ban chung
          </p>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Button className="w-full" size="sm">
          Thêm bạn bè
        </Button>
        <Button className="w-full" size="sm" variant="secondary">
          Gỡ
        </Button>
      </CardContent>
    </Card>
  );
}
