import { useState, useCallback, useEffect, useRef } from "react";
import { API } from "@/common/constants";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/stores/store";
import { groupActions } from "@/stores/groupSlice";
import groupService from "@/services/groupService";
import type { IGroup } from "@/types/interfaces/group/IGroup";
import type { IGroupMember } from "@/types/interfaces/group/IGroupMember";
import type { IPost } from "@/types/interfaces/post/IPost";
import type { CursorPageResponse } from "@/types/interfaces/post/IPostPage";
import { uploadImageToSupabase } from "@/utils/mediaUpload";
import { toast } from "sonner";


export function useGroupsData() {
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useSelector((r: RootState) => r.user);
  const { joinedGroups, suggestedGroups } = useSelector((r: RootState) => r.group);
  const [loading, setLoading] = useState(false);

  const fetchGroups = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [joined, suggested] = await Promise.all([
        groupService.getList<IGroup>(API.GROUP.JOINED, undefined, { userId }),
        groupService.getList<IGroup>(API.GROUP.SUGGESTED, undefined, { userId }),
      ]);
      dispatch(groupActions.setJoinedGroups(joined));
      dispatch(groupActions.setSuggestedGroups(suggested));
    } catch (e) {
      console.error(e);
      toast.error("Không thể lấy danh sách nhóm");
    } finally {
      setLoading(false);
    }
  }, [userId, dispatch]);

  useEffect(() => {
    if (userId && joinedGroups.length === 0 && suggestedGroups.length === 0) {
      fetchGroups();
    }
  }, [userId, joinedGroups.length, suggestedGroups.length, fetchGroups]);

  return { joinedGroups, suggestedGroups, loading, refetch: fetchGroups };
}

export function useGroupDetail(groupId: number) {
  const { userId } = useSelector((r: RootState) => r.user);
  const [group, setGroup] = useState<IGroup | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!userId || !groupId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await groupService.getSingle<IGroup>(API.GROUP.BASE, groupId, { userId });
      setGroup(data);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Không thể lấy thông tin nhóm");
    } finally {
      setLoading(false);
    }
  }, [userId, groupId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return { group, loading, error, refetch: fetchDetail, setGroup };
}

