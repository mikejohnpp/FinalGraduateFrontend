import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import { API } from "@/common/constants";
import friendService from "@/services/friendService";
import { friendActions } from "@/stores/friendSlice";
import type { AppDispatch, RootState } from "@/stores/store";
import type {
  IFriendRequest,
  IFriendRequestCreate,
} from "@/types/interfaces/friend/IFriendRequest";
import type { IFriendSuggestion } from "@/types/interfaces/friend/IFriendSuggestion";
import type { IFriendship } from "@/types/interfaces/friend/IFriendship";
import type { FriendStatus } from "@/types/interfaces/friend/IFriendStatus";
import type { CursorPageResponse } from "@/types/interfaces/post/IPostPage";

// ---------------------------------------------------------------------------
// useFriendRequests — Infinite scroll lời mời kết bạn đã nhận
// ---------------------------------------------------------------------------
export function useFriendRequests() {
  const dispatch = useDispatch<AppDispatch>();
  const { requests } = useSelector((s: RootState) => s.friend);
  const { userId } = useSelector((s: RootState) => s.user);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);

  const load = useCallback(
    async (cursor?: string | null) => {
      if (loadingRef.current || !userId) return;
      loadingRef.current = true;
      setLoading(true);
      try {
        const result = await friendService.getSingle<CursorPageResponse<IFriendRequest>>(
          API.FRIEND.REQUESTS,
          undefined,
          {
            userId,
            ...(cursor ? { cursor } : {}),
            size: 10,
          },
        );
        if (result) {
          cursor
            ? dispatch(friendActions.appendRequests(result))
            : dispatch(friendActions.setRequests(result));
        }
      } catch (e) {
        console.error("Lỗi khi tải lời mời kết bạn:", e);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [dispatch, userId],
  );

  useEffect(() => {
    load();
  }, [load]);

  const loadMore = useCallback(() => {
    if (requests.hasMore && requests.nextCursor) {
      load(requests.nextCursor);
    }
  }, [load, requests.hasMore, requests.nextCursor]);

  return {
    requests: requests.items,
    hasMore: requests.hasMore,
    loadMore,
    loading,
  };
}

// ---------------------------------------------------------------------------
// useFriendSuggestions — Infinite scroll gợi ý bạn bè
// ---------------------------------------------------------------------------
export function useFriendSuggestions() {
  const dispatch = useDispatch<AppDispatch>();
  const { suggestions } = useSelector((s: RootState) => s.friend);
  const { userId } = useSelector((s: RootState) => s.user);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);

  const load = useCallback(
    async (cursor?: string | null) => {
      if (loadingRef.current || !userId) return;
      loadingRef.current = true;
      setLoading(true);
      try {
        // cursor cho suggestions là User ID (string), không phải timestamp
        const result = await friendService.getSingle<CursorPageResponse<IFriendSuggestion>>(
          API.FRIEND.SUGGESTIONS,
          undefined,
          {
            userId,
            ...(cursor ? { cursor } : {}),
            size: 20,
          },
        );
        if (result) {
          cursor
            ? dispatch(friendActions.appendSuggestions(result))
            : dispatch(friendActions.setSuggestions(result));
        }
      } catch (e) {
        console.error("Lỗi khi tải gợi ý bạn bè:", e);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [dispatch, userId],
  );

  useEffect(() => {
    load();
  }, [load]);

  const loadMore = useCallback(() => {
    if (suggestions.hasMore && suggestions.nextCursor) {
      load(suggestions.nextCursor);
    }
  }, [load, suggestions.hasMore, suggestions.nextCursor]);

  return {
    suggestions: suggestions.items,
    hasMore: suggestions.hasMore,
    loadMore,
    loading,
  };
}

// ---------------------------------------------------------------------------
// useAllFriends — Infinite scroll danh sách bạn bè đã kết nối
// ---------------------------------------------------------------------------
export function useAllFriends() {
  const dispatch = useDispatch<AppDispatch>();
  const { friends } = useSelector((s: RootState) => s.friend);
  const { userId } = useSelector((s: RootState) => s.user);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);

  const load = useCallback(
    async (cursor?: string | null) => {
      if (loadingRef.current || !userId) return;
      loadingRef.current = true;
      setLoading(true);
      try {
        const result = await friendService.getSingle<CursorPageResponse<IFriendship>>(
          API.FRIEND.BASE,
          undefined,
          {
            userId,
            ...(cursor ? { cursor } : {}),
            size: 20,
          },
        );
        if (result) {
          cursor
            ? dispatch(friendActions.appendFriends(result))
            : dispatch(friendActions.setFriends(result));
        }
      } catch (e) {
        console.error("Lỗi khi tải danh sách bạn bè:", e);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [dispatch, userId],
  );

  useEffect(() => {
    load();
  }, [load]);

  const loadMore = useCallback(() => {
    if (friends.hasMore && friends.nextCursor) {
      load(friends.nextCursor);
    }
  }, [load, friends.hasMore, friends.nextCursor]);

  return {
    friends: friends.items,
    hasMore: friends.hasMore,
    loadMore,
    loading,
  };
}

// ---------------------------------------------------------------------------
// useAcceptRequest — Chấp nhận lời mời kết bạn (optimistic)
// ---------------------------------------------------------------------------
export function useAcceptRequest() {
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useSelector((s: RootState) => s.user);
  const requests = useSelector((s: RootState) => s.friend.requests);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const accept = async (requestId: number): Promise<boolean> => {
    if (!userId) return false;

    // Snapshot để rollback nếu fail
    const snapshot = requests.items.find((r) => r.requestId === requestId);

    // Optimistic update
    dispatch(friendActions.removeRequest(requestId));
    dispatch(friendActions.decrementRequestCount());
    setLoadingId(requestId);

    try {
      const success = await friendService.acceptRequest(requestId, userId);
      if (success) {
        toast.success("Chấp nhận lời mời thành công!");
      } else {
        // Rollback
        if (snapshot) {
          dispatch(
            friendActions.setRequests({
              data: [snapshot, ...requests.items.filter((r) => r.requestId !== requestId)],
              nextCursor: requests.nextCursor,
              hasMore: requests.hasMore,
            }),
          );
          dispatch(friendActions.setRequestCount(requests.items.length));
        }
        toast.error("Có lỗi xảy ra, vui lòng thử lại");
      }
      return success;
    } catch {
      // Rollback on error
      if (snapshot) {
        dispatch(
          friendActions.setRequests({
            data: [snapshot, ...requests.items.filter((r) => r.requestId !== requestId)],
            nextCursor: requests.nextCursor,
            hasMore: requests.hasMore,
          }),
        );
        dispatch(friendActions.setRequestCount(requests.items.length));
      }
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
      return false;
    } finally {
      setLoadingId(null);
    }
  };

  return { accept, loadingId };
}

// ---------------------------------------------------------------------------
// useDeclineRequest — Từ chối lời mời kết bạn (optimistic)
// ---------------------------------------------------------------------------
export function useDeclineRequest() {
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useSelector((s: RootState) => s.user);
  const requests = useSelector((s: RootState) => s.friend.requests);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const decline = async (requestId: number): Promise<void> => {
    if (!userId) return;

    const snapshot = requests.items.find((r) => r.requestId === requestId);

    // Optimistic update
    dispatch(friendActions.removeRequest(requestId));
    dispatch(friendActions.decrementRequestCount());
    setLoadingId(requestId);

    try {
      const success = await friendService.declineRequest(requestId, userId);
      if (!success) {
        // Rollback
        if (snapshot) {
          dispatch(
            friendActions.setRequests({
              data: [snapshot, ...requests.items.filter((r) => r.requestId !== requestId)],
              nextCursor: requests.nextCursor,
              hasMore: requests.hasMore,
            }),
          );
          dispatch(friendActions.setRequestCount(requests.items.length));
        }
        toast.error("Có lỗi xảy ra, vui lòng thử lại");
        return;
      } else {
        toast.success("Đã từ chối lời mời kết bạn");
      }
    } catch {
      if (snapshot) {
        dispatch(
          friendActions.setRequests({
            data: [snapshot, ...requests.items.filter((r) => r.requestId !== requestId)],
            nextCursor: requests.nextCursor,
            hasMore: requests.hasMore,
          }),
        );
        dispatch(friendActions.setRequestCount(requests.items.length));
      }
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoadingId(null);
    }
  };

  return { decline, loadingId };
}

// ---------------------------------------------------------------------------
// useSendFriendRequest — Gửi lời mời kết bạn (optimistic)
// ---------------------------------------------------------------------------
export function useSendFriendRequest() {
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useSelector((s: RootState) => s.user);
  const suggestions = useSelector((s: RootState) => s.friend.suggestions);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const send = async (targetUserId: number): Promise<boolean> => {
    if (!userId) return false;

    const snapshot = suggestions.items.find((s) => s.user.id === targetUserId);

    // Optimistic: ẩn ngay khỏi suggestions list
    dispatch(friendActions.removeSuggestion(targetUserId));
    setLoadingId(targetUserId);

    try {
      const data: IFriendRequestCreate = { userId, targetUserId };
      const success = await friendService.create(API.FRIEND.REQUESTS, data);
      if (success) {
        toast.success("Đã gửi lời mời kết bạn!");
      } else {
        // Rollback
        if (snapshot) {
          dispatch(
            friendActions.setSuggestions({
              data: [snapshot, ...suggestions.items.filter((s) => s.user.id !== targetUserId)],
              nextCursor: suggestions.nextCursor,
              hasMore: suggestions.hasMore,
            }),
          );
        }
        toast.error("Gửi lời mời thất bại, vui lòng thử lại");
      }
      return success;
    } catch (e: any) {
      if (snapshot) {
        dispatch(
          friendActions.setSuggestions({
            data: [snapshot, ...suggestions.items.filter((s) => s.user.id !== targetUserId)],
            nextCursor: suggestions.nextCursor,
            hasMore: suggestions.hasMore,
          }),
        );
      }
      // 409: đã là bạn bè hoặc đã gửi rồi
      const message: string = e?.response?.data?.message ?? "Có lỗi xảy ra";
      toast.error(message);
      return false;
    } finally {
      setLoadingId(null);
    }
  };

  return { send, loadingId };
}

// ---------------------------------------------------------------------------
// useUnfriend — Huỷ kết bạn (optimistic)
// ---------------------------------------------------------------------------
export function useUnfriend() {
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useSelector((s: RootState) => s.user);
  const friends = useSelector((s: RootState) => s.friend.friends);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const unfriend = async (friendUserId: number): Promise<boolean> => {
    if (!userId) return false;

    const snapshot = friends.items.find((f) => f.user.id === friendUserId);

    // Optimistic update
    dispatch(friendActions.removeFriend(friendUserId));
    setLoadingId(friendUserId);

    try {
      const success = await friendService.unfriend(friendUserId, userId);
      if (success) {
        toast.success("Đã huỷ kết bạn");
      } else {
        if (snapshot) {
          dispatch(
            friendActions.setFriends({
              data: [...friends.items.filter((f) => f.user.id !== friendUserId), snapshot],
              nextCursor: friends.nextCursor,
              hasMore: friends.hasMore,
            }),
          );
        }
        toast.error("Có lỗi xảy ra, vui lòng thử lại");
      }
      return success;
    } catch {
      if (snapshot) {
        dispatch(
          friendActions.setFriends({
            data: [...friends.items.filter((f) => f.user.id !== friendUserId), snapshot],
            nextCursor: friends.nextCursor,
            hasMore: friends.hasMore,
          }),
        );
      }
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
      return false;
    } finally {
      setLoadingId(null);
    }
  };

  return { unfriend, loadingId };
}

// ---------------------------------------------------------------------------
// useDismissSuggestion — Bỏ gợi ý (local only, không gọi API)
// ---------------------------------------------------------------------------
export function useDismissSuggestion() {
  const dispatch = useDispatch<AppDispatch>();

  const dismiss = useCallback(
    (targetUserId: number) => {
      dispatch(friendActions.removeSuggestion(targetUserId));
    },
    [dispatch],
  );

  return { dismiss };
}

// ---------------------------------------------------------------------------
// useFriendRequestCount — Badge count lời mời chưa xử lý
// ---------------------------------------------------------------------------
export function useFriendRequestCount() {
  const dispatch = useDispatch<AppDispatch>();
  const { requestCount } = useSelector((s: RootState) => s.friend);
  const { userId } = useSelector((s: RootState) => s.user);

  useEffect(() => {
    if (!userId) return;
    friendService
      .getSingle<number>(API.FRIEND.REQUESTS_COUNT, undefined, { userId })
      .then((count) => {
        if (count !== null) {
          dispatch(friendActions.setRequestCount(count));
        }
      })
      .catch((e) => console.error("Lỗi khi lấy badge count:", e));
  }, [dispatch, userId]);

  return { count: requestCount };
}

// ---------------------------------------------------------------------------
// useProfileFriendStatus — Trạng thái bạn bè trên trang profile người khác
// Bao gồm: fetch trạng thái, gửi lời mời, hủy lời mời, hủy kết bạn
// ---------------------------------------------------------------------------
export function useProfileFriendStatus(targetUserId: number | undefined) {
  const { userId: currentUserId } = useSelector((s: RootState) => s.user);
  const [status, setStatus] = useState<FriendStatus | null>(null);
  const [requestId, setRequestId] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!currentUserId || !targetUserId || currentUserId === targetUserId) return;
    let cancelled = false;
    const fetchStatus = async () => {
      setLoading(true);
      try {
        const res = await friendService.getFriendStatus(currentUserId, targetUserId);
        if (!cancelled && res) {
          setStatus(res.status);
          setRequestId(res.requestId);
        }
      } catch {
        // im lặng
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchStatus();
    return () => { cancelled = true; };
  }, [currentUserId, targetUserId]);

  const sendRequest = useCallback(async () => {
    if (!currentUserId || !targetUserId) return;
    setActionLoading(true);
    try {
      const success = await friendService.sendRequest(currentUserId, targetUserId);
      if (success) {
        setStatus("PENDING_SENT");
        toast.success("Đã gửi lời mời kết bạn!");
      } else {
        toast.error("Gửi lời mời thất bại, vui lòng thử lại");
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Có lỗi xảy ra");
    } finally {
      setActionLoading(false);
    }
  }, [currentUserId, targetUserId]);

  const cancelRequest = useCallback(async () => {
    if (!currentUserId || !targetUserId) return;
    setActionLoading(true);
    try {
      const success = await friendService.cancelFriendRequest(currentUserId, targetUserId);
      if (success) {
        setStatus("NOT_FRIENDS");
        setRequestId(undefined);
        toast.success("Đã hủy lời mời kết bạn");
      } else {
        toast.error("Hủy lời mời thất bại, vui lòng thử lại");
      }
    } catch {
      toast.error("Có lỗi xảy ra");
    } finally {
      setActionLoading(false);
    }
  }, [currentUserId, targetUserId]);

  const acceptRequest = useCallback(async () => {
    if (!requestId) return;
    setActionLoading(true);
    try {
      const success = await friendService.acceptRequest(requestId, currentUserId!);
      if (success) {
        setStatus("FRIENDS");
        setRequestId(undefined);
        toast.success("Đã chấp nhận lời mời kết bạn!");
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại");
      }
    } catch {
      toast.error("Có lỗi xảy ra");
    } finally {
      setActionLoading(false);
    }
  }, [requestId, currentUserId]);

  const unfriend = useCallback(async () => {
    if (!currentUserId || !targetUserId) return;
    setActionLoading(true);
    try {
      const success = await friendService.unfriend(targetUserId, currentUserId);
      if (success) {
        setStatus("NOT_FRIENDS");
        toast.success("Đã hủy kết bạn");
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại");
      }
    } catch {
      toast.error("Có lỗi xảy ra");
    } finally {
      setActionLoading(false);
    }
  }, [currentUserId, targetUserId]);

  return { status, loading, actionLoading, sendRequest, cancelRequest, acceptRequest, unfriend };
}

