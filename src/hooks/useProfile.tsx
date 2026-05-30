import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { API } from "@/common/constants";
import userService from "@/services/userService";
import postService from "@/services/postService";
import type { AppDispatch, RootState } from "@/stores/store";
import { userActions } from "@/stores/userSlice";
import type { UserProfileDTO } from "@/types/interfaces/user/UserProfileDTO";
import type { IProfileUpdate } from "@/types/interfaces/user/IProfileUpdate";
import type { IPost } from "@/types/interfaces/post/IPost";
import { resolveUploadUrl } from "@/utils/uploadHelper";

/**
 * Fetch profile của một user và tính isOwner.
 * Lưu profile vào Redux store (userActions.setProfile) nếu là chính mình.
 */
export function useProfile(userId: number | string | undefined) {
  const dispatch = useDispatch<AppDispatch>();
  const currentUserId = useSelector((r: RootState) => r.user.userId);
  const [profile, setProfile] = useState<UserProfileDTO | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    const id = typeof userId === "string" ? parseInt(userId, 10) : userId;
    if (isNaN(id)) return;

    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await userService.getProfile(id);
        if (res?.data) {
          setProfile(res.data);
          const owner = res.data.id === currentUserId;
          setIsOwner(owner);
          // Nếu là chính mình → cập nhật store
          if (owner) {
            dispatch(userActions.setProfile(res.data));
          }
        } else {
          setError("Không tìm thấy người dùng");
        }
      } catch {
        setError("Lỗi khi tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [userId, currentUserId, dispatch]);

  return { profile, isOwner, loading, error };
}

/**
 * Cập nhật thông tin profile — partial update.
 * Sau khi thành công, cập nhật Redux store và local profile state.
 */
export function useUpdateProfile() {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((r: RootState) => r.user.userId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(
    async (data: IProfileUpdate): Promise<UserProfileDTO | null> => {
      if (!userId) return null;
      setLoading(true);
      setError(null);
      try {
        const res = await userService.updateProfile(userId, data);
        if (res?.data) {
          dispatch(userActions.setProfile(res.data));
          toast.success("Cập nhật thông tin thành công!");
          return res.data;
        }
        return null;
      } catch {
        const msg = "Cập nhật thông tin thất bại";
        setError(msg);
        toast.error(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [userId, dispatch]
  );

  return { update, loading, error };
}

/**
 * Upload ảnh đại diện mới.
 * Trả về URL đầy đủ đã được resolve sau khi upload thành công.
 */
export function useUploadAvatar() {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((r: RootState) => r.user.userId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File): Promise<string | null> => {
      if (!userId) return null;
      setLoading(true);
      setError(null);
      try {
        const res = await userService.uploadAvatar(userId, file);
        if (res?.data) {
          const url = resolveUploadUrl(res.data);
          dispatch(userActions.updateProfile({ avatar: url }));
          toast.success("Cập nhật ảnh đại diện thành công!");
          return url;
        }
        return null;
      } catch {
        const msg = "Upload ảnh đại diện thất bại";
        setError(msg);
        toast.error(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [userId, dispatch]
  );

  return { upload, loading, error };
}

/**
 * Upload ảnh bìa mới.
 * Trả về URL đầy đủ đã được resolve sau khi upload thành công.
 */
export function useUploadCover() {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((r: RootState) => r.user.userId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File): Promise<string | null> => {
      if (!userId) return null;
      setLoading(true);
      setError(null);
      try {
        const res = await userService.uploadCover(userId, file);
        if (res?.data) {
          const url = resolveUploadUrl(res.data);
          dispatch(userActions.updateProfile({ coverPhoto: url }));
          toast.success("Cập nhật ảnh bìa thành công!");
          return url;
        }
        return null;
      } catch {
        const msg = "Upload ảnh bìa thất bại";
        setError(msg);
        toast.error(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [userId, dispatch]
  );

  return { upload, loading, error };
}

/**
 * Lấy danh sách bài viết của một user cụ thể.
 * GET /users/posts?userId={userId} — trả về List<PostSummaryDTO> (không cursor).
 */
export function useUserPosts(userId: number | string | undefined) {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    const id = typeof userId === "string" ? parseInt(userId, 10) : userId;
    if (isNaN(id)) return;

    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await postService.getList<IPost>(API.POST.BASE, undefined, { userId: id });
        setPosts(result ?? []);
      } catch {
        setError("Lỗi khi tải bài viết");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [userId]);

  return { posts, loading, error };
}
