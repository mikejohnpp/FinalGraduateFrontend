import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { RootState } from "@/stores/store";
import { storyActions } from "@/stores/storySlice";
import { uploadToStorage } from "@/plugins/storage";
import storyService from "@/services/StoryService";
import type { StoryType } from "@/views/story/types";
import type { IGroupedStory } from "@/types/interfaces/story/IStory";
interface CreateStoryParams {
  storyType: StoryType;
  textContent: string;
  selectedBg: string;
  imageFile: File | null;
  videoFile: File | null;
  musicFile: File | null;
  overlayText: string;
}

export function useCreateStory() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.user.userId);
  const [loading, setLoading] = useState(false);

  const create = async ({
    storyType,
    textContent,
    selectedBg,
    imageFile,
    videoFile,
    musicFile,
    overlayText,
  }: CreateStoryParams) => {
    if (!userId) {
      toast.error("Bạn chưa đăng nhập");
      return;
    }
    if (!storyType) return;

    setLoading(true);
    const toastId = toast.loading("Đang đăng tin...");

    try {
      let urlImage: string | undefined;
      let urlVideo: string | undefined;
      let content: string | undefined;
      let color: string | undefined;

      if (storyType === "text") {
        if (!textContent.trim()) {
          toast.error("Vui lòng nhập nội dung", { id: toastId });
          return;
        }
        content = textContent.trim();
        color = selectedBg;
      }

      if (storyType === "image") {
        if (!imageFile) {
          toast.error("Vui lòng chọn ảnh", { id: toastId });
          return;
        }
        const result = await uploadToStorage(imageFile);
        urlImage = result.url;
        if (overlayText.trim()) content = overlayText.trim();
      }

      if (storyType === "video") {
        if (!videoFile) {
          toast.error("Vui lòng chọn video", { id: toastId });
          return;
        }
        const result = await uploadToStorage(videoFile);
        urlVideo = result.url;
      } else if (musicFile) {
        const result = await uploadToStorage(musicFile);
        urlVideo = result.url;
      }

      const story = await storyService.createStory({
        userId: Number(userId),
        content,
        urlImage,
        urlVideo,
        type: "STORY",
        color,
      });

      if (!story) throw new Error("Không nhận được phản hồi từ server");

      dispatch(storyActions.addStory(story));

      toast.success("Đăng tin thành công!", { id: toastId });
      navigate("/");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Đăng tin thất bại";
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return { create, loading };
}

export function useFriendsStories() {
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.user.userId);
  const { stories, loading } = useSelector((state: RootState) => state.story);

  const fetchStories = async () => {
    if (!userId) return;
    dispatch(storyActions.setLoading(true));
    try {
      const data = await storyService.getFriendsStories(Number(userId));
      dispatch(storyActions.setStories(data));
    } catch (err) {
      console.error("Failed to fetch stories:", err);
    } finally {
      dispatch(storyActions.setLoading(false));
    }
  };

  useEffect(() => {
    fetchStories();
  }, [userId]);

  const groupedStories = useMemo(() => {
    const map = new Map<number, IGroupedStory>();

    const sorted = [...stories].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    sorted.forEach((story) => {
      if (!map.has(story.user.id)) {
        map.set(story.user.id, {
          user: story.user,
          stories: [],
        });
      }

      map.get(story.user.id)!.stories.push(story);
    });

    return Array.from(map.values());
  }, [stories]);

  return { groupedStories, loading, refetch: fetchStories, rawStories: stories };
}