export function useGroupMembers(groupId: number) {
  const [members, setMembers] = useState<IGroupMember[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMembers = useCallback(async () => {
    if (!groupId) return;
    setLoading(true);
    try {
      const data = await groupService.getList<IGroupMember>(`${API.GROUP.BASE}/${groupId}/members`);
      setMembers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return { members, loading, refetch: fetchMembers };
}

export function useGroupActions() {
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useSelector((r: RootState) => r.user);
  const [loading, setLoading] = useState(false);

  const joinGroup = async (group: IGroup) => {
    if (!userId) return false;
    setLoading(true);
    try {
      const data = await groupService.createAndGetData<{ status: 'PENDING' | 'APPROVED' }>(
        `${API.GROUP.BASE}/${group.id}/join?userId=${userId}`,
        null,
      );
      if (data) {
        if (data.status === 'APPROVED') {
          dispatch(groupActions.addJoinedGroup({ ...group, isJoined: true, role: "MEMBER" }));
          toast.success("Đã tham gia nhóm");
        } else if (data.status === 'PENDING') {
          dispatch(groupActions.updateGroup({ id: group.id, isPending: true }));
          toast.success("Đã gửi yêu cầu tham gia nhóm");
        }
        return true;
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Lỗi khi tham gia nhóm");
    } finally {
      setLoading(false);
    }
    return false;
  };

  const leaveGroup = async (groupId: number) => {
    if (!userId) return false;
    setLoading(true);
    try {
      const success = await groupService.create(
        `${API.GROUP.BASE}/${groupId}/leave?userId=${userId}`,
        null,
      );
      if (success) {
        dispatch(groupActions.removeJoinedGroup(groupId));
        toast.success("Đã rời nhóm");
        return true;
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Lỗi khi rời nhóm");
    } finally {
      setLoading(false);
    }
    return false;
  };

  const createGroup = async (data: {
    name: string;
    privacy: "public" | "private";
    invitees?: number[];
  }) => {
    if (!userId) return null;
    setLoading(true);
    try {
      const newGroup = await groupService.createAndGetData<IGroup>(
        `${API.GROUP.BASE}?userId=${userId}`,
        data,
      );
      if (newGroup) {
        dispatch(groupActions.addJoinedGroup(newGroup));
        toast.success("Tạo nhóm thành công");
        return newGroup;
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Lỗi khi tạo nhóm");
    } finally {
      setLoading(false);
    }
    return null;
  };

  return { joinGroup, leaveGroup, createGroup, loading };
}

export function useGroupFeed() {
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useSelector((r: RootState) => r.user);
  const { groupFeed } = useSelector((r: RootState) => r.group);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef(false);
  const hasFetched = useRef(false);

  const fetchFeed = useCallback(
    async (isLoadMore = false) => {
      if (!userId) return;
      if (loadingRef.current) return;
      if (isLoadMore && !groupFeed.hasMore) return;

      loadingRef.current = true;
      setLoading(true);
      setError(null);
      try {
        const cursor = isLoadMore ? groupFeed.nextCursor || undefined : undefined;
        const data = await groupService.getSingle<CursorPageResponse<IPost>>(
          API.GROUP.FEED,
          undefined,
          { userId, ...(cursor ? { cursor } : {}), size: 10 },
        );
        if (data) {
          if (isLoadMore) {
            dispatch(groupActions.appendGroupFeed(data));
          } else {
            dispatch(groupActions.setGroupFeed(data));
          }
        }
      } catch (e: any) {
        setError(e?.response?.data?.message || "Lỗi tải bảng tin nhóm");
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [userId, groupFeed.hasMore, groupFeed.nextCursor, dispatch],
  );

  useEffect(() => {
    if (userId && !hasFetched.current) {
      hasFetched.current = true;
      fetchFeed();
    }
  }, [userId, fetchFeed]);

  const loadMore = useCallback(() => {
    fetchFeed(true);
  }, [fetchFeed]);

  return { feed: groupFeed, loading, error, loadMore, refetch: () => fetchFeed(false) };
}

export function useSingleGroupPosts(groupId: number) {
  const { userId } = useSelector((r: RootState) => r.user);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(
    async (isLoadMore = false) => {
      if (!userId || !groupId) return;
      if (isLoadMore && (!hasMore || loading)) return;

      setLoading(true);
      setError(null);
      try {
        const cursor = isLoadMore ? nextCursor || undefined : undefined;
        const data = await groupService.getSingle<CursorPageResponse<IPost>>(
          `${API.GROUP.BASE}/${groupId}/posts`,
          undefined,
          { userId, ...(cursor ? { cursor } : {}), size: 10 },
        );
        if (data) {
          if (isLoadMore) {
            setPosts((prev) => [...prev, ...data.data]);
          } else {
            setPosts(data.data);
          }
          setNextCursor(data.nextCursor);
          setHasMore(data.hasMore);
        }
      } catch (e: any) {
        setError(e?.response?.data?.message || "Lỗi tải bài viết nhóm");
      } finally {
        setLoading(false);
      }
    },
    [userId, groupId, hasMore, nextCursor, loading],
  );

  useEffect(() => {
    fetchPosts();
  }, [userId, groupId]);

  const loadMore = () => {
    fetchPosts(true);
  };

  const prependPost = (post: IPost) => {
    setPosts((prev) => [post, ...prev]);
  };

  return {
    posts,
    loading,
    error,
    hasMore,
    loadMore,
    refetch: () => fetchPosts(false),
    prependPost,
  };
}

/**
 * Cập nhật ảnh đại diện / ảnh bìa của nhóm (chỉ ADMIN).
 * Upload ảnh lên Supabase → lấy URL → PUT tới BE (BE chỉ lưu link).
 * Trả về IGroup đã cập nhật để caller render lại mà không cần fetch lại.
 */
export function useGroupImage() {
  const { userId } = useSelector((r: RootState) => r.user);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const uploadAvatar = async (groupId: number, file: File): Promise<IGroup | null> => {
    if (!userId) return null;
    setUploadingAvatar(true);
    try {
      const url = await uploadImageToSupabase(file);
      const group = await groupService.updateGroupAvatar(groupId, userId, url);
      if (group) toast.success("Cập nhật ảnh đại diện nhóm thành công!");
      return group;
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "Cập nhật ảnh đại diện thất bại");
      return null;
    } finally {
      setUploadingAvatar(false);
    }
  };

  const uploadCover = async (groupId: number, file: File): Promise<IGroup | null> => {
    if (!userId) return null;
    setUploadingCover(true);
    try {
      const url = await uploadImageToSupabase(file);
      const group = await groupService.updateGroupCover(groupId, userId, url);
      if (group) toast.success("Cập nhật ảnh bìa nhóm thành công!");
      return group;
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "Cập nhật ảnh bìa thất bại");
      return null;
    } finally {
      setUploadingCover(false);
    }
  };

  return { uploadAvatar, uploadCover, uploadingAvatar, uploadingCover };
}

