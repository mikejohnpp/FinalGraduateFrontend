import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FriendMiniCard from "@/components/profile/FriendMiniCard";
import type { UserProfileDTO } from "@/types/interfaces/user/UserProfileDTO";
import type { IAuthor } from "@/types/interfaces/user/IAuthor";
import type { IFriendship } from "@/types/interfaces/friend/IFriendship";
import type { CursorPageResponse } from "@/types/interfaces/post/IPostPage";
import { useEffect, useState } from "react";
import { API } from "@/common/constants";
import friendService from "@/services/friendService";

interface ProfileFriendsProps {
  profile: UserProfileDTO;
  /** Chuyển sang tab "Bạn bè" khi bấm tiêu đề hoặc "Xem tất cả bạn bè". */
  onViewAll?: () => void;
}

/** Số bạn bè hiển thị ở chế độ preview (card ở sidebar). */
const PREVIEW_SIZE = 6;
/** Số bạn bè tải mỗi lần ở chế độ xem tất cả (tab "Bạn bè"). */
const PAGE_SIZE = 18;

export default function ProfileFriends({ profile, onViewAll }: ProfileFriendsProps) {
  // Khi có onViewAll -> đây là card preview ở sidebar, chỉ hiện tối đa PREVIEW_SIZE.
  // Ngược lại -> tab "Bạn bè", hiển thị đầy đủ và hỗ trợ tải thêm.
  const isPreview = Boolean(onViewAll);
  const pageSize = isPreview ? PREVIEW_SIZE : PAGE_SIZE;

  const [friends, setFriends] = useState<IAuthor[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    if (!profile.id) return;
    let cancelled = false;
    const loadInitial = async () => {
      setLoading(true);
      try {
        const result = await friendService.getSingle<CursorPageResponse<IFriendship>>(
          API.FRIEND.BASE,
          undefined,
          { userId: profile.id, size: pageSize },
        );
        if (cancelled) return;
        setFriends(result?.data?.map((f) => f.user) ?? []);
        setNextCursor(result?.nextCursor ?? null);
        setHasMore(Boolean(result?.hasMore));
      } catch {
        // giữ nguyên danh sách hiện tại nếu lỗi
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadInitial();
    return () => {
      cancelled = true;
    };
  }, [profile.id, pageSize]);

  const handleLoadMore = async () => {
    if (!profile.id || !nextCursor) return;
    setLoadingMore(true);
    try {
      const result = await friendService.getSingle<CursorPageResponse<IFriendship>>(
        API.FRIEND.BASE,
        undefined,
        { userId: profile.id, size: pageSize, cursor: nextCursor },
      );
      const newFriends = result?.data?.map((f) => f.user) ?? [];
      setFriends((prev) => [...prev, ...newFriends]);
      setNextCursor(result?.nextCursor ?? null);
      setHasMore(Boolean(result?.hasMore));
    } catch {
      // giữ nguyên danh sách hiện tại nếu lỗi
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle
            className="cursor-pointer text-xl font-bold hover:underline"
            onClick={onViewAll}
          >
            Bạn bè
          </CardTitle>
          <p className="text-sm text-muted-foreground">{profile.friendCount} người bạn</p>
        </div>
        {onViewAll && (
          <Button
            variant="link"
            className="h-auto p-0 font-normal text-primary"
            onClick={onViewAll}
          >
            Xem tất cả bạn bè
          </Button>
        )}
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="py-4 text-center text-sm text-muted-foreground">Đang tải...</div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3">
              {friends.map((friend) => (
                <FriendMiniCard key={friend.id} friend={friend} />
              ))}
              {friends.length === 0 && (
                <p className="col-span-3 py-4 text-center text-sm text-muted-foreground">
                  Chưa có bạn bè nào
                </p>
              )}
            </div>

            {!isPreview && hasMore && (
              <div className="mt-4 flex justify-center">
                <Button variant="outline" onClick={handleLoadMore} disabled={loadingMore}>
                  {loadingMore ? "Đang tải..." : "Xem thêm"}
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
